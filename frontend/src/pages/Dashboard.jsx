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

export default function Dashboard() {
  const [language, setLanguage] = useState('JavaScript')
  const [code, setCode] = useState(starter)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    if (!code.trim()) {
      toast.error('Paste code before submitting')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/reviews/submit', { code, language })
      setResult(res.data)
      toast.success('Review completed')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form onSubmit={submit} className="panel p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Code Review</h1>
            <p className="mt-1 text-sm text-slate-500">Submit source code for an AI review with scoring, risks, and refactoring.</p>
          </div>
          <select value={language} onChange={e=>setLanguage(e.target.value)} className="input sm:w-44">
            {languages.map(item => <option key={item}>{item}</option>)}
          </select>
        </div>
        <CodeEditor value={code} onChange={setCode} />
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm text-slate-500">{language}</span>
          <button disabled={loading} className="btn-primary">{loading? 'Reviewing...' : 'Submit for Review'}</button>
        </div>
      </form>

      <aside className="space-y-4">
        <div className="panel p-5">
          <h2 className="font-bold">Review Output</h2>
          {!result && <p className="mt-3 text-sm leading-6 text-slate-600">Results appear here after submission.</p>}
          {result && (
            <div className="mt-4 space-y-4">
              <div>
                <div className="text-sm text-slate-500">Quality score</div>
                <div className="mt-1 text-4xl font-bold text-cyan-800">{result.score}</div>
              </div>
              {['bugs', 'securityIssues', 'performanceSuggestions', 'codeSmells', 'bestPractices'].map(key => (
                <section key={key}>
                  <h3 className="text-sm font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {(result.reviewResult?.[key]?.length ? result.reviewResult[key] : ['None reported']).map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
        {result?.reviewResult?.refactoredCode && (
          <div className="panel p-5">
            <h2 className="font-bold">Refactored Code</h2>
            <pre className="mt-3 max-h-96 overflow-auto bg-slate-950 p-3 text-xs text-emerald-100">{result.reviewResult.refactoredCode}</pre>
          </div>
        )}
      </aside>
    </div>
  )
}
