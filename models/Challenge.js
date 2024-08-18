const mongoose = require("mongoose");

const Task = require("../models/Task");

const ChallengeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // Reference to tasks
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
});

module.exports = mongoose.model("Challenge", ChallengeSchema);
