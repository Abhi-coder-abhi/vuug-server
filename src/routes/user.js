const express = require("express")
const router = express.Router()
const {getUser,addUser}= require("../controllers/user")
const {  Authenticated, PassAuthenticated, validate } = require('../services/generate-token');

router.route("/friend").post(Authenticated,getUser)
router.route("/add-friend").post(Authenticated,addUser)


module.exports = router;