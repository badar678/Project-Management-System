const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  budget: { type: Number },
  timeline: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Must be a user with role: 'employee'
    default: null,
  },
  progress: {
    type: String,
    enum: ["not started", "in progress", "completed"],
    default: "not started"
  }  
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
