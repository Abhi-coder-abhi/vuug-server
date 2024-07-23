const express = require("express")
const router = express.Router()
const {getAllUsers, verifyUserOtp} = require("../controllers/auth")
const {registerUser} = require("../controllers/auth")
const {verifyUserEmail} = require("../controllers/auth")
const {verifyGoogleEmail} = require("../controllers/auth")
const {loginUser} = require("../controllers/auth")
const {changePassword,forgotPassword,profilePic} = require("../controllers/auth")
const {profile} = require("../controllers/auth")
const {  Authenticated, PassAuthenticated, validate } = require('../services/generate-token');
const multer = require('multer');
const { bannerStorage ,picStorage} = require("../services/upload")
const upload = multer({ storage: bannerStorage });


router.route("/").get(Authenticated,getAllUsers)
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/verify-email").post(verifyUserEmail)
router.route("/verify-otp").post(verifyUserOtp)
router.route("/google-login").post(verifyGoogleEmail)
router.route("/change-password").post(Authenticated,changePassword)
router.route("/forgot-password").post(forgotPassword)
router.route("/me").get(Authenticated,profile)
router.route("/profile-pic").post(Authenticated,upload.single("file"),profilePic)

module.exports = router;