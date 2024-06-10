const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String,  },
    otp:{type:String, default:null},
});
const otpModel = mongoose.model('User-otp', otpSchema);

module.exports = otpModel;