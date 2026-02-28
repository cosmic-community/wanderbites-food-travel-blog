'use server'

import { Resend } from 'resend'

interface ContactFormState {
  success: boolean
  error: string | null
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get('name') as string | null
  const email = formData.get('email') as string | null
  const message = formData.get('message') as string | null

  // Validate inputs
  if (!name || name.trim().length === 0) {
    return { success: false, error: 'Name is required.' }
  }

  if (!email || email.trim().length === 0) {
    return { success: false, error: 'Email is required.' }
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  if (!message || message.trim().length === 0) {
    return { success: false, error: 'Message is required.' }
  }

  if (message.trim().length > 5000) {
    return { success: false, error: 'Message must be under 5000 characters.' }
  }

  try {
    const { error } = await resend.emails.send({
      from: 'my@email.com',
      to: 'my@email.com',
      subject: `Wanderbites Contact: ${name.trim()}`,
      replyTo: email.trim(),
      text: [
        `New contact form submission from Wanderbites`,
        ``,
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        ``,
        `Message:`,
        message.trim(),
      ].join('\n'),
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: 'Failed to send message. Please try again later.' }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error('Contact form error:', err)
    return { success: false, error: 'An unexpected error occurred. Please try again later.' }
  }
}