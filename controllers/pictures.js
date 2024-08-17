const Picture = require("../models/pictures");
const fs = require("fs");

exports.createPicture = async (req, res, next) => {
  const sliderPicture = req.body.imageUrl;
  const picture = new Picture({
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  picture
    .save()
    .then(() => {
      res.status(201).json(picture);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deletePicture = (req, res, next) => {
  Picture.findOne({ _id: req.params.id })
    .then((picture) => {
      const filename = picture.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Picture.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: "Objet supprimé !" });
          })
          .catch((error) => res.status(401).json({ error }));
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
