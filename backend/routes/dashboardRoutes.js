const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth");       // ✅ from auth.js
const authorizeRole = require("../middlewares/role");     // ✅ from role.js

router.get("/ceo", verifyToken, authorizeRole(["ceo"]), (req, res) => {
  res.json({ message: "Welcome CEO", user: req.user });
});

router.get("/client", verifyToken, authorizeRole(["client"]), (req, res) => {
  res.json({ message: "Welcome Client", user: req.user });
});

router.get("/pm", verifyToken, authorizeRole(["pm"]), (req, res) => {
  res.json({ message: "Welcome Project Manager", user: req.user });
});

router.get("/employee", verifyToken, authorizeRole(["employee"]), (req, res) => {
  res.json({ message: "Welcome Employee", user: req.user });
});

module.exports = router;
