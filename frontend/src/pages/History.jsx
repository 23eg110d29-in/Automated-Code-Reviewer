import React, { useEffect, useState } from 'react'
import api from '../services/api'
import ReviewCard from '../components/ReviewCard'
import { toast } from 'react-toastify'

export default function History() {
  const [reviews, setReviews] = useState([])
  const [q, setQ]             = useState('')
  const [loading, setLoading] = useState(true)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await api.get('/reviews', { params: { q } })
      setReviews(res.data)
    } catch (err) { toast.error('Fetch failed') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchReviews() }, [])

  const del = async (id) => {
    try {
      await api.delete(`/reviews/${id}`)
      setReviews(prev => prev.filter(r => r._id !== id))
      toast.success('Deleted')
    } catch (err) { toast.error('Delete failed') }
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Review History
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: 'rgba(180,185,220,0.5)' }}>Browse and search your past code reviews.</p>
      </div>

      {/* Search */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(180,185,220,0.4)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="history-search"
            className="input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search language, source, or explanation…"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchReviews()}
          />
        </div>
        <button id="history-search-btn" onClick={fetchReviews} className="btn-primary">
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Search
          </span>
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="panel flex items-center justify-center gap-3 p-8">
          <svg className="h-5 w-5 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round"/></svg>
          <span className="text-sm" style={{ color: 'rgba(180,185,220,0.5)' }}>Loading reviews…</span>
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="panel flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <p className="text-sm" style={{ color: 'rgba(180,185,220,0.5)' }}>No reviews found. Submit code for a review first!</p>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {reviews.map(r => <ReviewCard key={r._id} review={r} onDelete={del} />)}
      </div>
    </div>
  )
}
