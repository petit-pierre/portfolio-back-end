const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

router.post("/sign_up", userCtrl.sign_up);
router.post("/log_in", userCtrl.log_in);

module.exports = router;
