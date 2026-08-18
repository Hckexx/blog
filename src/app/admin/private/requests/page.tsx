'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AccessRequest {
  id: string
  name: string
  email: string
  how_they_know_you: string
  reason: string
  additional_info: string | null
  status: string
  created_at: string
}

export default function AdminRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvitation, setShowInvitation] = useState<{
    name: string
    email: string
    code: string
  } | null>(null)
  const [error, setError] = useState('')

  // Fetch requests on mount
  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/admin/requests')
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (err) {
      console.error('Error fetching requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId: string) => {
    try {
      const response = await fetch('/api/admin/approve-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, accessLevel: 'private' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve')
      }

      // Show the invitation modal
      setShowInvitation({
        name: data.invitation.name,
        email: data.invitation.email,
        code: data.invitation.code,
      })

      // Refresh the list
      fetchRequests()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

    const handleDeny = async (requestId: string) => {
  try {
    const response = await fetch('/api/admin/deny-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId }),
    })

    if (!response.ok) {
      throw new Error('Failed to deny')
    }

    fetchRequests()
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Something went wrong')
  }
}

const handleBlacklist = async (requestId: string) => {
  if (!confirm('Blacklist this email? They will not be able to request access again.')) {
    return
  }

  try {
    const response = await fetch('/api/admin/blacklist-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId }),
    })

    if (!response.ok) {
      throw new Error('Failed to blacklist')
    }

    fetchRequests()
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Something went wrong')
  }
}

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  if (showInvitation) {
    return (
      <main className="py-12">
        <div className="max-w-2xl mx-auto">
          <div className="border border-accent/30 rounded-md p-8 mb-6">
            <p className="label-small mb-4 text-accent">ACCESS APPROVED</p>
            
            <h1 className="font-display text-3xl font-medium mb-6">
              {showInvitation.name} has been approved.
            </h1>

            <div className="space-y-4 mb-8">
              <div>
                <p className="text-sm text-text-muted mb-1">Email</p>
                <p className="text-sm">{showInvitation.email}</p>
              </div>

              <div>
                <p className="text-sm text-text-muted mb-1">Invitation Code</p>
                <p className="font-mono text-lg bg-surface border border-border rounded-md px-4 py-2">
                  {showInvitation.code}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-muted mb-1">Access Level</p>
                <p className="text-sm">Private</p>
              </div>

              <div>
                <p className="text-sm text-text-muted mb-1">Invitation Status</p>
                <p className="text-sm">Generated</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => copyToClipboard(showInvitation.code)}
                className="px-6 py-3 bg-accent text-background rounded-md font-medium hover:bg-accent-hover transition-colors"
              >
                Copy Invitation
              </button>
              <button
                onClick={() => copyToClipboard(`To: ${showInvitation.email}\n\nSubject: Your IBRAX Private Invitation\n\nHi ${showInvitation.name},\n\nYou've been approved for access to IBRAX Private.\n\nYour invitation code:\n\n${showInvitation.code}\n\nUse this code to enter IBRAX Private.\n\nThis invitation was created specifically for you and should not be shared.\n\n— Usmaan\nIBRAX`)}
                className="px-6 py-3 border border-border rounded-md font-medium hover:border-accent hover:text-accent transition-colors"
              >
                Copy Email Template
              </button>
              <button
                onClick={() => setShowInvitation(null)}
                className="px-6 py-3 border border-border rounded-md font-medium hover:border-red-500/50 hover:text-red-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="py-12">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/admin"
          className="text-sm text-text-muted hover:text-text transition-colors mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <p className="label-small mb-2">IBRAX / ADMIN</p>
        <h1 className="font-display text-4xl font-medium">Access Requests</h1>
        <p className="text-text-muted mt-2">
          Review and manage requests for private access.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-500/30 bg-red-500/10 rounded-md text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {loading && (
          <div className="border border-border rounded-md p-12 text-center">
            <p className="text-text-muted">Loading requests...</p>
          </div>
        )}

        {!loading && requests.length === 0 && (
          <div className="border border-border rounded-md p-12 text-center">
            <p className="text-text-muted">No access requests yet.</p>
          </div>
        )}

        {requests.map((request) => (
          <div
            key={request.id}
            className="border border-border rounded-md p-6"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display text-xl">{request.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    request.status === 'pending'
                      ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                      : request.status === 'approved'
                      ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                      : request.status === 'denied'
                      ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                      : 'bg-gray-500/10 text-gray-500 border border-gray-500/30'
                  }`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-sm text-text-muted mb-3">{request.email}</p>
                
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-text-muted">How they know you:</span>{' '}
                    {request.how_they_know_you}
                  </p>
                  <p>
                    <span className="text-text-muted">Reason:</span>{' '}
                    {request.reason}
                  </p>
                  {request.additional_info && (
                    <p>
                      <span className="text-text-muted">Additional info:</span>{' '}
                      {request.additional_info}
                    </p>
                  )}
                  <p className="text-xs text-text-muted">
                    Requested: {new Date(request.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="flex gap-2 md:flex-col">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="px-4 py-2 bg-accent text-background rounded-md text-sm font-medium hover:bg-accent-hover transition-colors"
                  >
                    Approve
                  </button>
                  <button
  onClick={() => handleDeny(request.id)}
  className="px-4 py-2 border border-border rounded-md text-sm hover:border-red-500/50 hover:text-red-500 transition-colors"
>
  Deny
</button>
<button
  onClick={() => handleBlacklist(request.id)}
  className="px-4 py-2 border border-border rounded-md text-sm hover:border-red-500/50 hover:text-red-500 transition-colors"
>
  Blacklist
</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}