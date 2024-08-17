const Skills = require("../models/skills");

exports.createSkill = (req, res, next) => {
  const skill = new Skills({
    ...req.body,
  });
  skill
    .save()
    .then(() => res.status(201).json(skill))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSkill = (req, res, next) => {
  Skills.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "skill supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getSkills = (req, res, next) => {
  Skills.find()
    .then((skills) => res.status(200).json(skills))
    .catch((error) => res.status(400).json({ error }));
};
