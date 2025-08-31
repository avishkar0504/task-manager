import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import QuoteHero from "../components/QuoteHero";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Analytics from "../components/Analytics";
import DailyStreaks from "../components/DailyStreaks";
import { SHLOKS } from "../data/shloks"; // Import your shlok data

export default function Home() {
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [learningMode, setLearningMode] = useState("btech");
  const [loading, setLoading] = useState(true);
  const [learnedShloks, setLearnedShloks] = useState([]);
  const [shloksLoading, setShloksLoading] = useState(true);

  // Apply theme class to <body>
  useEffect(() => {
    document.body.classList.remove("light", "dark", "coder");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!uid) {
      navigate("/login");
    } else {
      fetchUserPreferences();
    }
  }, [uid, navigate]);

  // Fetch user preferences from Firebase
  const fetchUserPreferences = async () => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.learningMode) {
          setLearningMode(userData.learningMode);
        }
        if (userData.theme) {
          setTheme(userData.theme);
          localStorage.setItem("theme", userData.theme);
        }
        if (userData.learnedShloks) {
          setLearnedShloks(userData.learnedShloks);
        }
      }
    } catch (error) {
      console.error("Error fetching user preferences: ", error);
    } finally {
      setLoading(false);
      setShloksLoading(false);
    }
  };

  // Update learning mode in Firebase
  const updateLearningMode = async (mode) => {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, { learningMode: mode }, { merge: true });
      setLearningMode(mode);
    } catch (error) {
      console.error("Error updating learning mode: ", error);
    }
  };

  // Update theme in Firebase
  const updateTheme = async (newTheme) => {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, { theme: newTheme }, { merge: true });
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Error updating theme: ", error);
    }
  };

  // Calculate BAMS progress
  const bamsProgress = shloksLoading ? 0 : Math.round((learnedShloks.length / SHLOKS.length) * 100);

  if (!uid)
    return <p className="text-center mt-20 text-gray-500 dark:text-gray-400">Redirecting to login...</p>;

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <main
      className={`flex-1 min-h-screen transition-colors duration-500 ${
        theme === "light"
          ? "bg-gradient-to-b from-gray-100 to-gray-50 text-gray-900"
          : theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-800 text-green-400 font-mono"
      }`}
    >
      {/* Hero Section */}
      <QuoteHero theme={theme} />

      {/* Theme Selector - Improved for mobile */}
      <div className="max-w-7xl mx-auto px-4 pt-6 flex justify-end">
        <div className="inline-flex rounded-md shadow-sm flex-wrap justify-end" role="group">
          <button
            type="button"
            onClick={() => updateTheme("light")}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-l-lg border ${
              theme === "light"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => updateTheme("dark")}
            className={`px-3 py-2 text-xs sm:text-sm font-medium border-t border-b ${
              theme === "dark"
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
          >
            Dark
          </button>
          <button
            type="button"
            onClick={() => updateTheme("coder")}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-r-lg border ${
              theme === "coder"
                ? "bg-green-600 text-black border-green-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
          >
            Coder
          </button>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Learning Mode Selector - Improved for mobile */}
        <div className="lg:col-span-3 text-center mb-4">
          <div className="inline-flex rounded-md shadow-sm flex-col sm:flex-row" role="group">
            <button
              type="button"
              onClick={() => updateLearningMode("btech")}
              className={`px-4 py-3 sm:px-6 sm:py-3 text-sm font-medium rounded-t-lg sm:rounded-l-lg sm:rounded-t-none border ${
                learningMode === "btech"
                  ? theme === "light"
                    ? "bg-blue-600 text-white border-blue-600"
                    : theme === "dark"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-green-600 text-black border-green-600"
                  : theme === "light"
                  ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
                  : "bg-gray-900 text-green-400 border-green-600 hover:bg-gray-800"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              BTech Coding
            </button>
            <button
              type="button"
              onClick={() => updateLearningMode("bams")}
              className={`px-4 py-3 sm:px-6 sm:py-3 text-sm font-medium rounded-b-lg sm:rounded-r-lg sm:rounded-b-none border ${
                learningMode === "bams"
                  ? theme === "light"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : theme === "dark"
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-yellow-600 text-black border-yellow-600"
                  : theme === "light"
                  ? "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
                  : "bg-gray-900 text-green-400 border-green-600 hover:bg-gray-800"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              BAMS Shlok Learning
            </button>
          </div>
        </div>

        {/* Full-width Insights Toggle */}
        <div className="lg:col-span-3 text-center mb-4">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-2xl font-semibold shadow-lg transition-all transform hover:scale-105 ${
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
              className={`shadow-lg rounded-2xl p-4 sm:p-6 hover:shadow-2xl border transition-colors ${
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

        {/* Learning Content Based on Selection */}
        {learningMode === "bams" ? (
          <div className="lg:col-span-3">
            <div
              className={`shadow-lg rounded-2xl p-4 sm:p-6 hover:shadow-2xl border transition-colors ${
                theme === "light"
                  ? "bg-indigo-50 border-indigo-200"
                  : theme === "dark"
                  ? "bg-indigo-900 border-indigo-700"
                  : "bg-gray-900 border-yellow-600"
              }`}
            >
              <div className="flex items-center mb-4 sm:mb-6">
                <div className={`p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 ${
                  theme === "light" ? "bg-indigo-100" : theme === "dark" ? "bg-indigo-800" : "bg-yellow-800"
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">BAMS Preparation</h2>
                  <p className="text-sm sm:text-base text-gray-600">Study Ayurvedic shloks from Charak Samhita</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 sm:mb-6">
                <div className={`p-3 sm:p-4 rounded-lg ${
                  theme === "light" ? "bg-white" : theme === "dark" ? "bg-gray-800" : "bg-gray-900"
                }`}>
                  <h3 className="font-semibold mb-2">Your Progress</h3>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${bamsProgress}%` }}></div>
                    </div>
                    <span className="text-sm">{bamsProgress}%</span>
                  </div>
                  <p className="text-sm mt-2">{learnedShloks.length} of {SHLOKS.length} shloks learned</p>
                </div>
                
                <div className={`p-3 sm:p-4 rounded-lg ${
                  theme === "light" ? "bg-white" : theme === "dark" ? "bg-gray-800" : "bg-gray-900"
                }`}>
                  <h3 className="font-semibold mb-2">Recent Activity</h3>
                  <ul className="text-xs sm:text-sm space-y-1">
                    {learnedShloks.slice(-3).map((shlok, index) => (
                      <li key={index}>✓ Learned {shlok.name}</li>
                    ))}
                    {learnedShloks.length === 0 && (
                      <li>No shloks learned yet. Get started!</li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                <button
                    onClick={() => navigate('/bams-preparation')}
                    className={`px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-medium ${
                      theme === "light"
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : theme === "dark"
                        ? "bg-indigo-700 text-white hover:bg-indigo-600"
                        : "bg-yellow-600 text-black hover:bg-yellow-500"
                    }`}
                  >
                    Continue Learning
                  </button>
                
                <button
                  onClick={() => updateLearningMode("btech")}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
                >
                  Switch to Coding Practice
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3">
            <div
              className={`shadow-lg rounded-2xl p-4 sm:p-6 hover:shadow-2xl border transition-colors ${
                theme === "light"
                  ? "bg-blue-50 border-blue-200"
                  : theme === "dark"
                  ? "bg-blue-900 border-blue-700"
                  : "bg-gray-900 border-green-600"
              }`}
            >
              <div className="flex items-center mb-4 sm:mb-6">
                <div className={`p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 ${
                  theme === "light" ? "bg-blue-100" : theme === "dark" ? "bg-blue-800" : "bg-green-800"
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">BTech Coding Practice</h2>
                  <p className="text-sm sm:text-base text-gray-600">Solve problems from LeetCode and HackerRank</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 sm:mb-6">
                <div className={`p-3 sm:p-4 rounded-lg ${
                  theme === "light" ? "bg-white" : theme === "dark" ? "bg-gray-800" : "bg-gray-900"
                }`}>
                  <h3 className="font-semibold mb-2">Your Progress</h3>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm">60%</span>
                  </div>
                  <p className="text-sm mt-2">24 of 40 problems solved</p>
                </div>
                
                <div className={`p-3 sm:p-4 rounded-lg ${
                  theme === "light" ? "bg-white" : theme === "dark" ? "bg-gray-800" : "bg-gray-900"
                }`}>
                  <h3 className="font-semibold mb-2">Recent Activity</h3>
                  <ul className="text-xs sm:text-sm space-y-1">
                    <li>✓ Solved "Two Sum" yesterday</li>
                    <li>✓ Solved "Reverse String" today</li>
                    <li>→ Next: "Binary Tree Inorder"</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                <button
                  onClick={() => navigate('/btech-practice')}
                  className={`px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-medium ${
                    theme === "light"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : theme === "dark"
                      ? "bg-blue-700 text-white hover:bg-blue-600"
                      : "bg-green-600 text-black hover:bg-green-500"
                  }`}
                >
                  Continue Practicing
                </button>
                
                <button
                  onClick={() => updateLearningMode("bams")}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
                >
                  Switch to BAMS Learning
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Left Column: Your Tasks */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div
            className={`shadow-md rounded-2xl p-4 sm:p-6 hover:shadow-xl border transition-colors ${
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
            className={`shadow-md rounded-2xl p-4 sm:p-6 hover:shadow-xl border transition-colors ${
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
            className={`shadow-md rounded-2xl p-4 sm:p-6 hover:shadow-xl border transition-colors ${
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
            className={`shadow-md rounded-2xl p-3 sm:p-4 text-xs sm:text-sm transition-colors border ${
              theme === "light"
                ? "bg-white border-gray-200 text-gray-600"
                : theme === "dark"
                ? "bg-gray-800 border-gray-700 text-gray-300"
                : "bg-gray-900 border-green-600 text-green-400 font-mono"
            }`}
          >
            <h4 className="font-semibold mb-2 sm:mb-3">💡 Productivity Tips</h4>
            <ul className="list-disc pl-4 sm:pl-5 space-y-1">
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