const express = require("express");
const slidersCtrl = require("../controllers/sliders");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, slidersCtrl.createSlide);

router.get("/:id", slidersCtrl.getSlide);

//router.put("/:id", auth, projectsCtrl.putSlide);

router.delete("/:id", auth, slidersCtrl.deleteSlide);

router.get("/", slidersCtrl.getSliders);

module.exports = router;
