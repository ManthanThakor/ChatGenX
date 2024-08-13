const asyncHandler = require("express-async-handler"); // Import asyncHandler
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//--------- Registration ---------

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please all fields are required");
  }

  // Check the email is taken
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash the user password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user
  const newUser = new User({
    username,
    password: hashedPassword,
    email,
  });

  // Add the date the trial will end
  newUser.trialExpires = new Date(
    new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
  );

  // Save the user
  await newUser.save();
  res.json({
    status: true,
    message: "Registration was successful",
    user: {
      username,
      email,
    },
  });
});

//--------- Login ---------

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Validate
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  // Check if password is valid
  const isMatch = await bcrypt.compare(password, user?.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  //! Generate and send JWT

  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  //! set tne token into cookie (http only)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Cookie will only be sent over HTTPS in production
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  //send the response
  res.json({
    status: true,
    message: "Login success",
    _id: user?._id,
    username: user.username,
    email: user.email,
  });
});

//--------- Logout ---------

const logout = asyncHandler((req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out successfully" });
});

//--------- Profile ---------
//--------- Check user Auth Status ---------

module.exports = {
  register,
  login,
  // logout,
  // userProfile,
  // checkUserAuthStatus,
};
