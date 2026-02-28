'use server'

import { Resend } from 'resend'

interface ContactFormState {
  success: boolean
  error: string | null
}

export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get('name') as string | null
  const email = formData.get('email') as string | null
  const message = formData.get('message') as string | null

  // Validate required fields
  if (!name || !name.trim()) {
    return { success: false, error: 'Name is required.' }
  }
  if (!email || !email.trim()) {
    return { success: false, error: 'Email is required.' }
  }
  if (!message || !message.trim()) {
    return { success: false, error: 'Message is required.' }
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { success: false, error: 'Email service is not configured. Please try again later.' }
  }

  const resend = new Resend(apiKey)

  try {
    await resend.emails.send({
      from: 'tony@cosmicjs.com',
      to: 'tony@cosmicjs.com',
      subject: `Wanderbites Contact: Message from ${name.trim()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #c2410c; padding-bottom: 12px;">
            New Contact Message — Wanderbites
          </h2>
          <div style="margin: 20px 0;">
            <p style="margin: 8px 0; color: #555;"><strong>Name:</strong> ${name.trim()}</p>
            <p style="margin: 8px 0; color: #555;"><strong>Email:</strong> ${email.trim()}</p>
          </div>
          <div style="background: #faf5f0; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #1a1a1a;">Message:</p>
            <p style="margin: 0; color: #333; white-space: pre-wrap;">${message.trim()}</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            Sent from the Wanderbites contact form.
          </p>
        </div>
      `,
      replyTo: email.trim(),
    })

    return { success: true, error: null }
  } catch (err) {
    console.error('Failed to send contact email:', err)
    return { success: false, error: 'Failed to send message. Please try again later.' }
  }
}