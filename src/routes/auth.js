const express = require("express")
const router = express.Router()
const {getAllUsers, verifyUserOtp} = require("../controllers/auth")
const {registerUser} = require("../controllers/auth")
const {verifyUserEmail} = require("../controllers/auth")
const {verifyGoogleEmail} = require("../controllers/auth")
const {loginUser} = require("../controllers/auth")
const {changePassword} = require("../controllers/auth")
const {profile} = require("../controllers/auth")
const {  Authenticated, PassAuthenticated, validate } = require('../services/generate-token');

router.route("/").get(Authenticated,getAllUsers)
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/verify-email").post(verifyUserEmail)
router.route("/verify-otp").post(Authenticated,verifyUserOtp)
router.route("/google-login").post(Authenticated,verifyGoogleEmail)
router.route("/change-password").post(Authenticated,changePassword)
router.route("/me").get(Authenticated,profile)

module.exports = router;