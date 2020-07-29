const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubmissionSchema = Schema({
    taskId: {
        type: String,
        required: true
    },
    submitter: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String,
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
    }
})

module.exports = mongoose.model('Submission', SubmissionSchema);
