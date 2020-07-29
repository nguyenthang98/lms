const Submission = require("../models/Submission");

function createSubmission(req, res) {
    const submissionObj = req.body;
    const submission = new Submission(submissionObj);
    submission.submitter = req.decodedUid;
    submission.save()
        .then(_s => {
            res.status(200)
                .json({
                    "reason": "create submission successfully",
                    "data": _s
                });
        })
        .catch(e => {
            res.status(500)
                .json({
                    'reason': `submission create failed: ${e.message}`
                });
        })
}

function deleteSubmission(req, res) {
    const id = req.params.submissionId;
    Submission.findByIdAndDelete(id)
        .exec()
        .then(() => {
            res.status(200)
                .json({
                    "reason": "submission deleted successfully"
                });
        })
        .catch(err => {
            res.status(500)
                .json({
                    "reason": `submission delete failed: ${err.message}`
                });
        })
}

function editSubmission(req, res) {
    const submissionObj = req.body;
    Submission.findByIdAndUpdate(submissionObj._id, submissionObj)
        .exec()
        .then((submission) => {
            res.status(200)
                .json({
                    "reason": "submission update successfully",
                    "data": submission
                })
        })
        .catch(err => {
            res.status(500)
                .json({
                    "reason": `submission update failed: ${err.message}`
                });
        })
}

function getSubmission(req, res) {
    const submissionId = req.params.submissionId;
    Submission.findById(submissionId)
        .populate('submitter')
        .then(submission => {
            res.status(200)
                .json({
                    "reason": "submission get successful",
                    "data": submission
                })
        })
        .catch(err => {
            res.status(500)
                .json({
                    "reason": `submission get failed: ${err.message}`
                });
        })
}

function listSubmission(req, res) {
    Submission.find({})
        .populate('submitter')
        .then(submissions => {
            res.status(200)
                .json({
                    "reason": "submission list successful",
                    "data": submissions
                })
        })
        .catch(err => {
            res.status(500)
                .json({
                    "reason": `submission list failed: ${err.message}`
                });
        })
}

module.exports = {createSubmission, deleteSubmission, getSubmission, editSubmission, listSubmission};
