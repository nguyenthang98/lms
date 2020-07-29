const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("api worked"))

const taskRoutes = require("./task.js");
router.use("/task", taskRoutes);

const submissionRoutes = require("./submission.js");
router.use("/submission", submissionRoutes);

module.exports = router;
