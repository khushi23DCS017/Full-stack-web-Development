const express = require("express");
const { register, login, me } = require("../controllers/authController");
const router = express.Router();

// simple JWT auth middleware
const auth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.substring(7) : null;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);

module.exports = router;
