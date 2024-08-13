const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model

const isAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    if (req.cookies.token) {
      // VERIFY THE TOKEN
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

      // ADD THE USER TO THE REQ OBJ
      req.user = await User.findById(decoded?.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      return next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
});

module.exports = isAuthenticated;
