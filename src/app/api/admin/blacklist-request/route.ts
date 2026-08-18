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

    // Get the request first
    const { data: accessRequest, error: fetchError } = await supabase
      .from('access_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !accessRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 })
    }

    // Add to blacklist
    const { error: blacklistError } = await supabase
      .from('blacklist')
      .insert({
        email: accessRequest.email,
        reason: 'Manually blacklisted by admin',
      })

    if (blacklistError) {
      console.error('Error blacklisting:', blacklistError)
    }

    // Update request status
    const { error: updateError } = await supabase
      .from('access_requests')
      .update({
        status: 'blacklisted',
        processed_at: new Date().toISOString(),
        processed_by: user.id,
      })
      .eq('id', requestId)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to blacklist' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}