import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply theme class to <body>
  useEffect(() => {
    document.body.classList.remove("light", "dark", "coder");
    document.body.classList.add(theme);
  }, [theme]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, password);

      localStorage.setItem("uid", cred.user.uid);
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${
        theme === "light"
          ? "bg-gray-50 text-gray-900"
          : theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-800 text-green-400 font-mono"
      }`}
    >
      <div
        className={`max-w-md w-full rounded-xl p-6 shadow-lg transition-colors duration-500 ${
          theme === "light"
            ? "bg-white border border-gray-200"
            : theme === "dark"
            ? "bg-gray-800 border border-gray-700"
            : "bg-gray-900 border border-green-600"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 text-center transition-colors duration-500 ${
            theme === "light"
              ? "text-gray-800"
              : theme === "dark"
              ? "text-gray-100"
              : "text-green-400"
          }`}
        >
          Welcome back 👋
        </h2>

        {error && (
          <div
            className={`mb-4 text-sm p-3 rounded transition-colors duration-500 ${
              theme === "light"
                ? "text-red-600 bg-red-50"
                : theme === "dark"
                ? "text-red-400 bg-red-900"
                : "text-red-400 bg-gray-900"
            }`}
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-500 ${
              theme === "light"
                ? "border border-gray-300 focus:ring-sky-500 bg-white text-gray-900"
                : theme === "dark"
                ? "border border-gray-600 focus:ring-sky-400 bg-gray-700 text-gray-100"
                : "border border-green-600 focus:ring-green-400 bg-gray-900 text-green-400 font-mono"
            }`}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-500 ${
              theme === "light"
                ? "border border-gray-300 focus:ring-sky-500 bg-white text-gray-900"
                : theme === "dark"
                ? "border border-gray-600 focus:ring-sky-400 bg-gray-700 text-gray-100"
                : "border border-green-600 focus:ring-green-400 bg-gray-900 text-green-400 font-mono"
            }`}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className={`w-full py-2 rounded-lg font-medium transition-colors duration-500 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : theme === "light"
                ? "bg-sky-600 hover:bg-sky-700 text-white"
                : theme === "dark"
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-black font-mono"
            }`}
          >
            {loading ? "Please wait…" : "Login"}
          </button>
        </form>

        <p
          className={`text-sm text-center mt-4 transition-colors duration-500 ${
            theme === "light"
              ? "text-gray-600"
              : theme === "dark"
              ? "text-gray-300"
              : "text-green-400 font-mono"
          }`}
        >
          No account?{" "}
          <Link
            to="/signup"
            className={`font-medium ${
              theme === "light"
                ? "text-sky-600"
                : theme === "dark"
                ? "text-sky-400"
                : "text-green-300 font-mono"
            }`}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
