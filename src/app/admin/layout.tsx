import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in, redirect to login page
  if (!user) {
    redirect('/admin-login')
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}