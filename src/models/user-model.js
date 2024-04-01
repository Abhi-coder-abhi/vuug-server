const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address:{type:String,required: true},
    userid:{type:String,required: true},
    mobile:{type:String,required: true},
    aadhar:{type:String,required: true},
    aadharStatus: { type: Boolean, default: false },
    gmailStatus: { type: Boolean, default: false }
});
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;