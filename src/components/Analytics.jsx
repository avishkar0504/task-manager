import React, { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";
import { CHALLENGES, STREAK_TIERS } from "../data/challenges";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const generateDates = (n) => {
  const arr = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
};

export default function Analytics({ uid }) {
  const [tasks, setTasks] = useState([]);
  const [prevTier, setPrevTier] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeRange, setTimeRange] = useState(30); // default 30 days
  const { width, height } = useWindowSize();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users", uid, "tasks"), (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [uid]);

  const today = new Date().toISOString().slice(0, 10);

  const {
    completedCount,
    pendingCount,
    totalStreak,
    topStreakTask,
    level,
    challengeProgress,
    heatmapData,
    histogramData,
    weeklyGrowthData,
    taskBarData
  } = useMemo(() => {
    let completed = 0, pending = 0, streaks = [];
    const heatmapTemp = {};
    const taskTotals = {};

    tasks.forEach(t => {
      if (t.completions?.includes(today)) completed++;
      else pending++;

      streaks.push({ title: t.title, count: t.dailyStreak?.count || 0 });

      t.completions?.forEach(date => {
        heatmapTemp[date] = (heatmapTemp[date] || 0) + 1;
      });

      taskTotals[t.title] = t.completions?.length || 0;
    });

    const top = streaks.reduce((max, t) => (t.count > max.count ? t : max), { title: "-", count: 0 });
    const total = streaks.reduce((sum, t) => sum + t.count, 0);
    const lvl = STREAK_TIERS.find(l => top.count >= l.min && top.count <= l.max) || STREAK_TIERS[0];

    if (prevTier && lvl.name !== prevTier.name) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setPrevTier(lvl);

    const challengeProgress = CHALLENGES.map(ch => {
      if (ch.type === "dailyStreak") {
        return { ...ch, progress: Math.min(top.count, ch.target), completed: top.count >= ch.target };
      } else if (ch.type === "taskCompletion") {
        const tasksDone = tasks.filter(t => t.completions?.length > 0).length;
        return { ...ch, progress: Math.min(tasksDone, ch.target), completed: tasksDone >= ch.target };
      }
      return { ...ch, progress: 0, completed: false };
    });

    const dates = generateDates(timeRange);
    const heatmapData = dates.map(date => ({
      date,
      count: heatmapTemp[date] || 0
    }));
    const histogramData = heatmapData.map(d => ({ date: d.date.slice(5), tasks: d.count }));

    const weeklyGrowthData = [];
    const weeks = Math.ceil(timeRange / 7);
    for (let i = 0; i < weeks; i++) {
      const weekDates = dates.slice(i * 7, (i + 1) * 7);
      const weekSum = weekDates.reduce((sum, d) => sum + (heatmapTemp[d] || 0), 0);
      weeklyGrowthData.push({ week: `Week ${i + 1}`, streak: weekSum });
    }

    const taskBarData = Object.keys(taskTotals).map(key => ({ name: key, completions: taskTotals[key] }));

    return { completedCount: completed, pendingCount: pending, totalStreak: total, topStreakTask: top, level: lvl, challengeProgress, heatmapData, histogramData, weeklyGrowthData, taskBarData };
  }, [tasks, prevTier, timeRange]);

  // Use CSS variables for colors
  const rootStyles = getComputedStyle(document.documentElement);
  const accentColor = rootStyles.getPropertyValue('--accent-color') || '#0ea5e9';
  const highlightColor = rootStyles.getPropertyValue('--highlight-color') || '#38bdf8';
  const bgColor = rootStyles.getPropertyValue('--bg-color') || '#ffffff';
  const textColor = rootStyles.getPropertyValue('--text-color') || '#111827';
  const maxHeat = Math.max(...heatmapData.map(h => h.count), 1);

  const pieData = [
    { name: "Done Today", value: completedCount },
    { name: "Pending Today", value: pendingCount }
  ];
  const pieColors = [accentColor.trim(), '#e5e7eb'];

  return (
    <div className="relative p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all" style={{ backgroundColor: bgColor, color: textColor }}>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={250} />}

      <h3 className="text-xl font-bold mb-4 text-center">{`📊 Analytics Dashboard`}</h3>

      {/* Time Range Filter */}
      <div className="flex justify-center gap-2 mb-4">
        {[7, 30, 90].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className="px-3 py-1 rounded-md font-semibold transition"
            style={{
              backgroundColor: timeRange === range ? accentColor : '#e5e7eb',
              color: timeRange === range ? '#fff' : '#111827'
            }}
          >
            Last {range} days
          </button>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Streak Task */}
      <div className="rounded-xl p-4 mb-4 text-center shadow-sm" style={{ backgroundColor: highlightColor }}>
        <div className="text-sm" style={{ color: textColor }}>🔥 Top Streak Task</div>
        <div className="text-lg font-bold mt-1">{topStreakTask.title} ({topStreakTask.count} days)</div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${Math.min((topStreakTask.count / level.max) * 100, 100)}%`, backgroundColor: accentColor }}
          />
        </div>
      </div>

      {/* Heatmap */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">🔥 Heatmap</h4>
        <div className="grid grid-cols-7 gap-1">
          {heatmapData.map(day => (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} task(s)`}
              className="w-6 h-6 rounded transition-all"
              style={{ backgroundColor: day.count > 0 ? `rgba(16, 185, 129, ${day.count / maxHeat})` : '#e5e7eb' }}
            />
          ))}
        </div>
      </div>

      {/* Histogram */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">📊 Tasks Completed Histogram</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" stroke={highlightColor} />
            <XAxis dataKey="date" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip />
            <Bar dataKey="tasks" fill={accentColor} isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Growth */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">📈 Weekly Streak Growth</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklyGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke={highlightColor} />
            <XAxis dataKey="week" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip />
            <Line type="monotone" dataKey="streak" stroke={accentColor} strokeWidth={2} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Task Completion Bar Chart */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">📊 Total Task Completions</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={taskBarData}>
            <CartesianGrid strokeDasharray="3 3" stroke={highlightColor} />
            <XAxis dataKey="name" stroke={textColor} />
            <YAxis stroke={textColor} />
            <Tooltip />
            <Bar dataKey="completions" fill={highlightColor} isAnimationActive />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
