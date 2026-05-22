import React, { useState } from 'react'
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getApiErrorMessage } from '../utils/apiError'

export default function Register() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      toast.success('Registered')
      navigate('/dashboard')
    } catch (err) {
      const message = getApiErrorMessage(err, 'Register failed')
      toast.error(message)
      if (err.response?.status === 409) {
        setTimeout(() => navigate('/login'), 1500)
      }
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
              background: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
              boxShadow: '0 8px 30px rgba(139,92,246,0.4)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="mt-2 text-sm" style={{ color: 'rgba(180,185,220,0.5)' }}>Join to start reviewing your code with AI</p>
        </div>

        {/* Card */}
        <div className="panel p-6 sm:p-8">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Name</label>
              <input id="register-name" className="input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
              <input id="register-email" className="input" placeholder="you@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
              <input id="register-password" type="password" className="input" placeholder="Min 6 characters" minLength="6" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button id="register-submit" className="btn-primary w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round"/></svg>
                  Creating…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="divider" style={{ margin: '1.5rem 0' }} />

          <p className="text-center text-sm" style={{ color: 'rgba(180,185,220,0.5)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-colors duration-200" style={{ color: '#818cf8' }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
