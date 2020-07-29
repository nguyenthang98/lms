const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    creater: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Task', TaskSchema);
