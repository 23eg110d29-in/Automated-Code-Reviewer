import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getApiErrorMessage } from '../utils/apiError'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      toast.success('Logged in')
      navigate('/dashboard')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="animate-fade-up w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm" style={{ color: 'rgba(180,185,220,0.5)' }}>Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="panel p-6 sm:p-8">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
              <input
                id="login-email"
                className="input"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
              <input
                id="login-password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button id="login-submit" className="btn-primary w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round"/></svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="divider" style={{ margin: '1.5rem 0' }} />

          <p className="text-center text-sm" style={{ color: 'rgba(180,185,220,0.5)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold transition-colors duration-200" style={{ color: '#818cf8' }}>
              Create one →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
