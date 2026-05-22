import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate  = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const token = localStorage.getItem('token')
  const user  = JSON.parse(localStorage.getItem('user') || '{}')

  const linkClass = ({ isActive }) =>
    isActive
      ? 'relative text-indigo-400 font-semibold after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-px after:bg-indigo-400'
      : 'text-slate-400 hover:text-white transition-colors duration-200'

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(5,5,16,0.85)'
          : 'rgba(5,5,16,0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" id="nav-logo" className="flex items-center gap-2.5 group select-none">
          {/* Icon */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              boxShadow: '0 4px 15px rgba(99,102,241,0.5)',
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa)', boxShadow: '0 0 20px rgba(99,102,241,0.6)' }} />
          </div>

          <div>
            <span className="text-base font-bold tracking-tight text-white">
              Automated{' '}
              <span style={{
                background: 'linear-gradient(135deg,#818cf8,#c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Code Reviewer</span>
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          {token ? (
            <>
              <NavLink id="nav-dashboard" to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink id="nav-history"   to="/history"   className={linkClass}>History</NavLink>
              {user.isAdmin && <NavLink id="nav-admin" to="/admin" className={linkClass}>Admin</NavLink>}

              <div className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />

              {user.name && (
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                    {user.name[0].toUpperCase()}
                  </span>
                  {user.name}
                </span>
              )}

              <button id="nav-logout" onClick={logout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-400 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-300">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink id="nav-login"    to="/login"    className={linkClass}>Login</NavLink>
              <NavLink id="nav-register" to="/register" className={linkClass}>
                <span className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}>
                  Get Started
                </span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          id="nav-mobile-toggle"
          className="sm:hidden p-2 text-slate-400 hover:text-white"
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t px-4 py-4 space-y-3 text-sm"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(5,5,16,0.95)' }}>
          {token ? (
            <>
              <NavLink to="/dashboard" className="block text-slate-300 hover:text-white" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
              <NavLink to="/history"   className="block text-slate-300 hover:text-white" onClick={() => setMenuOpen(false)}>History</NavLink>
              {user.isAdmin && <NavLink to="/admin" className="block text-slate-300 hover:text-white" onClick={() => setMenuOpen(false)}>Admin</NavLink>}
              <button onClick={() => { logout(); setMenuOpen(false) }} className="block text-rose-400 hover:text-rose-300">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login"    className="block text-slate-300 hover:text-white" onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className="block text-slate-300 hover:text-white" onClick={() => setMenuOpen(false)}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  )
}
