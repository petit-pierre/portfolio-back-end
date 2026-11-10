const express = require("express");
const mongoose = require("mongoose");
const projectsRoutes = require("./routes/projects");
const slidersRoutes = require("./routes/sliders");
const translationsRoutes = require("./routes/translations");
const userRoutes = require("./routes/user");
const skillsRoutes = require("./routes/skills");
const toolsRoutes = require("./routes/tools");
const pictureRoutes = require("./routes/pictures");
const likesRoutes = require("./routes/likes");
const app = express();
const path = require("path");
const code = require("./code.json");
require("dotenv").config();

// mongoose
//   .connect(code.code, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connexion à MongoDB réussie !"))
//   .catch(() => console.log("Connexion à MongoDB échouée !"));

mongoose
  .connect(code.code)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("Connexion à MongoDB échouée !", err));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

app.use((req, res, next) => {
  req.io = app.get("io");
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/projects", projectsRoutes);
app.use("/api/sliders", slidersRoutes);
app.use("/api/translations", translationsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/pictures", pictureRoutes);
app.use("/api/likes", likesRoutes);
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Route pour le chatbot IA
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Message reçu pour l'IA :", message);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `Tu es l'assistant de Pierre Aubrée, développeur web freelance. Réponds à ceci : ${message}`,
    });

    console.log("Réponse reçue de Google AI");

    // Selon la structure du nouveau SDK `@google/genai`, le texte peut se récupérer via .text ou une autre propriété
    const replyText =
      response.text ||
      (response.candidates && response.candidates[0]?.content?.parts[0]?.text);

    return res.status(200).json({ reply: replyText });
  } catch (error) {
    console.error("Erreur attrapée dans /api/chat :", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Erreur avec l'IA" });
    }
  }
});
module.exports = app;
