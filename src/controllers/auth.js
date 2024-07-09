const userModel = require("../models/user-model");
const otpModel = require("../models/otp-model");
const { mailOTP } = require("../services/node-mailer");
const { generateToken, decodeToken, Authenticated, PassAuthenticated, validate } = require('../services/generate-token'); // Adjust the path as needed

const getAllUsers = async (req, res) => {
    return res.error({ error: "User with this email already exists. Please sign in." });
};

const registerUser = async (req, res) => {
    try {
        const { email, password, userId } = req.body;
        let existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.error({ error: "User with this email already exists. Please sign in." });
        }

        // Check if mobile already exists
        existingUser = await userModel.findOne({ userId: userId });
        if (existingUser) {
            return res.error({ error: "User with this user-name already exists please take new name" });
        }

        const newUser = new userModel({
            email: email,
            password: password,
            userId: userId,
        });
        const savedUser = await newUser.save();

        return res.success(savedUser);
    } catch (error) {
        console.error(error.message);
        res.error({ error: "Failed to register user" });
    }
};

const verifyGoogleEmail = async (req, res) => {
    try {
        const id = req.body.id;
        const userInfo = req.body.userInfo;
        if (!userInfo.email_verified) {
            return res.error({ message: 'User is not verified on Google' });
        }
        if (id === "sign_in") {
            const existingUser = await userModel.findOne({ email: userInfo.email });
            if (existingUser) {
                if (!existingUser.googleLogin) {
                    return res.error({ message: 'Please login using password' });
                }
                const token = await generateToken({ id: existingUser._id });
                console.log(token);
                return res.success({ token });
            } else {
                return res.error({ message: 'User not found' });
            }
        } else {
            const existingUser = await userModel.findOne({ email: userInfo.email });
            if (existingUser) {
                return res.error({ message: 'Email already registered' });
            }
            const newUser = new userModel({
                email: userInfo.email,
                firstName: userInfo.given_name,
                lastName: userInfo.family_name,
                photo: userInfo.picture,
                googleLogin: true,
            });
            const savedUser = await newUser.save();

            return res.success(savedUser);
        }
    } catch (error) {
        return res.error(error.message);
    }
};

const verifyEmail = async (req, res) => {
    try {
        const result = await mailOTP(req.body.email);
        return res.success("abhi");
    } catch (error) {
        res.error(error.message);
    }
};

const verifyUserEmail = async (req, res) => {
    try {
        const OTP = Math.floor(10000 + Math.random() * 90000);
        console.log("................/////api");
        const email = req.body.email;
        console.log(email);
        if (!email) {
            return res.error({ 
                succes: false,
                message: "Email is required"
            });
        }
        const type = req.body.type;
        if (type === "signup") {
            const existingUser = await userModel.findOne({ email: email });
            if (existingUser) {
                return res.error({ error: "User with this email already exists. Please sign in." });
            }
        }
        let existingOtp = await otpModel.findOne({ email: email });
        if (existingOtp) {
            await otpModel.findOneAndUpdate({ email: email }, { $set: { otp: OTP } });
        } else {
            const newUser = new otpModel({
                email: email,
                otp: OTP,
            });
            await newUser.save();
        }
        const result = await mailOTP(email, OTP);
        return res.success(result);
    } catch (error) {
        res.error(error.message);
    }
};

const verifyUserOtp = async (req, res) => {
    try {
        const OTP = req.body.otp;
        const email = req.body.email;
        let existingUser = await otpModel.findOne({ email: email, otp: OTP });
        if (!existingUser || existingUser.otp === null) {
            return res.error({ message: 'OTP do not match' });
        }
        await userModel.findOneAndUpdate({ email: email, otp: OTP }, { $set: { otp: null } });
        return res.success("OTP matched successfully");
    } catch (error) {
        res.error(error.message);
    }
};

const changePassword = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (email) {
            await userModel.findOneAndUpdate({ email: email }, { $set: { password: password } });
        }
        return res.success("Password updated successfully");
    } catch (error) {
        res.error(error.message);
    }
};

const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (email) {
            await userModel.findOneAndUpdate({ email: email }, { $set: { password: password } });
        }
        return res.success("Password updated successfully");
    } catch (error) {
        res.error(error.message);
    }
};

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
            const token = await generateToken({ id: existingUser._id });
            console.log({ token: token, user: existingUser });
            return res.success({ token: token, user: existingUser });
        } else {
            return res.error({ message: 'User not found or wrong password' });
        }
    } catch (error) {
        console.error(error.message);
        res.error({ error: "Failed to login user" });
    }
};

const profile = async (req, res) => {
    return res.success({ user: req.user });
};

module.exports = {
    getAllUsers,
    registerUser,
    verifyUserEmail,
    verifyGoogleEmail,
    loginUser,
    verifyEmail,
    verifyUserOtp,
    changePassword,
    profile,
    forgotPassword
};
