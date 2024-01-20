const {Schema, model} = require('mongoose');

const blockedUserSchema = new Schema({
    user: {type: String, unique: true},
    ipAddress: {type: String},
    // city: {type: String},
    // isProxy: {type: String},
    // isVpn: {type: String},
    // postal: {type: String},
    // userAgent: {type: String},
    // region: {type: String},
    date: {type: String},
});

const BlockedUser = model("BlockedUser", blockedUserSchema);

module.exports = BlockedUser;
