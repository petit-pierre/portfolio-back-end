require("dotenv").config();
const mongoose = require("mongoose");
const ChatSession = require("../models/chat");
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.postMessage = (req, res, next) => {
  const { conversationId, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Le message est requis !" });
  }

  const findOrCreateSession = mongoose.Types.ObjectId.isValid(conversationId)
    ? ChatSession.findById(conversationId)
    : Promise.resolve(new ChatSession({ messages: [] }));

  findOrCreateSession
    .then((session) => {
      let currentSession = session;
      if (!currentSession) {
        currentSession = new ChatSession({ messages: [] });
      }

      const formattedHistory = currentSession.messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const chat = ai.chats.create({
        model: "gemini-3.5-flash-lite",
        history: formattedHistory,
        config: {
          systemInstruction:
            "Tu es l'assistant de Pierre Aubrée, développeur web freelance. Ton rôle est d'accueillir les visiteurs, de comprendre leur besoin et de récupérer un moyen de les contacter (telephone ou e-mail), tu peux aussi leurs proposer de réserver un rendez-vous via calendly: https://calendly.com/l-araignee/entretien-en-visio.",
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
