const Task = require("../models/task");

function createTask(req, res) {
    const taskObj = req.body;
    const task = new Task(taskObj);
    task.creater = req.decodedUid;
    task.save()
        .then(t => {
            res.status(200)
                .json({
                    "reason": "create task successfully",
                    "data": t
                });
        })
        .catch(e => {
            res.status(500)
                .json({
                    'reason': `task create failed: ${e.message}`
                });
        })
}

function deleteTask(req, res) {
    const taskId = req.params.taskId;
    Task.findByIdAndDelete(taskId)
        .exec()
        .then(() => {
            res.status(200)
                .json({
                    "reason": "task deleted successfully"
                });
        })
        .catch(err => {
            res.status(500)
                .json({
                    "reason": `task delete failed: ${err.message}`
                });
        })
}

function editTask(req, res) {
    const taskObj = req.body;
    Task.findByIdAndUpdate(taskObj._id, taskObj)
        .exec()
        .then((task) => {
            res.status(200)
                .json({
                    "reason": "task update successfully",
                    "data": task
                })
        })
        .catch(err => {
            res.status(500)
                .json({
                    "reason": `task update failed: ${err.message}`
                });
        })
}

function getTask(req, res) {
    const taskId = req.params.taskId;
    Task.findById(taskId)
        .populate("creator")
        .then(task => {
            res.status(200)
                .json({
                    "reason": "task get successful",
                    "data": task
                })
        })
        .catch(err => {
            res.status(500)
                .json({
                    "reason": `task get failed: ${err.message}`
                });
        })
}

function listTask(req, res) {
    Task.find({})
        .populate('creater')
        .then(tasks => {
            res.status(200)
                .json({
                    "reason": "task list successful",
                    "data": tasks
                })
        })
        .catch(err => {
            res.status(500)
                .json({
                    "reason": `task list failed: ${err.message}`
                });
        })
}

module.exports = {createTask, deleteTask, getTask, editTask, listTask};
