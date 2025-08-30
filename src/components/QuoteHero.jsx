import React from 'react'

export default function QuoteHero() {
  return (
    <section
      className="w-full"
      style={{
        background: `linear-gradient(135deg, var(--bg-color) 0%, var(--highlight-color) 100%)`
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: 'var(--text-color)' }}
          >
            Organize today,{' '}
            <span style={{ color: 'var(--accent-color)' }}>own</span> tomorrow.
          </h1>
          <p
            className="mt-4 max-w-prose"
            style={{ color: 'var(--text-color)' }}
          >
            Minimalist task scheduling with daily, weekly, and monthly check-ins.
            Focus on what matters and watch your streaks grow.
          </p>
        </div>

        <div
          className="container-card backdrop-blur border transition-all"
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderColor: 'rgba(255,255,255,0.2)',
            color: 'var(--text-color)'
          }}
        >
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span
                className="badge"
                style={{ backgroundColor: 'var(--highlight-color)', color: 'var(--text-color)' }}
              >
                Daily
              </span>{' '}
              Repeat tiny wins.
            </li>
            <li className="flex items-center gap-2">
              <span
                className="badge"
                style={{ backgroundColor: 'var(--accent-color)', color: 'var(--text-color)' }}
              >
                Weekly
              </span>{' '}
              Plan rhythms.
            </li>
            <li className="flex items-center gap-2">
              <span
                className="badge"
                style={{ backgroundColor: 'var(--highlight-color)', color: 'var(--text-color)' }}
              >
                Monthly
              </span>{' '}
              Track milestones.
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
