const Sliders = require("../models/sliders");

exports.createSlide = (req, res, next) => {
  const slide = new Sliders({
    ...req.body,
  });

  slide
    .save()
    .then(() => res.status(201).json(slide))
    .catch((error) => res.status(400).json({ error }));
};

exports.getSlide = (req, res, next) => {
  Sliders.findOne({ _id: req.params.id })
    .then((project) => res.status(200).json(slide))
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteSlide = (req, res, next) => {
  Sliders.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "projet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getSliders = (req, res, next) => {
  Sliders.find()
    .then((sliders) => res.status(200).json(sliders))
    .catch((error) => res.status(400).json({ error }));
};
