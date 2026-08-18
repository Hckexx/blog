import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function PrivatePage() {
  return (
    <main className="container-editorial min-h-screen flex flex-col items-center justify-center pt-16">
      {/* Lock icon */}
      <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mb-8">
        <Lock size={24} className="text-text-muted" />
      </div>

      {/* Main heading */}
      <p className="label-small mb-4">IBRAX / PRIVATE</p>
      
      <h1 className="font-display text-5xl md:text-7xl font-medium text-center leading-tight mb-6">
        Some entries<br />aren&apos;t public.
      </h1>

      <p className="text-text-muted text-center max-w-md mb-12">
        Access to the private journal is invitation-only. 
        If you have an invitation code, enter it below.
      </p>

      {/* Invitation code input */}
      <div className="w-full max-w-md mb-8">
        <label className="block text-sm text-text-muted mb-2">
          Invitation code
        </label>
        <input
          type="text"
          placeholder="IBRAX-XXXX-XXXX"
          className="w-full px-4 py-3 bg-surface border border-border rounded-md focus:outline-none focus:border-accent transition-colors font-mono text-sm"
        />
      </div>

      <button className="w-full max-w-md px-6 py-3 bg-accent text-background rounded-md font-medium hover:bg-accent-hover transition-colors mb-8">
        Enter Private Journal
      </button>

      {/* Divider */}
      <div className="hairline w-full max-w-md mb-8" />

      {/* Request access section */}
      <p className="text-text-muted text-center mb-4">
        Don&apos;t have an invitation?
      </p>
      
      <Link
        href="/private/request"
        className="text-accent hover:text-accent-hover transition-colors font-medium"
      >
        Request Access →
      </Link>
    </main>
  )
}