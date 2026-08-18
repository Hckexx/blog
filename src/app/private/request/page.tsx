'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

export default function RequestAccessPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    howTheyKnowYou: '',
    reason: '',
    additionalInfo: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/private/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="container-editorial min-h-screen flex flex-col items-center justify-center pt-16">
        <div className="w-16 h-16 rounded-full border border-accent flex items-center justify-center mb-8">
          <span className="text-accent text-2xl">✓</span>
        </div>
        
        <h1 className="font-display text-4xl md:text-5xl font-medium text-center mb-4">
          Request received.
        </h1>
        
        <p className="text-text-muted text-center max-w-md mb-8">
          Your request is waiting for approval. If approved, 
          you&apos;ll receive a unique invitation at your email address.
        </p>

        <Link
          href="/private"
          className="text-accent hover:text-accent-hover transition-colors"
        >
          ← Back to Private
        </Link>
      </main>
    )
  }

  return (
    <main className="container-editorial min-h-screen py-24 flex flex-col items-center">
  <div className="w-full max-w-2xl">
    <Link
      href="/private"
      className="inline-flex items-center gap-2 text-text-muted hover:text-text transition-colors mb-12"
    >
      <ArrowLeft size={16} />
      Back
    </Link>
  </div>

  <div className="w-full max-w-2xl">
        <p className="label-small mb-4">IBRAX / PRIVATE ACCESS</p>
        
        <h1 className="font-display text-4xl md:text-6xl font-medium leading-tight mb-6">
          Request access to the private journal.
        </h1>

        <p className="text-text-muted mb-12">
          Private entries are shared with a small circle of people I trust. 
          Tell me a bit about yourself and why you&apos;d like access.
        </p>

        {error && (
          <div className="mb-8 p-4 border border-red-500/30 bg-red-500/10 rounded-md text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-text-muted">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-surface border border-border rounded-md focus:outline-none focus:border-accent transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-text-muted">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-surface border border-border rounded-md focus:outline-none focus:border-accent transition-colors"
              placeholder="you@email.com"
            />
            <p className="mt-2 text-xs text-text-muted">
              Where should we send your invitation? Your email is required because, 
              if your request is approved, a unique IBRAX invitation will be sent 
              to this address. The invitation is tied to this email and can only be used once.
            </p>
          </div>

          <div>
            <label className="block text-sm mb-2 text-text-muted">
              How do you know me?
            </label>
            <input
              type="text"
              required
              value={formData.howTheyKnowYou}
              onChange={(e) => setFormData({ ...formData, howTheyKnowYou: e.target.value })}
              className="w-full px-4 py-3 bg-surface border border-border rounded-md focus:outline-none focus:border-accent transition-colors"
              placeholder="College, mutual friend, online..."
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-text-muted">
              Why would you like access?
            </label>
            <textarea
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-surface border border-border rounded-md focus:outline-none focus:border-accent transition-colors resize-none"
              placeholder="Tell me a bit about why you're interested..."
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-text-muted">
              Additional information (optional)
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-surface border border-border rounded-md focus:outline-none focus:border-accent transition-colors resize-none"
              placeholder="Anything else I should know?"
            />
          </div>

          <p className="text-xs text-text-muted">
            Your information is used only for private-access management.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-accent text-background rounded-md font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </main>
  )
}