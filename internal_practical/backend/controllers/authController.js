const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  let { name, email, password } = req.body;
  try {
    name = typeof name === "string" ? name.trim() : name;
    email = typeof email === "string" ? email.trim().toLowerCase() : email;
    password = typeof password === "string" ? password : password;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const created = await User.create({ name, email, password: hashedPassword });

    const user = { id: created._id, name: created.name, email: created.email };
    return res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  let { email, password } = req.body;
  try {
    email = typeof email === "string" ? email.trim().toLowerCase() : email;
    password = typeof password === "string" ? password : password;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const safeUser = { id: user._id, name: user.name, email: user.email };
    return res.json({ message: "Login successful", token, user: safeUser });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// PROFILE (protected)
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("_id name email");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
