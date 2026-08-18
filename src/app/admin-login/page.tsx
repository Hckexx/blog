'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <p className="label-small mb-4">IBRAX / ADMIN</p>
          <h1 className="font-display text-4xl font-medium mb-2">Welcome back.</h1>
          <p className="text-text-muted text-sm">Sign in to manage your journal.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10 rounded-md text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-text-muted">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-border rounded-md focus:outline-none focus:border-accent transition-colors"
              placeholder="admin@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-text-muted">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-border rounded-md focus:outline-none focus:border-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-accent text-background rounded-md font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-text-muted">
          Protected area. Only for the site owner.
        </p>
      </div>
    </main>
  )
}