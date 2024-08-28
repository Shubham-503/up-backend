const mongoose = require("mongoose");

const Task = require("../models/Task");

const ChallengeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // Reference to tasks
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  duration: { type: Number, required: true },
  tasksVisibility: {
    type: String,
    enum: ["all", "unlock", "enrolled"],
    required: true,
  },
});

module.exports = mongoose.model("Challenge", ChallengeSchema);
