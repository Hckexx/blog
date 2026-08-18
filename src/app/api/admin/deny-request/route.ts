import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabaseAuth = await createClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { requestId } = body

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('access_requests')
      .update({
        status: 'denied',
        processed_at: new Date().toISOString(),
        processed_by: user.id,
      })
      .eq('id', requestId)

    if (error) {
      return NextResponse.json({ error: 'Failed to deny request' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}