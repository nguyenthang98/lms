const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const serverCfg = require("config").get("serverConfig");
const jwt = require("jsonwebtoken");
const rolesCfg = require("../models/User.role.json");

function verifyToken(req, res, next) {
    const authHeader = req.headers["Authorization"] || req.headers["authorization"];
    if (!authHeader) {
        return res
                .status(401)
                .json({ "reason": "auth token not found" });
    }

    const parsed = authHeader.split(" ");
    let type = null;
    let token = null;
    if (parsed.length == 2) {
        type = parsed[0];
        token = parsed[1];
    } else if (parsed.length == 1) {
        token = parsed[0];
    }

    if (!token || !token.length)
        return res
                .status(401)
                .json({ "reason": "token not valid" });

    try {
        const decoded = jwt.verify(token, serverCfg.jwtSecret)
        const refreshToken = decoded.refreshToken;
        const userid = decoded.user;

        RefreshToken
            .findOne({token: refreshToken, uid: userid})
            .then((rfToken) => {

                if ( rfToken.expiredAt - Date.now() < 0) {
                    rfToken
                        .remove()
                        .then(() => {
                            res.status(401)
                                .json({
                                    "reason": "refresh token expired"
                                })
                        })
                } else {
                    // authenticate successfully, authorization
                    req.decodedUid = userid;
                    next();
                }
            })
            .catch(err => {
                res.status(401)
                    .json({
                        "reason": `Access token is not valid: ${err.message}`
                    })
            })

    } catch (err) {
        res.status(401)
            .json({ "reason": err.message });
    }
}

function doLogin(req, res, next) {
    const {uname, pwd} = req.body;
    User.findOne({uname})
        .then(user => {
            if (user.verifyPassword(pwd)) {
                RefreshToken
                    .findOne({uid: user._id})
                    .then(rf => {
                        if (rf.expiredAt - Date.now() < 0) {
                            console.log("refresh token expired", rf);
                            rf.remove()
                                .then(() => {
                                    const _rf = new RefreshToken();
                                    _rf.uid = user._id;
                                    _rf.genRefreshToken();
                                    _rf.renewAccessToken();
                                    _rf.save()
                                        .then(__rf => {
                                            res.status(200)
                                                .json({
                                                    "accessToken": __rf.accessToken
                                                })
                                        })
                                        .catch(err => {
                                            res.status(500)
                                                .json({
                                                    "reason": `Gen access token error ${err.message}`
                                                })
                                        })

                                })
                        } else {
                            console.log("found refresh token", rf);
                            rf.renewAccessToken();
                            rf.save()
                                .then(rf => {
                                    res.status(200)
                                        .json({
                                            "accessToken": rf.accessToken
                                        });
                                })
                                .catch(err => {
                                    res.status(500)
                                        .json({
                                            "reason": `Gen access token error ${err.message}`
                                        })
                                })
                        }
                    })
                    .catch(err => {
                        // not found
                        const rf = new RefreshToken();
                        rf.uid = user._id;
                        rf.genRefreshToken();
                        rf.renewAccessToken();
                        rf.save()
                            .then(rf => {
                                res.status(200)
                                    .json({
                                        "accessToken": rf.accessToken
                                    })
                            })
                            .catch(err => {
                                res.status(500)
                                    .json({
                                        "reason": `Gen access token error ${err.message}`
                                    })
                            })
                    })
            }
        })
        .catch(err => {
            res.status(404)
                .json({
                    "reason": `User not found: ${err.message}`
                })
        })
}

function doRegister(req, res, next) {
    const {uname, pwd} = req.body;

    const user = new User();
    user.uname = uname;
    user.setPassword(pwd);
    user.save()
        .then(u => {
            const rf = new RefreshToken();
            rf.uid = user._id;
            rf.genRefreshToken();
            rf.renewAccessToken();
            rf.save()
                .then(rf => {
                    res.status(200)
                        .json({
                            "accessToken": rf.accessToken
                        })
                })
                .catch(err => {
                    res.status(500)
                        .json({
                            "reason": `Gen access token error ${err.message}`
                        })
                })
        })
        .catch(err => {
            res.status(500)
                .json({
                    "reason": `create user error: ${err.message}`
                })
        })
}

module.exports = {
    doLogin, doRegister, verifyToken
}
