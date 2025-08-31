// src/pages/BTechPractice.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BTechPractice() {
  const navigate = useNavigate();
  const theme = localStorage.getItem('theme') || 'light';

  return (
    <div className={`min-h-screen py-4 px-4 ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-blue-50 to-blue-100' 
        : theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-900 to-gray-800'
    } ${theme === 'coder' ? 'font-mono' : ''}`}>
      
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-xl shadow-lg p-4 mb-4 ${
          theme === 'light' ? 'bg-white' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-900'
        }`}>
          <div className="flex items-center justify-between">
            <h1 className={`text-xl font-bold ${
              theme === 'light' ? 'text-blue-800' : theme === 'dark' ? 'text-blue-300' : 'text-green-400'
            }`}>
              BTech Coding Practice
            </h1>
            <button
              onClick={() => navigate('/home')}
              className={`px-4 py-2 rounded-lg ${
                theme === 'light' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : theme === 'dark' 
                  ? 'bg-blue-700 text-white hover:bg-blue-600' 
                  : 'bg-green-600 text-black hover:bg-green-500'
              }`}
            >
              Back to Home
            </button>
          </div>
        </div>

        <div className={`rounded-xl shadow-lg p-6 ${
          theme === 'light' ? 'bg-white' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-900'
        }`}>
          <h2 className={`text-lg font-semibold mb-4 ${
            theme === 'light' ? 'text-gray-800' : theme === 'dark' ? 'text-gray-200' : 'text-green-400'
          }`}>
            Coding Practice Platform
          </h2>
          <p className={theme === 'light' ? 'text-gray-600' : theme === 'dark' ? 'text-gray-400' : 'text-green-300'}>
            This section is under development. You'll be able to practice coding problems here soon!
          </p>
        </div>
      </div>
    </div>
  );
}