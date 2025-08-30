import React from 'react'

export default function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl shadow mb-2 transition-all"
      style={{
        backgroundColor: 'var(--bg-color)',
        color: task.completed ? 'var(--highlight-color)' : 'var(--text-color)',
        textDecoration: task.completed ? 'line-through' : 'none'
      }}
    >
      <div onClick={() => toggleTask(task.id)} className="cursor-pointer flex-1">
        {task.text}
      </div>
      <button
        onClick={() => deleteTask(task.id)}
        className="px-2 py-1 rounded transition-all"
        style={{
          backgroundColor: 'var(--accent-color)',
          color: 'var(--text-color)'
        }}
      >
        Delete
      </button>
    </div>
  )
}
