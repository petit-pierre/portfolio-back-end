require("dotenv").config();
const mongoose = require("mongoose");
const ChatSession = require("../models/chat");
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// const nodemailer = require("nodemailer"); // Bientôt pour l'envoi d'e-mail

exports.postMessage = (req, res, next) => {
  const { conversationId, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Le message est requis !" });
  }

  // 2. On vérifie si le conversationId fourni est un ObjectId MongoDB valide.
  // Si oui, on le cherche ; sinon (s'il est absent, vide, null ou invalide), on crée une nouvelle session.
  const findOrCreateSession = mongoose.Types.ObjectId.isValid(conversationId)
    ? ChatSession.findById(conversationId)
    : Promise.resolve(new ChatSession({ messages: [] }));

  findOrCreateSession
    .then((session) => {
      // Si un ID était fourni mais n'existe pas en base, on peut soit renvoyer une 404, soit en recréer un.
      // Ici, si lsession est null, on en initialise une neuve par sécurité :
      let currentSession = session;
      if (!currentSession) {
        currentSession = new ChatSession({ messages: [] });
      }

      // Formater l'historique pour Gemini
      const formattedHistory = currentSession.messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const chat = ai.chats.create({
        model: "gemini-3.5-flash-lite", // ou ton modèle actuel
        history: formattedHistory,
        config: {
          systemInstruction:
            "Tu es l'assistant de Pierre Aubrée, développeur web freelance. Ton rôle est d'accueillir les visiteurs, de comprendre leur besoin et de récupérer leur e-mail.",
        },
      });

      return chat.sendMessage({ message }).then((response) => {
        const replyText =
          response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;

        currentSession.messages.push({ role: "user", content: message });
        currentSession.messages.push({ role: "model", content: replyText });
        currentSession.lastInteractionAt = Date.now();

        // Capture d'e-mail par regex
        const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (emailMatch && !currentSession.visitorEmail) {
          currentSession.visitorEmail = emailMatch[0];
          console.log("E-mail capturé :", currentSession.visitorEmail);
        }

        return currentSession.save().then((savedSession) => {
          return res.status(200).json({
            reply: replyText,
            conversationId: savedSession._id,
          });
        });
      });
    })
    .catch((error) => {
      console.error("Erreur dans postMessage :", error);
      if (!res.headersSent) {
        return res.status(500).json({ error: "Erreur serveur" });
      }
    });
};

exports.getSession = (req, res, next) => {
  ChatSession.findById(req.params.sessionId)
    .then((session) => {
      if (!session) {
        return res.status(404).json({ error: "Session non trouvée !" });
      }
      return res.status(200).json(session);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getSessions = (req, res, next) => {
  ChatSession.find()
    .then((sessions) => res.status(200).json(sessions))
    .catch((error) => res.status(400).json({ error }));
};
