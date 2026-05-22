import React from 'react'

export default function CodeEditor({ value, onChange }) {
  return (
    <div className="overflow-hidden border border-slate-800 bg-slate-950">
      <div className="flex h-9 items-center justify-between border-b border-slate-800 px-3 text-xs text-slate-400">
        <span>source</span>
        <span>{value.length.toLocaleString()} chars</span>
      </div>
      <textarea
        className="h-[520px] w-full resize-none bg-slate-950 p-4 font-mono text-sm leading-6 text-emerald-100 outline-none placeholder:text-slate-500"
        placeholder="Paste source code here..."
        spellCheck="false"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
