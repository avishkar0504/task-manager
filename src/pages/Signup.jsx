import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply theme class to <body>
  useEffect(() => {
    document.body.classList.remove("light", "dark", "coder");
    document.body.classList.add(theme);
  }, [theme]);

  const strong = (pwd) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!strong(form.password)) {
      alert("Password must be 8+ chars, include a number and uppercase letter");
      return;
    }

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.username });
      await setDoc(doc(db, "users", cred.user.uid), {
        username: form.username,
        email: form.email,
        createdAt: serverTimestamp(),
      });
      localStorage.setItem("uid", cred.user.uid);
      navigate("/home");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup error: " + (err.message || err.code));
    } finally {
      setLoading(false);
    }
  };

  const themeClasses = {
    container: {
      light: "bg-white border border-gray-200 text-gray-900",
      dark: "bg-gray-800 border border-gray-700 text-gray-100",
      coder: "bg-gray-900 border border-green-600 text-green-400 font-mono",
    },
    input: {
      light: "border border-gray-300 bg-white text-gray-900 focus:ring-sky-500",
      dark: "border border-gray-600 bg-gray-700 text-gray-100 focus:ring-sky-400",
      coder: "border border-green-600 bg-gray-900 text-green-400 font-mono focus:ring-green-400",
    },
    heading: {
      light: "text-gray-800",
      dark: "text-gray-100",
      coder: "text-green-400 font-mono",
    },
    link: {
      light: "text-sky-600",
      dark: "text-sky-400",
      coder: "text-green-300 font-mono",
    },
    button: {
      light: "bg-sky-600 hover:bg-sky-700 text-white",
      dark: "bg-indigo-600 hover:bg-indigo-700 text-white",
      coder: "bg-green-600 hover:bg-green-700 text-black font-mono",
    },
  };

  return (
    <div
      className={`w-full min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${
        theme === "light" ? "bg-gray-50" : theme === "dark" ? "bg-gray-900" : "bg-gray-800"
      }`}
    >
      <div
        className={`max-w-md w-full rounded-xl p-6 shadow-lg transition-colors duration-500 ${themeClasses.container[theme]}`}
      >
        <h2 className={`text-2xl font-bold mb-6 text-center transition-colors duration-500 ${themeClasses.heading[theme]}`}>
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className={`input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-500 ${themeClasses.input[theme]}`}
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            className={`input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-500 ${themeClasses.input[theme]}`}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className={`input w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-500 ${themeClasses.input[theme]}`}
            type="password"
            placeholder="Strong password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-medium transition-colors duration-500 ${loading ? "bg-gray-400 cursor-not-allowed" : themeClasses.button[theme]}`}
          >
            {loading ? "Please wait…" : "Sign up"}
          </button>

          <p className={`text-sm text-center mt-4 transition-colors duration-500 ${themeClasses.heading[theme]}`}>
            Already have an account?{" "}
            <Link to="/login" className={themeClasses.link[theme]}>
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
