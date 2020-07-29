const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("config").get("serverConfig");

const ACCESS_TOKEN_LIFE_TIME = '3h';
const REFRESH_TOKEN_LIFE_TIME = 1000 * 60 * 60 * 12 * 3; // 3d

const RefreshTokenSchema = mongoose.Schema({
    token: {
        type: String,
        unique: true,
        required: true
    },
    expiredAt: {
        type: Date,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    }
})

RefreshTokenSchema.methods.renewAccessToken = function() {
    this.accessToken = jwt.sign({
        user: this.uid,
        refreshToken: this.token
    }, config.jwtSecret, {
        expiresIn: ACCESS_TOKEN_LIFE_TIME
    });
    return this.accressToken;
}

RefreshTokenSchema.methods.genRefreshToken = function() {
    this.token = crypto.randomBytes(48).toString("hex");
    this.expiredAt = Date.now() + REFRESH_TOKEN_LIFE_TIME;
    return this.token;
}


const model = mongoose.model('RefreshToken', RefreshTokenSchema);
module.exports = model;

setInterval(function() {
    console.info("Clean refresh token");
    model.find({})
        .exec()
        .then(rfs => {
            const promises = [];
            rfs.forEach(rf => {
                promises.push(new Promise((resolve, reject) => {
                    if (rf.expiredAt - Date.now() < 0) {
                        model.findOneAndRemove({_id: rf._id})
                            .then(() => {
                                resolve();
                            })
                    } else {
                        resolve();
                    }
                }))
            })

            Promise.all(promises)
                .then(() => {
                    console.info("Clean refresh token successfully");
                })
        })
}, 1000 * 60 * 60 * 3);
