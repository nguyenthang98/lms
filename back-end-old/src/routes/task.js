const express = require("express");
const router = express.Router();
const taskController = require("../controller/task.js");

router.get("/list", taskController.listTask);
router.get("/:taskId", taskController.getTask);
router.post("/new", taskController.createTask);
router.post("/edit", taskController.editTask);
router.delete("/:taskId", taskController.deleteTask);

module.exports = router;
