const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  unlockDate: { type: String, required: true },
  status: {
    type: String,
    enum: ["locked", "notCompleted", "completed"],
    required: true,
  },
  rewards: { type: Number, default: 0 }, // Points awarded for completing the task
});

module.exports = mongoose.model("Task", TaskSchema);
