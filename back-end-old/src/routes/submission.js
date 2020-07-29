const express = require("express");
const router = express.Router();
const submissionController = require("../controller/submission.js");

router.get("/list", submissionController.listSubmission);
router.get("/:submissionId", submissionController.getSubmission);
router.post("/new", submissionController.createSubmission);
router.post("/edit", submissionController.editSubmission);
router.delete("/:submissionId", submissionController.deleteSubmission);

module.exports = router;
