import React from 'react'

export default function ReviewCard({ review, onDelete }) {
  const result = review.reviewResult || {}
  const list = (items) => Array.isArray(items) && items.length ? items.join(' | ') : 'None reported'

  return (
    <article className="panel mb-4 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">{review.language}</span>
            <span className="bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-800">Score {review.score}</span>
          </div>
          <div className="mt-1 text-sm text-slate-500">{new Date(review.createdAt).toLocaleString()}</div>
        </div>
        <button onClick={() => onDelete(review._id)} className="btn-secondary text-rose-700">Delete</button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <p className="text-sm"><span className="font-semibold">Bugs:</span> {list(result.bugs)}</p>
        <p className="text-sm"><span className="font-semibold">Security:</span> {list(result.securityIssues)}</p>
        <p className="text-sm"><span className="font-semibold">Performance:</span> {list(result.performanceSuggestions)}</p>
        <p className="text-sm"><span className="font-semibold">Best practices:</span> {list(result.bestPractices)}</p>
      </div>
      {result.refactoredCode && (
        <pre className="mt-4 max-h-72 overflow-auto bg-slate-950 p-3 text-xs text-emerald-100">{result.refactoredCode}</pre>
      )}
      {result.explanation && <p className="mt-4 text-sm leading-6 text-slate-700">{result.explanation}</p>}
    </article>
  )
}
