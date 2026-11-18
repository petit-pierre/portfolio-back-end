const express = require("express");
const picturesCtrl = require("../controllers/pictures");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const router = express.Router();

router.post("/", auth, multer, picturesCtrl.createPicture);

router.delete("/:id", auth, picturesCtrl.deletePicture);

module.exports = router;
