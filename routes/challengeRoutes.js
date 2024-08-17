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
    } else {
      return res.json({ message: "Already Enrolled" });
    }
    return res.json({ message: "Enrolled successfully", challenge });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get progress for a specific user in a specific challenge
router.get("/:id/progress", authMiddleware, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    const userProgress = challenge.progress.filter(
      (p) => p.userId.toString() === req.userId
    );
    res.json(userProgress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update progress for a specific user in a specific challenge
router.post("/:id/progress", authMiddleware, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    const { date, completed } = req.body;
    const existingProgress = challenge.progress.find(
      (p) =>
        p.userId.toString() === req.userId &&
        new Date(p.date).toDateString() === new Date(date).toDateString()
    );

    if (existingProgress) {
      existingProgress.completed = completed;
    } else {
      challenge.progress.push({
        userId: req.userId,
        date: new Date(date),
        completed: completed,
      });
    }

    await challenge.save();
    res.json({ message: "Progress updated successfully", challenge });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
