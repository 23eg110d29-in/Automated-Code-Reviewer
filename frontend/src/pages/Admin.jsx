import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../services/api'

const Stat = ({ label, value, icon, gradient }) => (
  <div className="panel p-5 group">
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: gradient, boxShadow: `0 4px 15px ${gradient.includes('#6366f1') ? 'rgba(99,102,241,0.35)' : gradient.includes('#8b5cf6') ? 'rgba(139,92,246,0.35)' : 'rgba(6,182,212,0.35)'}` }}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs font-medium" style={{ color: 'rgba(180,185,220,0.5)' }}>{label}</div>
        <div className="mt-0.5 text-2xl font-bold text-white">{value}</div>
      </div>
    </div>
  </div>
)

export default function Admin() {
  const [stats, setStats]     = useState(null)
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

  if (loading) return (
    <div className="panel flex items-center justify-center gap-3 p-8">
      <svg className="h-5 w-5 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round"/></svg>
      <span className="text-sm" style={{ color: 'rgba(180,185,220,0.5)' }}>Loading analytics…</span>
    </div>
  )

  if (!stats) return (
    <div className="panel flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-sm" style={{ color: 'rgba(180,185,220,0.5)' }}>Analytics unavailable.</p>
    </div>
  )

  const maxCount = Math.max(1, ...((stats.reviewsLast7Days || []).map(d => d.count)))

  return (
    <div className="animate-fade-up space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
          </svg>
          Admin Analytics
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: 'rgba(180,185,220,0.5)' }}>Usage, language mix, and recent review volume.</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Stat
          label="Total Users"
          value={stats.totalUsers}
          gradient="linear-gradient(135deg,#6366f1,#818cf8)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <Stat
          label="Total Reviews"
          value={stats.totalReviews}
          gradient="linear-gradient(135deg,#8b5cf6,#c084fc)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
        />
        <Stat
          label="Most Reviewed"
          value={stats.mostReviewed?._id || 'None'}
          gradient="linear-gradient(135deg,#06b6d4,#38bdf8)"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Language breakdown */}
        <section className="panel p-5 sm:p-6">
          <h2 className="font-bold text-white flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Reviews By Language
          </h2>
          <div className="mt-5 space-y-4">
            {(stats.byLanguage || []).map((item, i) => {
              const pct = Math.min(100, (item.count / Math.max(1, stats.totalReviews)) * 100)
              const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#10b981']
              const c = colors[i % colors.length]
              return (
                <div key={item._id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-white">{item._id}</span>
                    <span className="text-xs" style={{ color: 'rgba(180,185,220,0.5)' }}>
                      {item.count} reviews · avg {Math.round(item.averageScore || 0)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg,${c},${c}aa)`, boxShadow: `0 0 10px ${c}40` }}
                    />
                  </div>
                </div>
              )
            })}
            {stats.byLanguage?.length === 0 && (
              <p className="text-sm" style={{ color: 'rgba(180,185,220,0.4)' }}>No review data yet.</p>
            )}
          </div>
        </section>

        {/* Last 7 days */}
        <section className="panel p-5 sm:p-6">
          <h2 className="font-bold text-white flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Last 7 Days
          </h2>
          <div className="mt-5 flex items-end gap-3" style={{ height: '140px' }}>
            {(stats.reviewsLast7Days || []).map(day => {
              const h = Math.max(12, (day.count / maxCount) * 120)
              return (
                <div key={day._id} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-white">{day.count}</span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${h}px`,
                      background: 'linear-gradient(180deg,#6366f1,#8b5cf6)',
                      boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                    }}
                  />
                  <span className="truncate text-xs" style={{ color: 'rgba(180,185,220,0.45)' }}>
                    {day._id.slice(5)}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
