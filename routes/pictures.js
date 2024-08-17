const express = require("express");
const picturesCtrl = require("../controllers/pictures");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const router = express.Router();

router.post("/", auth, multer, picturesCtrl.createPicture);

//router.get("/:id", picturesCtrl.getPicture);

//router.put("/:id", auth, multer, picturesCtrl.putPicture);

router.delete("/:id", auth, picturesCtrl.deletePicture);

//router.get("/", picturesCtrl.getPricture);

module.exports = router;
