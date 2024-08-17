const express = require("express");
const likesCtrl = require("../controllers/likes");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, likesCtrl.createLike);

router.get("/:id", likesCtrl.getLike);

router.put("/:id", likesCtrl.putLike);

router.delete("/:id", auth, likesCtrl.deleteLike);

router.get("/", likesCtrl.getLikes);

module.exports = router;
