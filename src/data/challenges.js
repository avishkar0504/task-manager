// src/data/challenges.js

// Daily streak challenges
export const CHALLENGES = [
  {
    id: "daily_7",
    title: "7-Day Streak",
    type: "dailyStreak",
    target: 7,
    reward: "🔥 7-Day Streak Badge"
  },
  {
    id: "daily_14",
    title: "14-Day Streak",
    type: "dailyStreak",
    target: 14,
    reward: "🌟 14-Day Streak Badge"
  },
  {
    id: "daily_30",
    title: "30-Day Streak",
    type: "dailyStreak",
    target: 30,
    reward: "🏅 30-Day Streak Badge"
  },

  // Task completion challenges
  {
    id: "complete_10_tasks",
    title: "Complete 10 Tasks",
    type: "taskCompletion",
    target: 10,
    reward: "🏆 Task Master Certificate"
  },
  {
    id: "complete_50_tasks",
    title: "Complete 50 Tasks",
    type: "taskCompletion",
    target: 50,
    reward: "🎖️ Task Champion Certificate"
  }
];

// Optional: Level tiers based on streak count
export const STREAK_TIERS = [
  {
    name: "Bronze",
    min: 1,
    max: 3,
    icon: "/icons/bronze.png" // PNG icon for UI display
  },
  {
    name: "Silver",
    min: 4,
    max: 7,
    icon: "/icons/silver.png"
  },
  {
    name: "Gold",
    min: 8,
    max: 14,
    icon: "/icons/gold.png"
  },
  {
    name: "Diamond",
    min: 15,
    max: Infinity,
    icon: "/icons/diamond.png"
  }
];
