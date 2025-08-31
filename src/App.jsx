// src/App.jsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // make sure you exported auth in firebase.js
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import BAMSPreparation from "./pages/BAMSPreparation";
import BTechPractice from "./pages/BTechPractice";
import Navbar from "./components/Navbar";

const Protected = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove(
      "theme-light",
      "theme-dark",
      "theme-coder"
    );
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar theme={theme} setTheme={setTheme} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <Protected>
                <Home theme={theme} setTheme={setTheme} />
              </Protected>
            }
          />
          <Route
            path="/bams-preparation"
            element={
              <Protected>
                <BAMSPreparation />
              </Protected>
            }
          />
          <Route
            path="/btech-practice"
            element={
              <Protected>
                <BTechPractice />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}
