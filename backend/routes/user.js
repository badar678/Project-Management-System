// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middlewares/auth");

router.get("/employees", verifyToken, async (req, res) => {
  if (req.user.role !== "ceo" && req.user.role !== "pm") {
    return res.status(403).json({ error: "Access denied" });
  }

  const employees = await User.find({ role: "employee" }).select("name email");
  res.json(employees);
});

module.exports = router;
