const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: String,
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // employee
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // pm
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Review", "Completed"],
    default: "Not Started"
  },
  dueDate: Date,
  timeEstimateHours: Number,
  hoursLogged: {
    type: Number,
    default: 0
  },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
