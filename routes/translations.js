const express = require("express");
const translationsCtrl = require("../controllers/translations");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, translationsCtrl.createTranslation);

router.get("/:id", translationsCtrl.getTranslation);

router.put("/:id", auth, translationsCtrl.putTranslation);

router.delete("/:id", auth, translationsCtrl.deleteTranslation);

router.get("/", translationsCtrl.getTranslations);

module.exports = router;
