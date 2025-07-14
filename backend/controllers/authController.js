const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// REGISTER
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if user already exists using email
    const existingUser = await User.findOne({ email: username });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Save email as 'email', not 'username'
    const user = await User.create({ email: username, password: hashed });

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(400).json({ error: "Registration failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log(`[LOGIN ATTEMPT] Username: ${username}`);

  try {
    const user = await User.findOne({ email: username });
    if (!user) {
      console.log(`[LOGIN FAILED] No user found for ${username}`);
      return res.status(400).json({ error: "Invalid user" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log(`[LOGIN FAILED] Incorrect password for ${username}`);
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log(`[LOGIN SUCCESS] ${username}`);
    res.json({ token, username: user.email });
  } catch (err) {
    console.error(`[LOGIN ERROR] ${username}:`, err);
    res.status(500).json({ error: "Login failed" });
  }
};

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
};
