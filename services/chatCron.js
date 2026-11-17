const cron = require("node-cron");
const nodemailer = require("nodemailer");
const ChatSession = require("../models/chat");

// Transporteur Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "localhost",
  port: process.env.MAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Planification : s'exécute toutes les heures (à la minute 0) -> "0 * * * *"
// Pour tester en dev, tu peux remplacer par "* * * * *" (toutes les minutes)
cron.schedule("0 * * * *", async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // On cherche les sessions sans interaction depuis plus d'1 heure
    const inactiveSessions = await ChatSession.find({
      lastInteractionAt: { $lt: oneHourAgo },
    });

    if (inactiveSessions.length === 0) return;

    console.log(
      `[CRON] ${inactiveSessions.length} session(s) inactive(s) détectée(s). Traitement...`,
    );

    for (const session of inactiveSessions) {
      // Formater l'historique complet
      const transcript = session.messages
        .map(
          (m) =>
            `${m.role === "user" ? "Visiteur" : "Assistant"}: ${m.content}`,
        )
        .join("\n\n");

      // Gérer l'affichage si le visiteur n'a pas laissé d'e-mail
      const visitorInfo = session.visitorEmail
        ? session.visitorEmail
        : "Non renseigné (Anonyme)";

      const mailOptions = {
        from: process.env.MAIL_FROM || "no-reply@l-araignee.net",
        to: process.env.MAIL_TO || process.env.MAIL_USER,
        subject: `[Portfolio] Conversation expirée - Contact : ${visitorInfo}`,
        text: `Cette conversation a expiré après 1 heure d'inactivité.\n\nE-mail du visiteur : ${visitorInfo}\n\nHistorique complet :\n\n${transcript}`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`[CRON] E-mail envoyé pour la session ${session._id}`);
        await ChatSession.findByIdAndDelete(session._id);
      } catch (mailError) {
        console.error(
          `[CRON] Erreur d'envoi de mail pour ${session._id}:`,
          mailError,
        );
      }
    }

    console.log("[CRON] Nettoyage des sessions inactives terminé.");
  } catch (error) {
    console.error(
      "[CRON] Erreur lors du traitement des sessions inactives :",
      error,
    );
  }
});
