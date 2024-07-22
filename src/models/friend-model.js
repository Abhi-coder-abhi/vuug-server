const mongoose = require('mongoose');
const { Schema } = mongoose;

const userRelationSchema = new Schema({
    userId: { 
        type: String, 
        required: true 
    },
    friends: [{
        type: String, 
     
    }],
    friendRequestsSent: [{
        type: String, 
    }],
    friendRequestsReceived: [{
        type: String, 
    }],
    blockedUsers: [{
        type: String, 
    }]
});

const UserRelationModel = mongoose.model('UserRelation', userRelationSchema);

module.exports = UserRelationModel;