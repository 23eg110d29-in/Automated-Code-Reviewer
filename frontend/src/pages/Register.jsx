import React, { useState } from 'react'
import api from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getApiErrorMessage } from '../utils/apiError'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
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
    <div className="mx-auto mt-10 max-w-md panel p-6">
      <h1 className="text-2xl font-bold">Create account</h1>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" className="input" placeholder="Password" minLength="6" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
      </form>
      <div className="mt-4 text-sm text-slate-600">Already registered? <Link to="/login" className="font-semibold text-cyan-700">Login</Link></div>
    </div>
  )
}
