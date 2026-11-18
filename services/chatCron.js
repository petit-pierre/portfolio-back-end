const cron = require("node-cron");
const nodemailer = require("nodemailer");
const ChatSession = require("../models/chat");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "localhost",
  port: process.env.MAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const parseMarkdownToHtml = (text) => {
  if (!text) return "";

  return (
    text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" style="color: #99477a; text-decoration: underline;">$1</a>',
      )
      // Sauts de ligne : \n -> <br>
      .replace(/\n/g, "<br>")
  );
};

cron.schedule("0 * * * *", async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const inactiveSessions = await ChatSession.find({
      lastInteractionAt: { $lt: oneHourAgo },
    });

    if (inactiveSessions.length === 0) return;

    console.log(
      `[CRON] ${inactiveSessions.length} session(s) inactive(s) détectée(s). Traitement...`,
    );

    for (const session of inactiveSessions) {
      const transcriptHtml = session.messages
        .map((m) => {
          const isUser = m.role === "user";
          const bgColor = isUser ? "#ffffff" : "#99477a";
          const textColor = isUser ? "#000000" : "#ffffff";
          const senderLabel = isUser ? "Visiteur" : "Assistant";
          const alignment = isUser ? "left" : "right";
          const formattedContent = isUser
            ? m.content
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\n/g, "<br>")
            : parseMarkdownToHtml(m.content);

          return `
            <div style="width: 100%; background-color: ${bgColor}; text-align: ${alignment}; color: ${textColor}; padding: 15px 20px; box-sizing: border-box; border-bottom: 1px solid #eaeaea; font-family: Arial, sans-serif;">
              <strong style="font-size: 12px; opacity: 0.8; text-transform: uppercase; display: block; margin-bottom: 5px;">${senderLabel}</strong>
              <div style="font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${formattedContent}</div>
            </div>
          `;
        })
        .join("");

      const visitorInfo = session.visitorEmail
        ? session.visitorEmail
        : "Non renseigné (Anonyme)";

      const mailOptions = {
        from: process.env.MAIL_FROM || "no-reply@l-araignee.net",
        to: process.env.MAIL_TO || process.env.MAIL_USER,
        subject: `[Portfolio] Conversation expirée - Contact : ${visitorInfo}`,
        text: `Cette conversation a expiré après 1 heure d'inactivité.\n\nE-mail du visiteur : ${visitorInfo}`, // Version texte de secours
        html: `
          <div style="max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; font-family: Arial, sans-serif; font-size: 18px; border-bottom: 2px solid #99477a; padding-bottom: 10px;">
              Conversation expirée
            </h2>
            <p style="font-family: Arial, sans-serif; color: #555; font-size: 14px;">
              <strong>E-mail du visiteur :</strong> ${visitorInfo}
            </p>
            <p style="font-family: Arial, sans-serif; color: #555; font-size: 14px; margin-bottom: 20px;">
              <strong>ID de session :</strong> ${session._id}
            </p>
            
            <div style="border: 1px solid #ddd; overflow: hidden;">
              ${transcriptHtml}
            </div>
          </div>
        `,
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
