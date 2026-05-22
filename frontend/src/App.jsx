import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Admin from './pages/Admin'
import Navbar from './components/Navbar'

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

const RequireAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.isAdmin ? children : <Navigate to="/dashboard" />
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><RequireAdmin><Admin /></RequireAdmin></RequireAuth>} />
        </Routes>
      </main>
    </div>
  )
}
