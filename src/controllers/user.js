const UserRelationModel = require("../models/friend-model");
const userModel = require("../models/user-model");
const otpModel = require("../models/otp-model");
const { mailOTP } = require("../services/node-mailer");
const { generateToken, decodeToken, Authenticated, PassAuthenticated, validate } = require('../services/generate-token'); 

const getUser = async (req, res) => {
    try {
        
        console.log(req.user)
        const existingUser = await userModel.findOne({ userId: req.body.user });
        if(!existingUser){
            return res.error("User not found");
        }

        const currentUserRelation = await UserRelationModel.findOne({ userId: req.user.userId });
        let relationshipStatus = 'none'
        if (!currentUserRelation) {
            // If no document exists, create a new one
            const newUserRelation = new UserRelationModel({
                userId: req.user.userId,
                friends: [],
                friendRequestsSent: [],
                friendRequestsReceived: [],
                blockedUsers: []
            });

            await newUserRelation.save();
            return res.success({
                user: existingUser,
                status: relationshipStatus
            });
        }
        const existingUserRelation = await UserRelationModel.findOne({ userId: existingUser });;
        if (!existingUserRelation) {
            // If no document exists, create a new one
            const newUserRelation = new UserRelationModel({
                userId: req.user.userId,
                friends: [],
                friendRequestsSent: [],
                friendRequestsReceived: [],
                blockedUsers: []
            });

            await newUserRelation.save();
          
        }

    

        if (currentUserRelation.friends.includes(existingUser)) {
            relationshipStatus = 'friend';
        } else if (currentUserRelation.blockedUsers.includes(existingUser)) {
            relationshipStatus = 'blocked';
        } else if (currentUserRelation.friendRequestsSent.includes(existingUser)) {
            relationshipStatus = 'friend_request_sent';
        } else if (currentUserRelation.friendRequestsReceived.includes(existingUser)) {
            relationshipStatus = 'friend_request_received';
        }

        return res.success({
            user: existingUser,
            status: relationshipStatus
        });
    } catch (error) {
        res.error(error.message);
    }
};
const addUser = async (req, res) => {
    try {
        const action  = req.body.action
        console.log(req.user)
        const sender = await UserRelationModel.findOne({ userId: req.body.user }); 
        const reciever = await UserRelationModel.findOne({ userId: req.user.userId });
        if (action === 'add-friend') {
            await sender.updateOne({ $push: { sentRequests: newRequest.id } });
            await reciever.updateOne({ $push: { receivedRequests: newRequest.id } });
        }
    } catch (error) {
        res.error(error.message);
    }
};
module.exports = {getUser,addUser}