const userModel = require("../models/user-model")
const otpModel = require("../models/otp-model")
const { mailOTP } = require("../services/node-mailer")
const { generateToken, decodeToken, Authenticated, PassAuthenticated, validate } = require('../services/generate-token'); // Adjust the path as needed

const getAllUsers = async (req, res) => {
    return res.status(200).json({ error: "User with this email already exists. Please sign in." });
}
const registerUser = async (req, res) => {
    try {
        const { email, password, userId } = req.body;
        let existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists. Please sign in." });
        }

        // Check if mobile already exists
        existingUser = await userModel.findOne({ userId: userId });
        if (existingUser) {
            return res.status(400).json({ error: "User with this user-name already exists please take new name" });
        }

        const newUser = new userModel({
            email: email,
            password: password,
            userId: userId,
        });
        const savedUser = await newUser.save();

        return res.status(200).json(savedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to register user" });
    }
};

const verifyGoogleEmail = async (req, res) => {
    try {
        const id = req.body.id
        const userInfo = req.body.userInfo
        if (!userInfo.email_verified){
return res.status(404).json({ message: 'user is not verified on google' });
        }
        if(id ==="sign_in"){
            const existingUser = await userModel.findOne({ email: userInfo.email });
            if (existingUser ) {
                if(!existingUser.googleLogin){
                    return res.status(404).json({ message: 'Please Login using password' });
                }
                const token = generateToken({ id: existingUser._id })
                return res.status(200).json({ token });
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        }
        else{
            const existingUser = await userModel.findOne({ email: userInfo.email }); 
            if (existingUser ) { 
                return res.status(404).json({ message: 'Email already registered' });
            }
            const newUser = new userModel({
                email: userInfo.email,
                firstName: userInfo.given_name,
lastName: userInfo.family_name,
photo: userInfo.picture,
            });
            const savedUser = await newUser.save();
    
            return res.status(200).json(savedUser);
        }
       
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

const verifyEmail = async (req, res) => {
    try {
        const result = await mailOTP(req.body.email);
        return res.status(200).json({ result });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}
const verifyUserEmail = async (req, res) => {
    try {
        const OTP = Math.random().toString(36).substring(7);
        const email = req.body.email
        const type = req.body.type;
        if(type === "signup"){
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists. Please sign in." });
        }
        }
        let existingOtp = await otpModel.findOne({ email: email });
        if (existingOtp) {
            await otpModel.findOneAndUpdate({ email: email }, { $set: { otp: OTP } });
        }
        else {
            const newUser = new otpModel({
                email: email,
                otp: OTP,
            });
            await newUser.save();
        }
        const result = await mailOTP(email, OTP);
        return res.status(200).json({ result });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}
const verifyUserOtp = async (req, res) => {
    try {
        const OTP = req.body.otp
        const email = req.body.email
        let existingUser = await otpModel.findOne({ email: email, otp: OTP });
        if (!existingUser || existingUser.otp === null) {
            return res.status(404).json({ message: 'OTP do not match' });
        }
        await userModel.findOneAndUpdate({ email: email, otp: OTP }, { $set: { otp: null } });
        return res.status(200).json("OTP matched successfully");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const changePassword = async (req, res) => {
    try {
        const email = req.body.email

        const password = req.body.password
        if (email) {
            await userModel.findOneAndUpdate({ email: email }, { $set: { password: password } });
        }
        return res.status(200).json("Password updated successfully");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        let existingUser = await userModel.findOne({
            $or: [
                { email: email, password: password },
                { userid: email, password: password }
            ]
        });
        if (existingUser) {

            const token = await generateToken({ id: existingUser._id })
console.log({token: token, user: existingUser})
            return res.status(200).json({token: token, user: existingUser});
        } else {
            return res.status(404).json({ message: 'User not found or wrong password' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to register user" });
    }
};

const profile = async(req,res)=>{
   return  res.success({ user: req.user });
}



module.exports = { getAllUsers, registerUser, verifyUserEmail, verifyGoogleEmail, loginUser, verifyEmail, verifyUserOtp, changePassword,profile };