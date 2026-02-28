'use client'

import { useActionState, useEffect, useRef } from 'react'
import { sendContactEmail } from '@/app/contact/actions'

const initialState = {
  success: false,
  error: null as string | null,
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContactEmail, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset()
    }
  }, [state.success])

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* Success Message */}
      {state.success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 text-sm">
          <span className="font-medium">Message sent!</span> Thanks for reaching out — we&apos;ll
          get back to you soon. 🍜
        </div>
      )}

      {/* Error Message */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-sm">
          {state.error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-charcoal-800 mb-1.5">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Your name"
          className="w-full rounded-lg border border-cream-300 bg-white px-4 py-2.5 text-charcoal-800 placeholder:text-gray-400 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 transition-colors"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-charcoal-800 mb-1.5">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-cream-300 bg-white px-4 py-2.5 text-charcoal-800 placeholder:text-gray-400 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 transition-colors"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-charcoal-800 mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us what's on your mind..."
          className="w-full rounded-lg border border-cream-300 bg-white px-4 py-2.5 text-charcoal-800 placeholder:text-gray-400 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 transition-colors resize-y"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto px-8 py-3 bg-terracotta-500 text-white font-semibold rounded-lg hover:bg-terracotta-600 focus:outline-none focus:ring-2 focus:ring-terracotta-500/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}