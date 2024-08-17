const express = require("express");
const projectsCtrl = require("../controllers/projects");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, projectsCtrl.createProject);

router.get("/:id", projectsCtrl.getProject);

router.put("/:id", auth, projectsCtrl.putProject);

router.delete("/:id", auth, projectsCtrl.deleteProject);

router.get("/", projectsCtrl.getProjects);

module.exports = router;
