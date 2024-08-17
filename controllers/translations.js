const Translations = require("../models/translations");

exports.createTranslation = (req, res, next) => {
  const translation = new Translations({
    ...req.body,
  });
  translation
    .save()
    .then(() => res.status(201).json(translation))
    .catch((error) => res.status(400).json({ error }));
};

exports.getTranslation = (req, res, next) => {
  Translations.findOne({ _id: req.params.id })
    .then((translation) => res.status(200).json(translation))
    .catch((error) => res.status(404).json({ error }));
};

exports.putTranslation = (req, res, next) => {
  Translations.updateOne({ _id: req.params.id }, { ...req.body })
    .then(() => res.status(200).json({ message: "translation modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteTranslation = (req, res, next) => {
  Translations.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "translation supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getTranslations = (req, res, next) => {
  Translations.find()
    .then((translations) => res.status(200).json(translations))
    .catch((error) => res.status(400).json({ error }));
};
