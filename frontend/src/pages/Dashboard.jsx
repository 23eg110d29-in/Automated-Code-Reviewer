import React, { useState } from 'react'
import CodeEditor from '../components/CodeEditor'
import api from '../services/api'
import { toast } from 'react-toastify'

const languages = ['JavaScript', 'Python', 'Java', 'C', 'C++', 'TypeScript']
const starter = `function sumPrices(items) {
  let total = 0
  for (var i = 0; i < items.length; i++) {
    total += items[i].price
  }
  return total
}`

const sections = [
  { key: 'bugs',                   icon: '🐛', label: 'Bugs' },
  { key: 'securityIssues',         icon: '🔒', label: 'Security Issues' },
  { key: 'performanceSuggestions', icon: '⚡', label: 'Performance' },
  { key: 'codeSmells',            icon: '🧹', label: 'Code Smells' },
  { key: 'bestPractices',         icon: '✅', label: 'Best Practices' },
]

export default function Dashboard() {
  const [language, setLanguage] = useState('JavaScript')
  const [code, setCode]         = useState(starter)
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (!code.trim()) { toast.error('Paste code before submitting'); return }
    setLoading(true)
    try {
      const res = await api.post('/reviews/submit', { code, language })
      setResult(res.data)
      toast.success('Review completed')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed')
    } finally { setLoading(false) }
  }

  const scoreColor = (s) => {
    const n = parseInt(s) || 0
    if (n >= 80) return '#34d399'
    if (n >= 50) return '#fbbf24'
    return '#f87171'
  }

  return (
    <div className="animate-fade-up grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">

      {/* ── Left: Editor ─────────────────────────── */}
      <form onSubmit={submit} className="panel p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
              Code Review
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: 'rgba(180,185,220,0.6)' }}>
              Submit source code for AI-powered analysis with scoring, risks &amp; refactoring.
            </p>
          </div>
          <select
            id="language-select"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="input sm:w-44"
          >
            {languages.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        <CodeEditor value={code} onChange={setCode} />

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="badge">{language}</span>
          <button id="submit-review" disabled={loading} className="btn-primary">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round"/>
                </svg>
                Reviewing…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 5 5L20 7"/></svg>
                Submit for Review
              </span>
            )}
          </button>
        </div>
      </form>

      {/* ── Right: Results ────────────────────────── */}
      <aside className="space-y-5">
        <div className="panel p-5 sm:p-6">
          <h2 className="font-bold text-white flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Review Output
          </h2>

          {!result && (
            <div className="mt-5 flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <p className="text-sm" style={{ color: 'rgba(180,185,220,0.5)' }}>Results appear here after submission.</p>
            </div>
          )}

          {result && (
            <div className="mt-5 space-y-5">
              {/* Score */}
              <div className="flex items-center gap-4">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(${scoreColor(result.score)} ${(parseInt(result.score)||0)}%, rgba(255,255,255,0.06) 0%)`,
                    boxShadow: `0 0 25px ${scoreColor(result.score)}30`,
                  }}>
                  <div className="absolute flex h-14 w-14 items-center justify-center rounded-full" style={{ background: '#0a0a1a' }}>
                    <span className="text-xl font-bold text-white">{result.score}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium" style={{ color: 'rgba(180,185,220,0.5)' }}>Quality Score</div>
                  <div className="mt-0.5 text-sm font-semibold" style={{ color: scoreColor(result.score) }}>
                    {(parseInt(result.score)||0) >= 80 ? 'Excellent' : (parseInt(result.score)||0) >= 50 ? 'Needs Work' : 'Critical'}
                  </div>
                </div>
              </div>

              <div className="divider" />

              {/* Sections */}
              {sections.map(({ key, icon, label }) => {
                const items = result.reviewResult?.[key]
                const hasItems = items && items.length > 0
                return (
                  <section key={key}>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                      <span>{icon}</span> {label}
                      {hasItems && (
                        <span className="ml-auto rounded-full px-2 py-0.5 text-xs font-bold"
                          style={{ background: 'rgba(244,63,94,0.15)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.25)' }}>
                          {items.length}
                        </span>
                      )}
                    </h3>
                    <ul className="mt-2 space-y-1.5">
                      {(hasItems ? items : ['None reported']).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 rounded-lg px-3 py-2 text-sm"
                          style={{ background: hasItems ? 'rgba(244,63,94,0.05)' : 'rgba(52,211,153,0.05)', color: hasItems ? '#fca5a5' : '#6ee7b7' }}>
                          <span className="mt-0.5 text-xs">{hasItems ? '▸' : '✓'}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
          )}
        </div>

        {result?.reviewResult?.refactoredCode && (
          <div className="panel p-5 sm:p-6">
            <h2 className="font-bold text-white flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              Refactored Code
            </h2>
            <pre className="mt-4 max-h-96 overflow-auto p-4">{result.reviewResult.refactoredCode}</pre>
          </div>
        )}
      </aside>
    </div>
  )
}
