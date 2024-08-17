const express = require("express");
const skillsCtrl = require("../controllers/skills");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, skillsCtrl.createSkill);

//router.get("/:id", projectskillsCtrl.getProjectSkill);

//router.put("/:id", auth, projectskillsCtrl.putProjectSkill);

router.delete("/:id", auth, skillsCtrl.deleteSkill);

router.get("/", skillsCtrl.getSkills);

module.exports = router;
