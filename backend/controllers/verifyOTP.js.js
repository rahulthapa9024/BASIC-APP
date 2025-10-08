const { otpStore } = require("../controllers/sendOTP");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const record = otpStore.get(email);
    if (!record) {
      return res.status(400).json({ success: false, message: "No OTP sent or expired" });
    }

    const { otp: storedOtp, expiresAt } = record;

    if (Date.now() > expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (otp !== storedOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP verified — find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        emailId: user.email,
        displayName: user.displayName,
        userId: user._id
      },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Strict"
    });

    // Remove OTP from store
    otpStore.delete(email);

    // Respond with user data and token
    return res.status(200).json({
      success: true,
      message: "OTP verified and login successful",
      user: {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        _id: user._id
      },
      token
    });

  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = verifyOtp;
