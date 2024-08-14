const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Email or username already exists" });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    let token = jwt.sign({ userId: user._id }, "secretkey", {
      expiresIn: "1h",
    });
    // token = `Bearer ${token}`;
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
