const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubmissionSchema = Schema({
    taskId: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    studentId: {
        type: String,
        require: true
    },
    git: {
        type: String,
        required: true
    },
    web: {
        type: String,
    },
    submissionDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    score: {
        type: Number,
        default: -1
    }
})

module.exports = mongoose.model('Submission', SubmissionSchema);
