const express = require("express");
const router = express.Router();
const Challenge = require("../models/Challenge");
const authMiddleware = require("../middleware/authMiddleware");

// Get all challenges
router.get("/", authMiddleware, async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific challenge by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enroll in a challenge
router.post("/:id/enroll", authMiddleware, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    if (!challenge.usersEnrolled.includes(req.userId)) {
      challenge.usersEnrolled.push(req.userId);
      await challenge.save();
    }
    res.json({ message: "Enrolled successfully", challenge });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
