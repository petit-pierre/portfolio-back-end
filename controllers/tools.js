const Tools = require("../models/tools");

exports.createTool = (req, res, next) => {
  const tool = new Tools({
    ...req.body,
  });
  tool
    .save()
    .then(() => res.status(201).json(tool))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteTool = (req, res, next) => {
  Tools.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "tool supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getTools = (req, res, next) => {
  Tools.find()
    .then((tools) => res.status(200).json(tools))
    .catch((error) => res.status(400).json({ error }));
};
