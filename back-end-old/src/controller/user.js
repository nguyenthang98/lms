const User = require("../models/User");

function createUser(req, res) {
    const userObj = req.body;
    const user = new User(userObj);
    user.setPassword(userObj.password);
    user.save()
        .then(t => {
            res.status(200)
                .json({
                    "reason": "create user successfully",
                    "data": t
                });
        })
        .catch(e => {
            res.status(500)
                .json({
                    'reason': `user create failed: ${e.message}`
                });
        })
}

function deleteUser(req, res) {
    const userId = req.params.userId;
    User.findByIdAndDelete(userId)
        .exec()
        .then(() => {
            res.status(200)
                .json({
                    "reason": "user deleted successfully"
                });
        })
        .catch(err => {
            res.status(500)
                .json({
                    "reason": `user delete failed: ${err.message}`
                });
        })
}

function editUser(req, res) {
    const userObj = req.body;
    User.findByIdAndUpdate(userObj._id, userObj)
        .exec()
        .then((user) => {
            if (userObj.password) {
                user.setPassword(userObj.password);
                user.save()
                    .then(user => {
                        res.status(200)
                            .json({
                                "reason": "user update successfully",
                                "data": user
                            })
                            .catch(err => {
                                res.status(500)
                                    .json({
                                        "reason": `user update failed: ${err.message}`
                                    });
                            })
                    })
            } else {
                res.status(200)
                    .json({
                        "reason": "user update successfully",
                        "data": user
                    })
            }
        })
        .catch(err => {
            res.status(500)
                .json({
                    "reason": `user update failed: ${err.message}`
                });
        })
}

function getUser(req, res) {
    const userId = req.params.userId;
    User.findById(userId)
        .then(user => {
            res.status(200)
                .json({
                    "reason": "user get successful",
                    "data": user
                })
        })
        .catch(err => {
            res.status(500)
                .json({
                    "reason": `user get failed: ${err.message}`
                });
        })
}

function listUser(req, res) {
    User.find({})
        .then(users => {
            res.status(200)
                .json({
                    "reason": "user list successful",
                    "data": users
                })
        })
        .catch(err => {
            res.status(500)
                .json({
                    "reason": `user list failed: ${err.message}`
                });
        })
}

module.exports = {createUser, deleteUser, getUser, editUser, listUser};
