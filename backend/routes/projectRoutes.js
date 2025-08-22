const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const verifyToken = require("../middlewares/auth");
const allowRoles = require("../middlewares/role")
const Task = require("../models/Task");

// POST /api/projects/request
router.post("/request", verifyToken, async (req, res) => {
  try {
    const { title, description, budget, timeline } = req.body;

    const newProject = new Project({
      title,
      description,
      budget,
      timeline,
      status: "pending",
      client: req.userId, // ✅ Assigning the logged-in user as the client
    });

    await newProject.save();
    res.status(201).json({ message: "Project request submitted" });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});


// GET /api/projects/my-requests
router.get("/my-requests", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ client: req.userId })
      .populate("assignedTo", "name email"); // 👈 so client sees who is working
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});


// Get all project requests (CEO/PM)
router.get("/all", verifyToken, async (req, res) => {
  if (req.user.role !== "ceo" && req.user.role !== "pm")
    return res.status(403).json({ error: "Access denied" });

  const projects = await Project.find()
    .populate("client", "name email")
    .populate("assignedTo", "name email"); // <-- now also populates assignedTo
  res.json(projects);
});

// Approve a project
router.put("/approve/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "ceo" && req.user.role !== "pm")
    return res.status(403).json({ error: "Access denied" });

  await Project.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.json({ message: "Project approved" });
});

// Reject a project
router.put("/reject/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "ceo" && req.user.role !== "pm")
    return res.status(403).json({ error: "Access denied" });

  await Project.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ message: "Project rejected" });
});

// ✅ Get all pending requests (for CEO/PM)
router.get("/pending", verifyToken, allowRoles(["ceo", "pm"]), async (req, res) => {
  try {
    const pendingProjects = await Project.find({ status: "pending" }).populate("client", "name email");
    res.json(pendingProjects);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get project stats (pending, approved, rejected)
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const [pending, approved, rejected] = await Promise.all([
      Project.countDocuments({ status: "pending" }),
      Project.countDocuments({ status: "approved" }),
      Project.countDocuments({ status: "rejected" }),
    ]);
    res.json({ pending, approved, rejected });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// GET /api/users/employees
const User = require("../models/User");

router.get("/users/employees", verifyToken, async (req, res) => {
  if (req.user.role !== "ceo" && req.user.role !== "pm") {
    return res.status(403).json({ error: "Access denied" });
  }

  const employees = await User.find({ role: "employee" }).select("name email");
  res.json(employees);
});

// PUT /api/projects/assign/:projectId
router.put("/assign/:projectId", verifyToken, async (req, res) => {
  const { employeeId } = req.body;

  if (req.user.role !== "ceo" && req.user.role !== "pm") {
    return res.status(403).json({ error: "Access denied" });
  }

  await Project.findByIdAndUpdate(req.params.projectId, {
    assignedTo: employeeId,
  });

  res.json({ message: "Project assigned successfully" });
});

// GET /api/projects/assigned – for Employees to see their assigned projects
router.get("/assigned", verifyToken, async (req, res) => {
  console.log("User role:", req.user.role);
  console.log("User ID:", req.userId);
  console.log("Full user object:", req.user);
  
  if (req.user.role !== "employee") {
    return res.status(403).json({ error: "Access denied. User role is " + req.user.role });
  }

  try {
    const projects = await Project.find({ assignedTo: req.userId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/projects/update-progress/:id
router.put("/update-progress/:id", verifyToken, async (req, res) => {
  console.log("User role:", req.user.role);
  console.log("User ID:", req.userId);
  console.log("Full user object:", req.user);
  
  if (req.user.role !== "employee") {
    return res.status(403).json({ error: "Access denied. User role is " + req.user.role });
  }

  const { progress } = req.body;
  const validProgress = ["not started", "in progress", "completed"];

  if (!validProgress.includes(progress)) {
    return res.status(400).json({ error: "Invalid progress value" });
  }

  try {
    await Project.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.userId }, // only allow update if project is assigned to this employee
      { progress }
    );

    res.json({ message: "Progress updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

// PM creates task
router.post("/create", async (req, res) => {
  try {
     console.log("Incoming Task Payload:", req.body);
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tasks assigned to an employee
router.get("/employee/:id", async (req, res) => {
  const employeeId = req.params.id;
  try {
    const tasks = await Task.find({ assignedTo: employeeId }).populate("projectId");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task status / log hours
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
