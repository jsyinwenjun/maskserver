var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    email: String,
    password: String,
    photo: String,
    birthday: String,
    gender: String,

    skinOily: Boolean,
    skinNormal: Boolean,
    skinDry: Boolean,
    skinSensitive: Boolean,

    skinCareTime: String,
    weekPlan: Number,
    createDate: Date,
    updateDate: Date,
    lastLoginDate: Date,
    token: String 
});

module.exports = mongoose.model('User', UserSchema);