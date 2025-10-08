const express = require('express');
const userRouter = express.Router();

const GoogleLogin = require("../controllers/GoogleLogin");
userRouter.post("/googleLogin", GoogleLogin);

const { sendOtp } = require("../controllers/sendOTP"); // ✅ fixed
userRouter.post("/generateOTP", sendOtp);               // ✅ fixed

const verifyOtp = require("../controllers/verifyOTP.js");  // or destructure if needed
userRouter.post("/verifyOTP", verifyOtp);

const check = require("../controllers/check.js");
const { log } = require('console');
userRouter.get("/check",check)

const logout = require("../controllers/logout.js")
userRouter.post("/logout",logout)

const getImage = require("../controllers/getUserImage.js")
userRouter.get("/getImage",getImage)

module.exports = userRouter;
