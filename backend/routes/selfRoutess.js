const express = require("express");
const router = express.Router();
const Self = require("../models/Self");
const auth = require("../middleware/authMiddleware");


// ================= ADD TASK =================
router.post("/add", auth, async (req, res) => {
  try {
    const newTask = new Self({
      ...req.body,
      user: req.user,
    });

    await newTask.save();
    res.json(newTask);

  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= GET USER TASKS =================
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Self.find({ user: req.user });
    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= UPDATE TASK =================
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Self.findById(req.params.id);
    if (!task)
      return res.status(404).json({ error: "Task not found" });

    if (task.user.toString() !== req.user)
      return res.status(403).json({ error: "Not authorized" });

    const { WeekProgress, Days, Streak, LongestStreak } = req.body;

    task.WeekProgress = WeekProgress;
    task.Days = Days;
    task.Streak = Streak;
    task.LongestStreak = LongestStreak;

    await task.save();
    res.json(task);

  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});


// ================= RESET WEEK =================
router.put("/reset-week/:id", auth, async (req, res) => {
  try {
    const task = await Self.findById(req.params.id);
    if (!task)
      return res.status(404).json({ error: "Task not found" });

    if (task.user.toString() !== req.user)
      return res.status(403).json({ error: "Not authorized" });

    const completed = task.WeekProgress.filter(Boolean).length;
    task.WeekHistory.push(completed);

    task.WeekProgress = [false, false, false, false, false, false, false];
    task.Streak = 0;

    await task.save();
    res.json(task);

  } catch (err) {
    res.status(500).json({ error: "Reset week failed" });
  }
});


// ================= DELETE TASK =================
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Self.findById(req.params.id);
    if (!task)
      return res.status(404).json({ error: "Task not found" });

    if (task.user.toString() !== req.user)
      return res.status(403).json({ error: "Not authorized" });

    await task.deleteOne();
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;