import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch counts
  const { count: pendingRequests } = await supabase
    .from('access_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: activeMembers } = await supabase
    .from('private_members')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: unredeemedInvitations } = await supabase
    .from('invitations')
    .select('*', { count: 'exact', head: true })
    .in('status', ['generated', 'sent'])

  const { count: pendingComments } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  return (
    <main className="py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="label-small mb-2">IBRAX / ADMIN</p>
        <h1 className="font-display text-4xl font-medium">
          Good evening, {user?.email?.split('@')[0] || 'Admin'}.
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="border border-border rounded-md p-6">
          <p className="text-3xl font-display font-medium mb-1">{pendingRequests || 0}</p>
          <p className="text-sm text-text-muted">Pending Requests</p>
        </div>
        <div className="border border-border rounded-md p-6">
          <p className="text-3xl font-display font-medium mb-1">{activeMembers || 0}</p>
          <p className="text-sm text-text-muted">Active Members</p>
        </div>
        <div className="border border-border rounded-md p-6">
          <p className="text-3xl font-display font-medium mb-1">{unredeemedInvitations || 0}</p>
          <p className="text-sm text-text-muted">Unredeemed Invites</p>
        </div>
        <div className="border border-border rounded-md p-6">
          <p className="text-3xl font-display font-medium mb-1">{pendingComments || 0}</p>
          <p className="text-sm text-text-muted">Pending Comments</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <Link
          href="/admin/private/requests"
          className="border border-border rounded-md p-6 hover:border-accent transition-colors group"
        >
          <h3 className="font-display text-xl mb-2 group-hover:text-accent transition-colors">
            Access Requests
          </h3>
          <p className="text-sm text-text-muted">
            Review and manage private access requests
          </p>
        </Link>

        <Link
          href="/admin/private/members"
          className="border border-border rounded-md p-6 hover:border-accent transition-colors group"
        >
          <h3 className="font-display text-xl mb-2 group-hover:text-accent transition-colors">
            Members
          </h3>
          <p className="text-sm text-text-muted">
            Manage private journal members
          </p>
        </Link>

        <Link
          href="/admin/private/invitations"
          className="border border-border rounded-md p-6 hover:border-accent transition-colors group"
        >
          <h3 className="font-display text-xl mb-2 group-hover:text-accent transition-colors">
            Invitations
          </h3>
          <p className="text-sm text-text-muted">
            View and manage invitation codes
          </p>
        </Link>
      </div>

      {/* Recent Requests */}
      <div className="border border-border rounded-md overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-display text-xl">Recent Requests</h2>
        </div>
        <div className="divide-y divide-border">
          {/* We'll populate this in the requests page */}
          <p className="p-6 text-sm text-text-muted">
            Visit the Requests page to manage access requests.
          </p>
        </div>
      </div>
    </main>
  )
}