import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, updateDoc, arrayUnion, doc, deleteDoc } from "firebase/firestore";
import { CHALLENGES, STREAK_TIERS } from "../data/challenges";

const isoToday = () => new Date().toISOString().slice(0, 10);

export default function TaskList({ uid }) {
  const [tasks, setTasks] = useState([]);
  const [activeStreakTask, setActiveStreakTask] = useState(null); // 🔹 streak animation

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users", uid, "tasks"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(list);
    });
    return unsub;
  }, [uid]);

  const getTier = (streak) => {
    let tier = STREAK_TIERS[0];
    STREAK_TIERS.forEach((t) => {
      if (streak >= t.min) tier = t;
    });
    return tier;
  };

  const checkInToday = async (task) => {
    try {
      const taskRef = doc(db, "users", uid, "tasks", task.id);
      const today = isoToday();
      const alreadyChecked = task.completions?.includes(today);

      if (!alreadyChecked) {
        let newStreak = 1;
        const lastCheck = task.dailyStreak?.lastCheckIn;
        if (lastCheck) {
          const lastDate = new Date(lastCheck);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastDate.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10)) {
            newStreak = (task.dailyStreak?.count || 0) + 1;
          }
        }

        await updateDoc(taskRef, {
          completions: arrayUnion(today),
          dailyStreak: { count: newStreak, lastCheckIn: today },
        });

        setActiveStreakTask({ title: task.title, streak: newStreak, tier: getTier(newStreak) });
        setTimeout(() => setActiveStreakTask(null), 2500);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const removeTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteDoc(doc(db, "users", uid, "tasks", taskId));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="container-card relative" style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}>
      <h3 className="text-lg font-semibold mb-3">Your Tasks</h3>
      {tasks.length === 0 && <p className="text-gray-500 dark:text-gray-400">No tasks yet. Add one above.</p>}

      <ul className="space-y-2">
        {tasks.map((t) => {
          const streak = t.dailyStreak?.count || 0;
          const tier = getTier(streak);
          return (
            <li
              key={t.id}
              className="flex flex-col md:flex-row items-start justify-between rounded-xl p-3 relative"
              style={{ backgroundColor: "var(--card-bg-color)" }}
            >
              <div className="flex-1">
                <div className="font-medium">{t.title}</div>
                {t.notes && <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t.notes}</div>}
                <div className="mt-2 flex gap-2">
                  {t.recurrence?.map((r) => (
                    <span
                      key={r}
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        r === "daily"
                          ? "badge-blue"
                          : r === "weekly"
                          ? "badge-amber"
                          : "badge-green"
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <div className="mt-2 h-2 w-full bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: tier.color,
                      width: `${Math.min(100, ((streak - tier.min) / (tier.max - tier.min)) * 100)}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Tier: {tier.name} ({streak} days)
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => checkInToday(t)}
                  className="btn btn-primary"
                  style={{ backgroundColor: "var(--accent-color)", color: "var(--text-color)" }}
                >
                  Check-in today
                </button>
                <button
                  onClick={() => removeTask(t.id)}
                  className="btn btn-danger"
                  style={{ backgroundColor: "var(--danger-color)", color: "var(--text-color)" }}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {activeStreakTask && (
        <div
          className="absolute top-10 left-1/2 transform -translate-x-1/2 rounded-xl p-4 flex flex-col items-center gap-2 font-bold animate-scaleIn z-50"
          style={{
            backgroundColor: "var(--card-bg-color)",
            borderColor: "var(--accent-color)",
            color: "var(--highlight-color)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <span className="text-3xl">🔥</span>
          <div>Woah! Streak maintained</div>
          <div className="text-sm">
            {activeStreakTask.streak} day{activeStreakTask.streak > 1 ? "s" : ""}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{activeStreakTask.tier.name} Tier</div>
        </div>
      )}

      <style>
        {`
          @keyframes scaleIn {
            0% { opacity: 0; transform: translateX(-50%) scale(0.5); }
            50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
            100% { opacity: 1; transform: translateX(-50%) scale(1); }
          }
          .animate-scaleIn { animation: scaleIn 0.5s ease forwards; }
        `}
      </style>
    </div>
  );
}
