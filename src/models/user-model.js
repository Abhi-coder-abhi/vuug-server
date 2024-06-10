const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String,  },
    email: { type: String,  },
    password: { type: String, required: true },
    address:{type:String,},
    userId:{type:String,required: true},
    aadharStatus: { type: Boolean, default: false },
    gmailStatus: { type: Boolean, default: false }

});
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;