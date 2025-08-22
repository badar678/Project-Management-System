const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;  // Changed from decoded.userId to decoded.id
    req.user = { id: decoded.id, role: decoded.role }; // <-- Add this line
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = verifyToken;
