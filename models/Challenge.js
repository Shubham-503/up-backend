const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true }, // duration in days
  usersEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Challenge", ChallengeSchema);
