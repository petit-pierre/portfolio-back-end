const express = require("express");
const toolsCtrl = require("../controllers/tools");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, toolsCtrl.createTool);

//router.get("/:id", projecttoolsCtrl.getProjectTool);

//router.put("/:id", auth, projecttoolsCtrl.putProjectTool);

router.delete("/:id", auth, toolsCtrl.deleteTool);

router.get("/", toolsCtrl.getTools);

module.exports = router;
