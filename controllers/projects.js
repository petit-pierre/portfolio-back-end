const Projects = require("../models/projects");

exports.createProject = (req, res, next) => {
  const project = new Projects({
    ...req.body,
  });

  project
    .save()
    .then(() => res.status(201).json(project))
    .catch((error) => res.status(400).json({ error }));
};

exports.getProject = (req, res, next) => {
  Projects.findOne({ _id: req.params.id })
    .then((project) => res.status(200).json(project))
    .catch((error) => res.status(404).json({ error }));
};

exports.putProject = (req, res, next) => {
  Projects.updateOne({ _id: req.params.id }, { ...req.body })
    .then(() => res.status(200).json({ message: "projet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};
/*exports.putProject = (req, res, next) => {
  const projectObject = req.file
    ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete projectObject._userId;
  Projects.findOne({ _id: req.params.id })
    .then((project) => {
      if (project.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Projects.updateOne(
          { _id: req.params.id },
          { ...projectObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};*/

exports.deleteProject = (req, res, next) => {
  Projects.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "projet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getProjects = (req, res, next) => {
  Projects.find()
    .then((projects) => res.status(200).json(projects))
    .catch((error) => res.status(400).json({ error }));
};
