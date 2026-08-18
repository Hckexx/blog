import Link from 'next/link'
import { NAV_ITEMS, SITE } from '@/lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-section">
      <div className="container-editorial py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          {/* Brand */}
          <div>
            <Link 
              href="/" 
              className="font-display text-2xl font-medium hover:text-accent transition-colors"
            >
              {SITE.name} <span className="text-text-muted">/</span>
            </Link>
            <p className="mt-2 text-sm text-text-muted">
              {SITE.tagline}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-text-muted hover:text-text transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-sm text-text-muted">
            <p>© {currentYear} {SITE.name} Journal</p>
            <p className="mt-1 font-mono text-xs">Built with Next.js & Supabase</p>
          </div>

        </div>
      </div>
    </footer>
  )
}