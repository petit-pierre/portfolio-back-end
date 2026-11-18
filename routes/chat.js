const express = require("express");
const chatCtrl = require("../controllers/chat");
const router = express.Router();

router.post("/", chatCtrl.postMessage);

module.exports = router;
