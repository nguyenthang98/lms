const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");

router.route("/") // /auth
    .get(authController.verifyToken)

router.route("/login") // /auth/login
    .post(authController.doLogin)

router.route("/register") // /auth/register
    .post(authController.doRegister)

module.exports = router;
