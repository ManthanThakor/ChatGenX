const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const checkApiRequestLimit = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const user = await User.findById(req?.user?.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  let requestLimit = user?.defaultRequestLimit || 100; // Set a default limit
  if (user?.trialActive) {
    requestLimit = user?.monthlyRequestCount;
  }

  if (user?.apiRequestCount >= requestLimit) {
    console.error(`User ${user.id} exceeded the API request limit.`);
    return res.status(403).json({
      message: "API Request limit reached, please subscribe to a plan",
    });
  }

  next();
});

module.exports = checkApiRequestLimit;
