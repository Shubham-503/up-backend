const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Challenge = require("../models/Challenge");
const UserChallenge = require("../models/UserChallenge");
const UserTask = require("../models/UserTask");
const User = require("../models/User");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

// Get all challenges
// Note: Removed AuthMiddleware
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific challenge by ID
// Note: Removed AuthMiddleware
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate("tasks");
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    if (req.userId) {
      let userChallenge = await UserChallenge.findOne({
        user: req.userId,
        challenge: req.params.id,
      })
        .populate({
          path: "userTasks", // Populate the userTasks field
          populate: {
            path: "task", // Populate the task field within userTasks
            model: "Task", // Optional: specify the model for the task if needed
          },
        })
        .populate("challenge");
      if (userChallenge) return res.json({ status: "enrolled", userChallenge });
    }
    return res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enroll in a challenge
router.post("/:id/enroll", authMiddleware, async (req, res) => {
  try {
    const challengeId = req.params.id;
    const challenge = await Challenge.findById(challengeId);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    // Check if the user is already enrolled in the challenge
    let userChallenge = await UserChallenge.findOne({
      user: req.userId,
      challenge: challengeId,
    });
    let Currentuser = await User.findById(req.userId);
    if (userChallenge) {
      return res
        .status(400)
        .json({ message: "User already enrolled in this challenge" });
    }

    // Prepare the user's tasks with the initial status
    const userTasks = challenge.tasks.map((task) => ({
      task: task._id,
      isCompleted: false,
    }));
    const userTasksInserted = await UserTask.insertMany(userTasks);
    console.log(userTasks);
    console.log(req.userId);

    // Create a new UserChallenge document
    userChallenge = new UserChallenge({
      user: new mongoose.Types.ObjectId(req.userId),
      challenge: new mongoose.Types.ObjectId(challengeId),
      userTasks: userTasksInserted.map((task) => task._id),
    });
    await userChallenge.save();
    await Currentuser.enrolledChallenges.push(userChallenge);
    await Currentuser.save();
    res.status(201).json({
      message: "User enrolled in challenge successfully",
      userChallenge,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/:id/tasks", async (req, res) => {
  try {
    const challengeId = req.params.id;
    // const challenge = await Challenge.findById(challengeId).pupulate("tasks");
    const challenge = await Challenge.findById(challengeId).populate("tasks");
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json(challenge.tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// API to toggle the status of a user task
router.post(
  "/:challengeId/tasks/:taskId/toggle-task",
  authMiddleware,
  async (req, res) => {
    try {
      const { challengeId, taskId } = req.params;
      const userId = req.userId;

      // Find the UserChallenge document
      let userChallenge = await UserChallenge.findOne({
        user: new mongoose.Types.ObjectId(userId),
        challenge: new mongoose.Types.ObjectId(challengeId),
      }).populate("userTasks");

      if (!userChallenge) {
        return res.status(404).json({ message: "User challenge not found" });
      }

      // Find the specific task in the user's tasks array
      console.log(JSON.stringify(userChallenge), taskId);

      let task = userChallenge.userTasks.find(
        (t) => t._id.toString() === taskId
      );

      if (!task) {
        return res
          .status(404)
          .json({ message: "Task not found in user challenge" });
      }

      // Toggle the task status
      task.isCompleted = !task.isCompleted;

      // Save the changes to the specific UserTask
      await UserTask.findByIdAndUpdate(task._id, {
        isCompleted: task.isCompleted,
      });

      // Find and save the updated UserChallenge
      userChallenge = await UserChallenge.findById(userChallenge._id).populate(
        "userTasks"
      );
      // Save the changes
      // await userChallenge.save();

      res
        .status(200)
        .json({ message: "Task status updated successfully", userChallenge });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

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

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, tasks, startDate } = req.body;
    console.log(userId, title, description, tasks, startDate);

    // Prepare the user's tasks with the initial status
    // const Tasks = challenge.tasks.map((task) => ({
    //   task: task._id,
    //   isCompleted: false,
    // }));
    const challengeTasksInserted = await Task.insertMany(tasks);

    // Create a new challenge
    const newChallenge = new Challenge({
      name: title,
      description,
      tasks: challengeTasksInserted,
      startDate,
    });

    // Save the new challenge
    const savedChallenge = await newChallenge.save();

    // Find the user and update their createdChallenges
    const user = await User.findById(userId);
    user.createdChallenges.push(savedChallenge._id);

    // Save the user
    await user.save();

    res.status(201).json({
      message: "Challenge created successfully",
      challenge: savedChallenge,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;
