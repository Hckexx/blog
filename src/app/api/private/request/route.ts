import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, howTheyKnowYou, reason, additionalInfo } = body

    // Basic validation
    if (!name || !email || !howTheyKnowYou || !reason) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Check if email is blacklisted
    const { data: blacklisted } = await supabase
      .from('blacklist')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (blacklisted) {
      return NextResponse.json(
        { error: 'This email cannot request access' },
        { status: 403 }
      )
    }

    // Check if there's already a pending request
    const { data: existingRequest } = await supabase
      .from('access_requests')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .eq('status', 'pending')
      .single()

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending request' },
        { status: 400 }
      )
    }

    // Create the request
    const { error: insertError } = await supabase
      .from('access_requests')
      .insert({
        name,
        email: email.toLowerCase(),
        how_they_know_you: howTheyKnowYou,
        reason,
        additional_info: additionalInfo || null,
        status: 'pending',
      })

    if (insertError) {
      console.error('Error creating request:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit request' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in request endpoint:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}