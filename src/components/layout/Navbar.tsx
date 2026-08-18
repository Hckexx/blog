'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Lock } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { NAV_ITEMS } from '@/lib/constants'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="container-editorial flex items-center justify-between h-16">
        {/* Logo */}
        <Link 
          href="/" 
          className="font-display text-xl font-medium tracking-tight hover:text-accent transition-colors"
        >
          IBRAX <span className="text-text-muted">/</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-sm text-text-muted hover:text-text transition-colors"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          
          <Link
            href="/private"
            className="group relative text-sm text-text-muted hover:text-text transition-colors flex items-center gap-1"
          >
            <Lock size={14} />
            Private
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* Right side - Theme toggle + Mobile menu button */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-surface-hover transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={20} className="text-text" />
            ) : (
              <Menu size={20} className="text-text" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-editorial py-4 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg text-text-muted hover:text-text transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            <Link
              href="/private"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg text-text-muted hover:text-text transition-colors flex items-center gap-2"
            >
              <Lock size={16} />
              Private
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}