const asyncHandler = require("express-async-handler"); // Import asyncHandler
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
//--------- Logout ---------
//--------- Profile ---------
//--------- Check user Auth Status ---------

module.exports = {
  register,
};
