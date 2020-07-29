const express = require("express");
const router = express.Router();
const userController = require("../controller/user.js");

router.get("/list", userController.listUser);
router.get("/:userId", userController.getUser);
router.post("/new", userController.createUser);
router.post("/edit", userController.editUser);
router.delete("/:userId", userController.deleteUser);

module.exports = router;
