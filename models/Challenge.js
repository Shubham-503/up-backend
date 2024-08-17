const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false },
});

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true }, // duration in days
  usersEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  progress: [ProgressSchema],
});

module.exports = mongoose.model("Challenge", ChallengeSchema);
