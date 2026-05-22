import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../services/api'

const Stat = ({ label, value }) => (
  <div className="panel p-5">
    <div className="text-sm text-slate-500">{label}</div>
    <div className="mt-2 text-3xl font-bold text-slate-950">{value}</div>
  </div>
)

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/reviews/admin/stats')
        setStats(res.data)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Unable to load analytics')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="panel p-5 text-sm text-slate-600">Loading analytics...</div>
  if (!stats) return <div className="panel p-5 text-sm text-slate-600">Analytics unavailable.</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Usage, language mix, and recent review volume.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Total users" value={stats.totalUsers} />
        <Stat label="Total reviews" value={stats.totalReviews} />
        <Stat label="Most reviewed language" value={stats.mostReviewed?._id || 'None'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel p-5">
          <h2 className="font-bold">Reviews By Language</h2>
          <div className="mt-4 space-y-3">
            {(stats.byLanguage || []).map(item => (
              <div key={item._id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{item._id}</span>
                  <span>{item.count} reviews, avg {Math.round(item.averageScore || 0)}</span>
                </div>
                <div className="h-2 bg-slate-100">
                  <div className="h-2 bg-cyan-700" style={{ width: `${Math.min(100, (item.count / Math.max(1, stats.totalReviews)) * 100)}%` }} />
                </div>
              </div>
            ))}
            {stats.byLanguage?.length === 0 && <p className="text-sm text-slate-500">No review data yet.</p>}
          </div>
        </section>

        <section className="panel p-5">
          <h2 className="font-bold">Last 7 Days</h2>
          <div className="mt-4 grid grid-cols-7 items-end gap-2">
            {(stats.reviewsLast7Days || []).map(day => (
              <div key={day._id} className="text-center">
                <div className="mx-auto w-full bg-teal-600" style={{ height: `${Math.max(12, day.count * 18)}px` }} />
                <div className="mt-2 truncate text-xs text-slate-500">{day._id.slice(5)}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
