import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="site-footer"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(5,5,16,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">

          {/* Brand */}
          <Link to="/" id="footer-logo" className="flex items-center gap-2.5 group select-none">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">
              Automated{' '}
              <span style={{
                background: 'linear-gradient(135deg,#818cf8,#c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Code Reviewer</span>
            </span>
          </Link>

          {/* Designer credit — prominent centre piece */}
          <div
            id="designer-credit"
            className="flex items-center gap-3 rounded-2xl px-5 py-2.5"
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.25)',
              boxShadow: '0 0 20px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Animated sparkle icon */}
            <span className="animate-float text-base select-none">✦</span>

            <p className="text-xs font-medium text-slate-300">
              Designed &amp; Developed by{' '}
              <span
                className="font-bold"
                style={{
                  background: 'linear-gradient(135deg,#818cf8 0%,#c084fc 50%,#38bdf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '0.85rem',
                }}
              >
                KammariSahasra
              </span>
            </p>

            <span className="animate-float text-base select-none" style={{ animationDelay: '1s' }}>✦</span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-slate-500 text-center sm:text-right">
            © {year} Automated Code Reviewer.
            <br className="hidden sm:block" />
            All rights reserved.
          </p>

        </div>

        {/* Divider */}
        <div className="divider mt-6 mb-0" />

        {/* Bottom tagline */}
        <p className="mt-4 text-center text-xs" style={{ color: 'rgba(180,185,220,0.35)' }}>
          AI-powered code analysis · Built with ❤️ by KammariSahasra
        </p>
      </div>
    </footer>
  )
}
