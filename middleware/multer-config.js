const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const originalName = file.originalname.split(" ").join("_");
    const filenameArray = originalName.split(".");
    filenameArray.pop();
    const filenameWithoutExtension = filenameArray.join(".");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, filenameWithoutExtension + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
