const asyncHandler = require("express-async-handler");

const isAuthenticated = asyncHandler(async (req, res) => {
  console.log("aaaaaaaaaaaaaaaaaaa");
});

module.exports = isAuthenticated;
