const mongoose = require("mongoose");

const UserTaskSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  isCompleted: { type: Boolean, default: false },
  completionDate: { type: Date },
});

module.exports = mongoose.model("UserTask", UserTaskSchema);
