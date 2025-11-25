const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// Middleware For Protecting Routes
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select("-password");
      next();
    } else {
      res.status(401).json({ message: "Not Authorized,no token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token Failed", error: error.message });
  }
};

// Middleware for admin-only access

const adminOnly = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Admin Only Access" });
  }
};

module.exports = { protect, adminOnly };
