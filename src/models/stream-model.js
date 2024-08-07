const mongoose = require('mongoose');
const { Schema } = mongoose;

const userStreamSchema = new Schema({
    userId: { 
        type: String, 
        required: true 
    },
    links: [{
        type: String,  
    }],

});

const UserStreamModel = mongoose.model('UserStream', userStreamSchema);

module.exports = UserStreamModel;