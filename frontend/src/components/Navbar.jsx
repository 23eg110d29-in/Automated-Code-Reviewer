import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const linkClass = ({ isActive }) => isActive ? 'text-cyan-700 font-semibold' : 'text-slate-600 hover:text-slate-950'

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-bold tracking-tight text-slate-950">Automated Code Reviewer</Link>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {token ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/history" className={linkClass}>History</NavLink>
              {user.isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
              <span className="hidden text-slate-400 sm:inline">{user.name}</span>
              <button onClick={logout} className="font-semibold text-rose-600 hover:text-rose-700">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/register" className={linkClass}>Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
