import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { generateInvitationCode, hashInvitationCode } from '@/lib/invitations'

export async function POST(request: Request) {
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

    const body = await request.json()
    const { requestId, accessLevel = 'private' } = body

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Get the request
    const { data: accessRequest, error: requestError } = await supabase
      .from('access_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (requestError || !accessRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    if (accessRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Request already processed' },
        { status: 400 }
      )
    }

    // Generate invitation code
    const invitationCode = generateInvitationCode()
    const codeHash = hashInvitationCode(invitationCode)

    // Create invitation in database
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .insert({
        request_id: requestId,
        email: accessRequest.email,
        code_hash: codeHash,
        access_level: accessLevel,
        status: 'generated',
      })
      .select()
      .single()

    if (invitationError) {
      console.error('Error creating invitation:', invitationError)
      return NextResponse.json(
        { error: 'Failed to generate invitation' },
        { status: 500 }
      )
    }

    // Update request status to approved
    const { error: updateError } = await supabase
      .from('access_requests')
      .update({
        status: 'approved',
        processed_at: new Date().toISOString(),
        processed_by: user.id,
      })
      .eq('id', requestId)

    if (updateError) {
      console.error('Error updating request:', updateError)
      return NextResponse.json(
        { error: 'Failed to update request' },
        { status: 500 }
      )
    }

    // Return the invitation code (shown only once)
    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        code: invitationCode, // This is the only time the raw code is returned
        email: accessRequest.email,
        name: accessRequest.name,
        accessLevel,
      },
    })
  } catch (error) {
    console.error('Error in approve endpoint:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}