import React, { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { STREAK_TIERS, CHALLENGES } from "../data/challenges";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TIER_QUOTES = {
  Beginner: "Every journey begins with a single step.",
  Intermediate: "Keep going! Progress is visible.",
  Advanced: "Your consistency is inspiring!",
  Master: "Legendary streak! Keep conquering!"
};

export default function DailyStreaks({ uid }) {
  const [tasks, setTasks] = useState([]);
  const [prevTier, setPrevTier] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const rootStyles = getComputedStyle(document.documentElement);
  const bgColor = rootStyles.getPropertyValue("--bg-color").trim() || "#ffffff";
  const textColor = rootStyles.getPropertyValue("--text-color").trim() || "#111827";
  const accentColor = rootStyles.getPropertyValue("--accent-color").trim() || "#0ea5e9";
  const highlightColor = rootStyles.getPropertyValue("--highlight-color").trim() || "#38bdf8";

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users", uid, "tasks"), (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [uid]);

  const { topStreakTask, totalStreak, level, challengeProgress, heatmapData } = useMemo(() => {
    let streaks = [];
    const heatmapTemp = {};

    tasks.forEach((t) => {
      streaks.push({ title: t.title, count: t.dailyStreak?.count || 0 });
      t.completions?.forEach((date) => {
        heatmapTemp[date] = (heatmapTemp[date] || 0) + 1;
      });
    });

    const top = streaks.reduce((max, t) => (t.count > max.count ? t : max), { title: "-", count: 0 });
    const total = streaks.reduce((sum, t) => sum + t.count, 0);
    const lvl = STREAK_TIERS.find((l) => top.count >= l.min && top.count <= l.max) || STREAK_TIERS[0];

    if (prevTier?.name !== lvl.name) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setPrevTier(lvl);
    }

    const challengeProgress = CHALLENGES.map((ch) => {
      if (ch.type === "dailyStreak") {
        return { ...ch, progress: Math.min(top.count, ch.target), completed: top.count >= ch.target };
      } else if (ch.type === "taskCompletion") {
        const tasksDone = tasks.filter((t) => t.completions?.length > 0).length;
        return { ...ch, progress: Math.min(tasksDone, ch.target), completed: tasksDone >= ch.target };
      }
      return { ...ch, progress: 0, completed: false };
    });

    const dates = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().slice(0, 10);
      return { date: str, count: heatmapTemp[str] || 0 };
    }).reverse();

    return { topStreakTask: top, totalStreak: total, level: lvl, challengeProgress, heatmapData: dates };
  }, [tasks, prevTier]);

  const maxHeat = Math.max(...heatmapData.map((h) => h.count), 1);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "0px"
  };

  return (
    <div className="relative p-6 rounded-2xl shadow-lg border transition-all" style={{ backgroundColor: bgColor, color: textColor }}>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={250} />}

      <h3 className="text-lg font-semibold mb-4 text-center">🔥 Daily Streak Dashboard</h3>

      {/* Top Streak */}
      <div className="rounded-xl p-4 mb-4 text-center shadow-sm" style={{ backgroundColor: highlightColor, color: textColor }}>
        <div className="text-sm mb-1">Top Streak Task</div>
        <div className="text-lg font-bold">{topStreakTask.title} ({topStreakTask.count} days)</div>
        <div className="mt-2 flex items-center justify-center gap-2 p-1 rounded-full" style={{ backgroundColor: bgColor }}>
          <span className="font-semibold" style={{ color: accentColor }}>{level.name}</span>
        </div>
      </div>

      {/* Tier Carousel */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-4 text-center" style={{ color: textColor }}>🏆 Tier Progress</h4>
        <Slider {...sliderSettings}>
          {STREAK_TIERS.map((tier) => (
            <div key={tier.name} className="flex flex-col items-center justify-center p-6">
              <div className="flex items-center justify-center w-full">
                <img
                  src={`/icons/${tier.name?.toLowerCase() || "default"}.png`}
                  alt={tier.name}
                  className="object-contain"
                  style={{
                    width: "140px",
                    height: "140px",
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                  onError={(e) => (e.target.src = "/icons/default.png")}
                />
              </div>
              <span className="text-lg font-semibold mb-1 text-center" style={{ color: accentColor }}>{tier.name}</span>
              <p className="text-sm italic mb-2 text-center" style={{ color: textColor }}>{TIER_QUOTES[tier.name]}</p>
              <div className="text-xs text-gray-600 text-center">
                Requirement: {tier.min} - {tier.max === Infinity ? "∞" : tier.max} consecutive days
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Total Streak */}
      <div className="rounded-xl p-4 mb-4 text-center shadow-sm" style={{ backgroundColor: highlightColor, color: textColor }}>
        <div className="text-sm mb-1">Total Streak Across Tasks</div>
        <div className="text-lg font-bold">{totalStreak} days</div>
      </div>

      {/* Challenges */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2" style={{ color: textColor }}>🏅 Challenges</h4>
        <ul className="space-y-2 text-sm">
          {challengeProgress.map((ch) => (
            <li key={ch.id} className="p-2 rounded-md" style={{ backgroundColor: ch.completed ? accentColor + "22" : bgColor }}>
              <div className="flex justify-between mb-1 items-center">
                <span>{ch.title}</span>
                <span>{ch.progress}/{ch.target} {ch.completed && "✅"}</span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: `${highlightColor}33` }}>
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${(ch.progress / ch.target) * 100}%`, backgroundColor: ch.completed ? accentColor : highlightColor }}
                />
              </div>
              {ch.completed && (
                <div className="mt-1 text-xs font-semibold" style={{ color: accentColor }}>
                  🎉 Challenge Completed! Reward: {ch.reward} will be awarded.
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Heatmap */}
      <div>
        <h4 className="text-sm font-medium mb-2" style={{ color: textColor }}>🔥 Daily Completion Heatmap (Last 30 Days)</h4>
        <div className="grid grid-cols-7 gap-1">
          {heatmapData.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} task(s)`}
              className="w-6 h-6 rounded"
              style={{ backgroundColor: `rgba(16, 185, 129, ${day.count / maxHeat})` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
