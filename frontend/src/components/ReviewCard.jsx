import React, { useState } from 'react'

export default function ReviewCard({ review, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const r = review.reviewResult || {}
  const score = review.score ?? '–'

  const scoreColor = (s) => {
    const n = parseInt(s) || 0
    if (n >= 80) return '#34d399'
    if (n >= 50) return '#fbbf24'
    return '#f87171'
  }

  const issueCount =
    (r.bugs?.length || 0) +
    (r.securityIssues?.length || 0) +
    (r.performanceSuggestions?.length || 0) +
    (r.codeSmells?.length || 0)

  return (
    <div className="panel p-5 transition-all duration-300 animate-fade-up" style={{ animationDelay: '0.05s' }}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Score badge */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ background: `${scoreColor(score)}20`, border: `1px solid ${scoreColor(score)}40`, color: scoreColor(score) }}
          >
            {score}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="badge">{review.language}</span>
              {issueCount > 0 && (
                <span className="rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{ background: 'rgba(244,63,94,0.15)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.25)' }}>
                  {issueCount} issue{issueCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="mt-1 truncate text-xs" style={{ color: 'rgba(180,185,220,0.4)' }}>
              {new Date(review.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(v => !v)}
            className="rounded-lg p-2 transition-all duration-200 hover:bg-white/5"
            style={{ color: '#818cf8' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(review._id)}
              className="rounded-lg p-2 text-rose-400/60 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-400"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-4 space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
          {/* Source code */}
          <div>
            <h4 className="mb-2 text-xs font-semibold" style={{ color: 'rgba(180,185,220,0.5)' }}>Source Code</h4>
            <pre className="max-h-48 overflow-auto rounded-xl p-3">{review.code}</pre>
          </div>

          {/* Review sections */}
          {['bugs','securityIssues','performanceSuggestions','codeSmells','bestPractices'].map(key => {
            const items = r[key]
            if (!items || items.length === 0) return null
            return (
              <div key={key}>
                <h4 className="mb-1.5 text-xs font-semibold capitalize" style={{ color: 'rgba(180,185,220,0.5)' }}>
                  {key.replace(/([A-Z])/g, ' $1')}
                </h4>
                <ul className="space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="rounded-lg px-3 py-2 text-sm"
                      style={{ background: 'rgba(244,63,94,0.05)', color: '#fca5a5' }}>
                      ▸ {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}

          {/* Refactored */}
          {r.refactoredCode && (
            <div>
              <h4 className="mb-2 text-xs font-semibold" style={{ color: 'rgba(180,185,220,0.5)' }}>Refactored Code</h4>
              <pre className="max-h-48 overflow-auto rounded-xl p-3">{r.refactoredCode}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
