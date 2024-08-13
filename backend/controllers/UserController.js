const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//--------- Registration ---------
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input fields
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Validate email format (basic validation)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }

  // Check if the email is already taken
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

  // Add the trial end date
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

  // Validate user exists
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Generate and send JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  // Set the token into an HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });

  res.json({
    status: true,
    message: "Login successful",
    _id: user._id,
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
const UserProfile = asyncHandler(async (req, res) => {
  const id = "66b9d76615f80c852fd2dd36";
  // Find the user by ID and exclude the password field
  const user = await User.findById(id).select("-password");
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

//--------- Check user Auth Status ---------

module.exports = {
  register,
  login,
  logout,
  UserProfile,
  // checkUserAuthStatus,
};
