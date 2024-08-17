const mongoose = require("mongoose");
const UserTask = require("./UserTask");
const Challenge = require("./Challenge");
const User = require("./User");

const UserChallengeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to user
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  }, // Reference to challenge
  enrolledDate: { type: Date, default: Date.now },
  userTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserTask" }], // Reference to user-specific tasks
});

module.exports = mongoose.model("UserChallenge", UserChallengeSchema);
