import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Hamburger + Close icons

export default function Navbar({ theme, setTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");

  const logout = () => {
    localStorage.removeItem("uid");
    navigate("/login");
  };

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    window.location.reload();
  };

  // Dynamic classes based on theme
  const bgClass =
    theme === "light"
      ? "bg-white/70 text-gray-900"
      : theme === "dark"
      ? "bg-gray-900/70 text-gray-100"
      : "bg-gray-800/70 text-cyan-200"; // coder theme
  const linkActiveClass =
    theme === "light"
      ? "bg-gray-200 text-gray-900"
      : theme === "dark"
      ? "bg-gray-700 text-gray-100"
      : "bg-gray-700 text-cyan-200"; // coder theme

  const buttonBgClass =
    theme === "light"
      ? "bg-sky-600 text-white"
      : theme === "dark"
      ? "bg-indigo-500 text-white"
      : "bg-orange-500 text-white"; // coder theme

  return (
    <header className={`sticky top-0 z-20 backdrop-blur border-b ${bgClass}`}>
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="font-semibold text-lg">
          ✨ TaskManager
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-3 text-sm">
          <Link
            className={`px-3 py-1 rounded ${
              loc.pathname === "/home" ? linkActiveClass : ""
            }`}
            to="/home"
          >
            Home
          </Link>
          {!uid && (
            <Link className="px-3 py-1 rounded" to="/login">
              Login
            </Link>
          )}
          {!uid && (
            <Link
              className={`px-3 py-1 rounded ${buttonBgClass}`}
              to="/signup"
            >
              Sign up
            </Link>
          )}
          {uid && (
            <button
              onClick={logout}
              className="px-3 py-1 rounded bg-rose-600 text-white"
            >
              Logout
            </button>
          )}

          {/* Theme Selector */}
          <select
            value={theme}
            onChange={handleThemeChange}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            <option value="light">🌞 Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="coder">👨‍💻 Coder</option>
          </select>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className={`md:hidden px-4 pb-4 space-y-2 ${bgClass}`}>
          <Link
            className={`block px-3 py-2 rounded ${
              loc.pathname === "/home" ? linkActiveClass : ""
            }`}
            to="/home"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          {!uid && (
            <Link
              className="block px-3 py-2 rounded"
              to="/login"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
          {!uid && (
            <Link
              className={`block px-3 py-2 rounded ${buttonBgClass}`}
              to="/signup"
              onClick={() => setIsOpen(false)}
            >
              Sign up
            </Link>
          )}
          {uid && (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded bg-rose-600 text-white"
            >
              Logout
            </button>
          )}

          {/* Theme Selector */}
          <select
            value={theme}
            onChange={handleThemeChange}
            className="w-full px-2 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
          >
            <option value="light">🌞 Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="coder">👨‍💻 Coder</option>
          </select>
        </div>
      )}
    </header>
  );
}
