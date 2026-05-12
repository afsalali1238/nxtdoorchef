import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// The RESEND_API_KEY will be pulled from process.env
// If it's missing, we won't crash the app, but email won't send
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Validate basic requirements
    if (!data.name || !data.whatsapp || !data.cuisine) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is not set. Skipping email notification.')
      // We still return success so the frontend continues
      return NextResponse.json({ success: true, warning: 'No API key' })
    }

    // Send email to admin
    await resend.emails.send({
      from: 'NextDoorChef <onboarding@resend.dev>', // resend.dev is allowed for testing
      to: 'cryptbuddha@gmail.com',
      subject: `New Chef Application: ${data.name}`,
      html: `
        <h2>New Home Chef Application!</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
        <p><strong>Cuisine/Specialty:</strong> ${data.cuisine}</p>
        <p><strong>Area:</strong> ${data.area || 'Not provided'}</p>
        <br/>
        <p>Login to your Supabase dashboard to approve them.</p>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error sending join notification:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
