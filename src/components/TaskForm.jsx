import React, { useState } from 'react'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function TaskForm({ uid }) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [recurrence, setRecurrence] = useState([])

  const toggleRecurrence = (value) => {
    setRecurrence(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await addDoc(collection(db, 'users', uid, 'tasks'), {
        title: title.trim(),
        notes: notes.trim(),
        recurrence,
        completions: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      setTitle('')
      setNotes('')
      setRecurrence([])
    } catch (e) {
      alert('Failed to add task: ' + e.message)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="container-card"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
    >
      <h3 className="text-lg font-semibold mb-3">Add Task</h3>
      <div className="grid gap-3">
        <input
          className="input"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-color)',
            borderColor: 'var(--highlight-color)'
          }}
        />
        <textarea
          className="input h-24"
          placeholder="Notes (optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-color)',
            borderColor: 'var(--highlight-color)'
          }}
        />
        <div className="flex flex-wrap items-center gap-3">
          {['daily', 'weekly', 'monthly'].map(v => (
            <label
              key={v}
              className={`px-3 py-1 rounded-full border cursor-pointer transition-all`}
              style={{
                backgroundColor: recurrence.includes(v) ? 'var(--accent-color)' : 'var(--bg-color)',
                color: recurrence.includes(v) ? 'var(--text-color)' : 'var(--text-color)',
                borderColor: recurrence.includes(v) ? 'var(--accent-color)' : 'var(--highlight-color)'
              }}
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={recurrence.includes(v)}
                onChange={() => toggleRecurrence(v)}
              />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </label>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'var(--text-color)'
            }}
          >
            Add Task
          </button>
        </div>
      </div>
    </form>
  )
}
