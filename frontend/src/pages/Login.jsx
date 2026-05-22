import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getApiErrorMessage } from '../utils/apiError'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
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
    <div className="mx-auto mt-10 max-w-md panel p-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
      </form>
      <div className="mt-4 text-sm text-slate-600">No account? <Link to="/register" className="font-semibold text-cyan-700">Register</Link></div>
    </div>
  )
}
