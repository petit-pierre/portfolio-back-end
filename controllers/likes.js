const Likes = require("../models/likes");

exports.createLike = (req, res, next) => {
  const like = new Likes({
    ...req.body,
  });
  like
    .save()
    .then(() => res.status(201).json(like))
    .catch((error) => res.status(400).json({ error }));
};

exports.getLike = (req, res, next) => {
  Likes.findOne({ _id: req.params.id })
    .then((like) => res.status(200).json(like))
    .catch((error) => res.status(404).json({ error }));
};

// exports.putLike = (req, res, next) => {
//   Likes.updateOne({ _id: req.params.id }, { ...req.body })
//     .then(() => res.status(200).json({ message: "like modifié !" }))
//     .catch((error) => res.status(400).json({ error }));
// };

exports.putLike = (req, res, next) => {
  Likes.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true })
    .then((updatedLike) => {
      if (!updatedLike) {
        // Si on renvoie une réponse d'erreur, on met un "return"
        // pour stopper net l'exécution de la fonction ici !
        return res.status(404).json({ error: "Like non trouvé !" });
      }

      // 1. On émet d'abord via Socket.io (opération asynchrone interne)
      if (req.io) {
        req.io.emit("receive_message", {
          id: req.params.id,
          likes: updatedLike.likes,
        });
      }

      // 2. On envoie la réponse HTTP unique au client
      return res.status(200).json({ message: "Like modifié !", updatedLike });
    })
    .catch((error) => {
      // Sécurité : on vérifie si les headers n'ont pas déjà été envoyés avant de répondre
      if (!res.headersSent) {
        return res.status(400).json({ error });
      }
    });
};

exports.deleteLike = (req, res, next) => {
  Likes.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "like supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getLikes = (req, res, next) => {
  Likes.find()
    .then((likes) => res.status(200).json(likes))
    .catch((error) => res.status(400).json({ error }));
};
