const schedule = require("node-schedule");
const Challenge = require("./models/Challenge");
const User = require("./models/User");

// Check daily for missed progress and notify users
schedule.scheduleJob("0 0 * * *", async () => {
  try {
    const challenges = await Challenge.find();

    for (let challenge of challenges) {
      for (let userId of challenge.usersEnrolled) {
        const userProgress = challenge.progress.filter(
          (p) => p.userId.toString() === userId.toString()
        );
        const today = new Date().toDateString();

        const progressForToday = userProgress.find(
          (p) => new Date(p.date).toDateString() === today
        );
        if (!progressForToday || !progressForToday.completed) {
          const user = await User.findById(userId);
          // Send notification to the user (this is just a placeholder, actual implementation may vary)
          console.log(
            `Sending notification to ${user.email}: You missed today's challenge!`
          );
        }
      }
    }
  } catch (err) {
    console.error("Error checking progress:", err);
  }
});
