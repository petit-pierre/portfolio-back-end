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

exports.putLike = (req, res, next) => {
  Likes.updateOne({ _id: req.params.id }, { ...req.body })
    .then(() => res.status(200).json({ message: "like modifié !" }))
    .catch((error) => res.status(400).json({ error }));
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
