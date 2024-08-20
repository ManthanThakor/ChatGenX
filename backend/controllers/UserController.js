const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    password: hashedPassword,
    email,
  });

  newUser.trialExpires = new Date(
    new Date().getTime() + (newUser.trialPeriod || 7) * 24 * 60 * 60 * 1000
  );

  await newUser.save();

  res.json({
    status: true,
    message: "Registration was successful",
    user: { username, email },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  res.json({
    status: true,
    message: "Login successful",
    _id: user._id,
    username: user.username,
    email: user.email,
  });
});

const logout = asyncHandler((req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out successfully" });
});

const UserProfile = asyncHandler(async (req, res) => {
  const id = req.user?.id;
  const user = await User.findById(id)
    .select("-password")
    .populate("payments")
    .populate("contentHistory");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ status: "success", user });
});

const checkAuth = asyncHandler(async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    res.json({ isAuthenticated: !!decoded });
  } catch (error) {
    res.json({ isAuthenticated: false });
  }
});

module.exports = {
  register,
  login,
  logout,
  UserProfile,
  checkAuth,
};
