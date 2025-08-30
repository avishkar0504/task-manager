import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Navbar from './components/Navbar'

const Protected = ({ children }) => {
  const uid = localStorage.getItem('uid')
  return uid ? children : <Navigate to="/login" />
}

export default function App() {
  // Theme state: 'light' | 'dark' | 'coder'
  const [theme, setTheme] = useState('light')

  // On load, get theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) setTheme(storedTheme)
  }, [])

  // Apply theme class to html
  useEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-coder')
    document.documentElement.classList.add(`theme-${theme}`)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar theme={theme} setTheme={setTheme} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Protected><Home /></Protected>} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  )
}
