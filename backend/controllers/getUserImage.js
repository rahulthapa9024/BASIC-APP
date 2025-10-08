const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const getImage = async (req, res) => {
  try {
    // 1. Check if token exists
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. No token found."
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // 3. Find user by email
    const user = await User.findOne({ email: decoded.emailId }).select('photoURL');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.photoURL) {
      return res.status(404).json({
        success: false,
        message: "Profile photo not found"
      });
    }

    // 4. Return the photoURL
    return res.status(200).json({
      success: true,
      photoURL: user.photoURL
    });

  } catch (err) {
    console.error("Error in getImage:", err);

    // Handle specific JWT errors
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
};

module.exports = getImage;