const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Only allow your frontend's origin
app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true                
}));

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);



module.exports = app;
