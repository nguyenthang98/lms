const mongoose = require("mongoose");
const crypto = require("crypto");
const {pwdHashIter, pwdHashLength, pwdHashAlgo} = require("config").get("dbConfig")

const DEFAULT_PWD_HASH_ITER = 1000;
const DEFAULT_PWD_HASH_LENGTH = 1000;
const DEFAULT_PWD_HASH_ALGO = "sha512";

const pwdIter = pwdHashIter || DEFAULT_PWD_HASH_ITER;
const pwdLength = pwdHashLength || DEFAULT_PWD_HASH_LENGTH;
const pwdAlgo = pwdHashAlgo || DEFAULT_PWD_HASH_ALGO;

const UserSchema = mongoose.Schema({
    uname: {
        type: String,
        unique: true,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
})


UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(48).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, pwdIter, pwdLength, pwdAlgo).toString('hex');
}

UserSchema.methods.verifyPassword = function(password) {
    const hashed = crypto.pbkdf2Sync(password, this.salt, pwdIter, pwdLength, pwdAlgo).toString('hex');
    return hashed === this.hash;
}

module.exports = mongoose.model('User', UserSchema);
