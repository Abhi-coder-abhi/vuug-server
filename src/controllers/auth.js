const userModel = require("../models/user-model")
const mailOTP = require("../services/node-mailer")
const generateToken = require("../services/generate-token")
const getAllUsers = async (req, res) => {
    return res.status(200).json({ error: "User with this email already exists. Please sign in." });
}
const registerUser = async (req, res) => {
    try {
        const { name, email, password, address, mobile, dob, userid, aadhar } = req.body;
        let existingUser = await userModel.findOne({ email: email });
        if (existingUser) {

            return res.status(400).json({ error: "User with this email already exists. Please sign in." });

        }

        // Check if mobile already exists
        existingUser = await userModel.findOne({ mobile: mobile });
        if (existingUser) {
            return res.status(400).json({ error: "User with this mobile number already exists please sign in" });
        }

        const newUser = new userModel({
            name: name,
            email: email,
            password: password,
            address: address,
            mobile: mobile,
            dob: dob,
            userid: userid,
            aadhar: aadhar
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
        const email = req.body.email
        let existingUser = await userModel.findOne({ email: email });
        if (existingUser) {

            const token = generateToken({ id: existingUser._id })

            return res.status(200).json({ token });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}


const verifyUserEmail = async (req, res) => {
    try {
        const OTP = Math.random().toString(36).substring(7);
        const result = await mailOTP(req.body.email, OTP);
        return res.status(200).json({ result });
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

            const token = generateToken({ id: existingUser._id })

            return res.status(200).json({ token });
        } else {
            return res.status(404).json({ message: 'User not found or wrong password' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to register user" });
    }
};


module.exports = { getAllUsers, registerUser, verifyUserEmail, verifyGoogleEmail, loginUser  }