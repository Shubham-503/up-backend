const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true }, // To manage task sequence
  points: { type: Number, default: 0 }, // Points awarded for completing the task
});

module.exports = mongoose.model("Task", TaskSchema);
