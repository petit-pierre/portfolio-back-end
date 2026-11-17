const express = require("express");
const chatCtrl = require("../controllers/chat");
const router = express.Router();

// Route pour envoyer un message au chatbot (crée ou met à jour la session)
router.post("/", chatCtrl.postMessage);

// Route pour récupérer une session spécifique par son ID (utile pour le debug ou le back-office)
router.get("/:sessionId", chatCtrl.getSession);

// Route pour récupérer toutes les sessions de chat
router.get("/", chatCtrl.getSessions);

module.exports = router;
