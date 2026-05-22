import React from 'react'

export default function CodeEditor({ value, onChange }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-4 px-4 py-2.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}
      >
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ background: '#f87171' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#fbbf24' }} />
          <span className="h-3 w-3 rounded-full" style={{ background: '#34d399' }} />
        </div>
        <span className="text-xs" style={{ color: 'rgba(180,185,220,0.35)' }}>source.code</span>
      </div>

      {/* Editor */}
      <textarea
        id="code-editor"
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={14}
        spellCheck="false"
        className="w-full resize-none bg-transparent px-4 py-4 text-sm leading-6 outline-none"
        style={{
          fontFamily: "'Fira Code', 'Cascadia Code', ui-monospace, monospace",
          color: '#a5f3c8',
          caretColor: '#818cf8',
        }}
      />

      {/* Line count badge */}
      <div
        className="absolute bottom-2 right-3 rounded-md px-2 py-0.5 text-xs"
        style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}
      >
        {value.split('\n').length} lines
      </div>
    </div>
  )
}
