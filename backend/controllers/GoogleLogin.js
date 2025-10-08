const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const GoogleLogin = async (req, res) => {
  try {
    const { displayName, email, photoURL } = req.body;

    // Validate required fields
    if (!email || !photoURL || !displayName) {
      return res.status(400).json({ 
        success: false, 
        message: "Display name, email, and photo URL are required" 
      });
    }

    let user = await User.findOne({ email });

    // If user doesn't exist, create new one
    if (!user) {
      user = await User.create({ displayName, email, photoURL });
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
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: "Strict",
    });

    // Send response
    res.status(200).json({ 
      success: true, 
      message: "Login successful",
      user: { 
        email: user.email, 
        displayName: user.displayName, 
        photoURL: user.photoURL,
        _id: user._id 
      },
      token
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = GoogleLogin;
