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
      {/* Success message */}
      {state.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-lg">✓</span>
            <p className="text-green-800 font-medium text-sm">
              Message sent successfully! We&apos;ll get back to you soon.
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{state.error}</p>
        </div>
      )}

      {/* Name field */}
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
          className="w-full px-4 py-2.5 border border-cream-300 rounded-lg bg-white text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-shadow"
        />
      </div>

      {/* Email field */}
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
          className="w-full px-4 py-2.5 border border-cream-300 rounded-lg bg-white text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-shadow"
        />
      </div>

      {/* Message field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-charcoal-800 mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us what's on your mind..."
          className="w-full px-4 py-2.5 border border-cream-300 rounded-lg bg-white text-charcoal-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-shadow resize-y"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full sm:w-auto px-8 py-3 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-terracotta-300 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:ring-offset-2"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  )
}