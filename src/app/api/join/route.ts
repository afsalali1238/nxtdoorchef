import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, cuisine_type, area, whatsapp, from_city, from_country, cooking_philosophy } = body

    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is not set. Skipping email notification.')
      return NextResponse.json({ ok: true, skipped: true })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'NextDoorChef <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'cryptbuddha@gmail.com',
      subject: `New application: ${name} · ${cuisine_type || 'Unknown'} · ${area || 'Unknown'}`,
      html: `<h2>New chef application</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Cuisine:</strong> ${cuisine_type}</p>
        <p><strong>Area:</strong> ${area}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>From:</strong> ${from_city || '—'}, ${from_country || '—'}</p>
        <p><strong>Philosophy:</strong> ${cooking_philosophy || '—'}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://nextdoorchef.com'}/admin">Review in admin →</a></p>`
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error sending join notification:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
