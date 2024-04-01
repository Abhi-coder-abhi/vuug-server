const express = require("express")
const router = express.Router()
const {getAllUsers} = require("../controllers/auth")
const {registerUser} = require("../controllers/auth")
const {verifyUserEmail} = require("../controllers/auth")
const {verifyGoogleEmail} = require("../controllers/auth")
const {loginUser} = require("../controllers/auth")

router.route("/").get(getAllUsers)
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/verify-email").post(verifyUserEmail)
router.route("/google-login").post(verifyGoogleEmail)

module.exports = router;