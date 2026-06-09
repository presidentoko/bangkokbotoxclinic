'use client'
import { useState, type KeyboardEvent } from 'react'

interface Props {
  placeholder: string
  icon: string
  onSearch: (q: string) => void
  accentColor?: 'orange' | 'blue'
}

export default function SearchBar({ placeholder, icon, onSearch, accentColor = 'orange' }: Props) {
  const [value, setValue] = useState('')

  const ring = accentColor === 'orange'
    ? 'focus-within:ring-2 focus-within:ring-orange-400'
    : 'focus-within:ring-2 focus-within:ring-blue-400'

  const btn = accentColor === 'orange'
    ? 'bg-orange-500 hover:bg-orange-600'
    : 'bg-blue-500 hover:bg-blue-600'

  const submit = () => { if (value.trim()) onSearch(value.trim()) }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <div className={`flex items-center bg-white rounded-2xl shadow-sm border border-gray-200 px-4 py-3 gap-3 transition-all ${ring}`}>
      <span className="text-xl">{icon}</span>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        className="flex-1 outline-none text-gray-800 placeholder-gray-400 bg-transparent text-sm"
      />
      <button
        onClick={submit}
        className={`${btn} text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors`}
      >
        ค้นหา
      </button>
    </div>
  )
}
