'use client'
import { useTheme } from '../context/ThemeContext'

export default function Header({ count }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex justify-between items-center mb-6">
      
      {/* LEFT */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        📄 Ghi Chú Cá Nhân
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <span className="bg-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-sm">
          {count} ghi chú
        </span>

        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full 
          bg-white/10 border border-white/20 backdrop-blur"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>

    </div>
  )
}