const mongoose = require("mongoose");

const SelfSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  Task: String,
  Days: Number,
  Streak: Number,
  LongestStreak: Number,

  WeekProgress: {
    type: [Boolean],
    default: [false, false, false, false, false, false, false],
  },

  WeekHistory: {
    type: [Number],
    default: [],
  },
});

module.exports = mongoose.model("Self", SelfSchema);