import React, { useEffect, useState } from 'react'
import api from '../services/api'
import ReviewCard from '../components/ReviewCard'
import { toast } from 'react-toastify'

export default function History() {
  const [reviews, setReviews] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await api.get('/reviews', { params: { q } })
      setReviews(res.data)
    } catch (err) { toast.error('Fetch failed') }
    finally { setLoading(false) }
  }

  useEffect(()=>{ fetch() }, [])

  const del = async (id) => {
    try {
      await api.delete(`/reviews/${id}`)
      setReviews(prev => prev.filter(r=>r._id !== id))
      toast.success('Deleted')
    } catch (err) { toast.error('Delete failed') }
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input className="input flex-1" placeholder="Search language, source, or explanation" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetch()} />
        <button onClick={fetch} className="btn-primary">Search</button>
      </div>
      {loading && <div className="panel p-5 text-sm text-slate-600">Loading reviews...</div>}
      {!loading && reviews.length === 0 && <div className="panel p-5 text-sm text-slate-600">No reviews found.</div>}
      {reviews.map(r=> <ReviewCard key={r._id} review={r} onDelete={del} />)}
    </div>
  )
}
