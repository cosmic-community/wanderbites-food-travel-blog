'use server';

import { Resend } from 'resend';
import { buildContactEmailHtml } from '@/lib/contact-email';

interface ContactFormState {
  success: boolean;
  error: string | null;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Validate inputs
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string'
  ) {
    return { success: false, error: 'All fields are required.' };
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return { success: false, error: 'All fields are required.' };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    const { error } = await resend.emails.send({
      from: 'tony@cosmicjs.com',
      to: 'tony@cosmicjs.com',
      subject: `Wanderbites Contact: ${trimmedName}`,
      replyTo: trimmedEmail,
      html: buildContactEmailHtml({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        error: 'Failed to send your message. Please try again later.',
      };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Contact form error:', err);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}