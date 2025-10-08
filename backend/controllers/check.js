const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token found" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Find the user from DB
    const user = await User.findOne({ email: decoded.emailId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Return user data
    res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }
    });
  } catch (err) {
    console.error("Auth check error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = checkAuth;
