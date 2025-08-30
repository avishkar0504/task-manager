import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuoteHero from "../components/QuoteHero";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Analytics from "../components/Analytics";
import DailyStreaks from "../components/DailyStreaks";

export default function Home() {
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply theme class to <body>
  useEffect(() => {
    document.body.classList.remove("light", "dark", "coder");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!uid) {
      navigate("/login");
    }
  }, [uid, navigate]);

  if (!uid)
    return <p className="text-center mt-20 text-gray-500 dark:text-gray-400">Redirecting to login...</p>;

  return (
    <main
      className={`flex-1 min-h-screen transition-colors duration-500 ${
        theme === "light"
          ? "bg-gradient-to-b from-gray-100 to-gray-50 text-gray-900"
          : theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-800 text-green-400 font-mono" // coder theme
      }`}
    >
      {/* Hero Section */}
      <QuoteHero theme={theme} />

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Full-width Insights Toggle */}
        <div className="lg:col-span-3 text-center mb-4">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all transform hover:scale-105 ${
              theme === "light"
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : theme === "dark"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-green-600 text-black hover:bg-green-700"
            }`}
          >
            {showAnalytics ? "Hide Your Insights" : "View Your Insights"}
          </button>
        </div>

        {/* Analytics Dashboard */}
        {showAnalytics && (
          <div className="lg:col-span-3 transition-all duration-500 ease-in-out">
            <div
              className={`shadow-lg rounded-2xl p-6 hover:shadow-2xl border transition-colors ${
                theme === "light"
                  ? "bg-white border-gray-200"
                  : theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-900 border-green-600"
              }`}
            >
              {uid && <Analytics uid={uid} theme={theme} />}
            </div>
          </div>
        )}

        {/* Left Column: Your Tasks */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div
            className={`shadow-md rounded-2xl p-6 hover:shadow-xl border transition-colors ${
              theme === "light"
                ? "bg-white border-gray-200"
                : theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-900 border-green-600"
            }`}
          >
            {uid && <TaskList uid={uid} theme={theme} />}
          </div>

          <div
            className={`shadow-md rounded-2xl p-6 hover:shadow-xl border transition-colors ${
              theme === "light"
                ? "bg-white border-gray-200"
                : theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-900 border-green-600"
            }`}
          >
            {uid && <TaskForm uid={uid} theme={theme} />}
          </div>
        </div>

        {/* Right Column: Daily Streaks + Tips */}
        <div className="flex flex-col gap-6">
          <div
            className={`shadow-md rounded-2xl p-6 hover:shadow-xl border transition-colors ${
              theme === "light"
                ? "bg-yellow-50 border-yellow-200"
                : theme === "dark"
                ? "bg-yellow-900 border-yellow-700"
                : "bg-yellow-800 border-green-500 text-black"
            }`}
          >
            {uid && <DailyStreaks uid={uid} theme={theme} />}
          </div>

          <div
            className={`shadow-md rounded-2xl p-4 text-sm transition-colors border ${
              theme === "light"
                ? "bg-white border-gray-200 text-gray-600"
                : theme === "dark"
                ? "bg-gray-800 border-gray-700 text-gray-300"
                : "bg-gray-900 border-green-600 text-green-400 font-mono"
            }`}
          >
            <h4 className="font-semibold mb-3">💡 Productivity Tips</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use daily for habits, weekly for routines, monthly for milestones.</li>
              <li>Hit <em>Check-in today</em> after completing a task to track streaks.</li>
              <li>Keep titles short, add details in notes.</li>
              <li>Prioritize tasks by importance and deadlines.</li>
              <li>Use streaks & challenges to gamify productivity!</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
