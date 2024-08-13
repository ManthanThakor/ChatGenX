const asyncHandler = require("express-async-handler");

const isAuthenticated = asyncHandler(async (req, res, next) => {
  if (req.cookies.token) {
    //! VERIFY THE TOKEN
    const decoded = jwt.verify();
  } else {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
});

module.exports = isAuthenticated;
