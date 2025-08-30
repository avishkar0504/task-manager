import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskItem from "../components/TaskItem";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Apply theme class to body
  useEffect(() => {
    document.body.classList.remove("light", "dark", "coder");
    document.body.classList.add(theme);
  }, [theme]);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const updatedTasks = [
      ...tasks,
      { id: Date.now(), text: newTask, completed: false },
    ];
    saveTasks(updatedTasks);
    setNewTask("");
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const themeClasses = {
    container: {
      light: "bg-gray-100 text-gray-900",
      dark: "bg-gray-900 text-gray-100",
      coder: "bg-gray-800 text-green-400 font-mono",
    },
    card: {
      light: "bg-white border border-gray-200",
      dark: "bg-gray-800 border border-gray-700",
      coder: "bg-gray-900 border border-green-600",
    },
    input: {
      light: "border border-gray-300 bg-white text-gray-900 focus:ring-sky-500",
      dark: "border border-gray-600 bg-gray-700 text-gray-100 focus:ring-sky-400",
      coder: "border border-green-600 bg-gray-900 text-green-400 font-mono focus:ring-green-400",
    },
    button: {
      light: "bg-blue-500 hover:bg-blue-600 text-white",
      dark: "bg-indigo-600 hover:bg-indigo-700 text-white",
      coder: "bg-green-600 hover:bg-green-700 text-black font-mono",
    },
    logoutBtn: {
      light: "bg-red-500 text-white",
      dark: "bg-red-600 text-white",
      coder: "bg-red-700 text-black font-mono",
    },
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center transition-colors duration-500 ${themeClasses.container[theme]}`}>
      <div className={`w-96 p-6 rounded-2xl shadow-lg transition-colors duration-500 ${themeClasses.card[theme]}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Hello, {user?.name} 👋</h2>
          <button
            onClick={logout}
            className={`px-3 py-1 rounded-xl ${themeClasses.logoutBtn[theme]}`}
          >
            Logout
          </button>
        </div>

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Enter new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className={`flex-1 px-4 py-2 rounded-l-xl focus:outline-none transition-colors duration-500 ${themeClasses.input[theme]}`}
          />
          <button
            onClick={addTask}
            className={`px-4 rounded-r-xl ${themeClasses.button[theme]} transition-colors duration-500`}
          >
            Add
          </button>
        </div>

        <div>
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500">No tasks yet!</p>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
                theme={theme} // pass theme to TaskItem
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
