'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-surface-hover transition-colors duration-200"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-text-muted hover:text-text transition-colors" />
      ) : (
        <Moon size={18} className="text-text-muted hover:text-text transition-colors" />
      )}
    </button>
  )
}