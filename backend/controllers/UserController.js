const User = require("../models/User");
const bcrypt = require("bcryptjs");
//--------- Registration ---------

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //! Validate
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please all fields are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    // Save the user
    await user.save();
    // Return success message
    res.json({
      status: true,
      message: "Registration was successful",
    });
  } catch (err) {}
};
//--------- Login ---------
//--------- Logout ---------
//--------- Profile ---------
//--------- Check user Auth Status ---------

module.exports = {
  register,
};
