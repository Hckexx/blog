import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Verify admin is authenticated
    const supabaseAuth = await createClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createAdminClient()

    const { data: requests, error } = await supabase
      .from('access_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching requests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch requests' },
        { status: 500 }
      )
    }

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Error in requests endpoint:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}