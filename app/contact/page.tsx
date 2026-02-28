'use client';

import { useActionState, useEffect, useRef } from 'react';
import { sendContactEmail } from './action';

const initialState = { success: false, error: null as string | null };

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(
    sendContactEmail,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state.success]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <span className="text-4xl mb-4 block">✉️</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-900 mb-3">
          Get in Touch
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
          Have a story tip, restaurant recommendation, or just want to say hello?
          We&apos;d love to hear from you.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        {/* Success Message */}
        {state.success && (
          <div className="mb-8 rounded-xl bg-green-50 border border-green-200 p-5 text-center">
            <span className="text-2xl block mb-2">🎉</span>
            <h3 className="text-lg font-semibold text-green-800 mb-1">
              Message Sent!
            </h3>
            <p className="text-sm text-green-700">
              Thanks for reaching out. We&apos;ll get back to you soon.
            </p>
          </div>
        )}

        {/* Error Message */}
        {state.error && (
          <div className="mb-8 rounded-xl bg-red-50 border border-red-200 p-5 text-center">
            <span className="text-2xl block mb-2">😕</span>
            <p className="text-sm text-red-700">{state.error}</p>
          </div>
        )}

        {/* Contact Form */}
        <form
          ref={formRef}
          action={formAction}
          className="bg-white rounded-2xl shadow-md border border-cream-200 p-6 sm:p-8 space-y-6"
        >
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-charcoal-800 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Your name"
              className="w-full rounded-lg border border-cream-300 bg-cream-50 px-4 py-3 text-charcoal-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-shadow text-sm"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-charcoal-800 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-cream-300 bg-cream-50 px-4 py-3 text-charcoal-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-shadow text-sm"
            />
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-charcoal-800 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tell us what's on your mind..."
              className="w-full rounded-lg border border-cream-300 bg-cream-50 px-4 py-3 text-charcoal-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-shadow text-sm resize-vertical"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-terracotta-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>

        {/* Additional Info */}
        <p className="text-center text-xs text-gray-400 mt-6">
          We typically respond within 24–48 hours. 🍜
        </p>
      </div>
    </div>
  );
}