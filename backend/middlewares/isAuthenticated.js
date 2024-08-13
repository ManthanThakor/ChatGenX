const asyncHandler = require("express-async-handler");

const isAuthenticated = asyncHandler(async (req, res, next) => {
  if (req.cookies.token) {
    //! VERIFY THE TOKEN
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    // ADD THE USER TO THE REQ OBJ
    req.user = await User.findById(decoded?.id).select("-password");
    return;
  } else {
    return res.status(401).json({ message: "Not authorized" });
  }
  next();
});

module.exports = isAuthenticated;
