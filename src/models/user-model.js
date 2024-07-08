const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String,  },
    lastName: { type: String,  },
    photo: { type: String, },
    email: { type: String,  },
    country: { type: String, },
    state: { type: String, },
    pinCode: { type: String, },
    password: { type: String,  },
    userId:{type:String,},
    googleLogin: { type: Boolean, default: false },
dob: { type: String,},
mobile:{type:String,}
});
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;