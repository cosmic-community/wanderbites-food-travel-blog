import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact — Wanderbites',
  description:
    'Get in touch with the Wanderbites team. Have a story tip, a restaurant recommendation, or just want to say hello? Drop us a message.',
}

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="text-4xl mb-4 block">✉️</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-900 mb-3">Get in Touch</h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Have a story tip, a restaurant recommendation, or just want to say hello? We&apos;d love
            to hear from you.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white rounded-2xl shadow-md border border-cream-200 p-6 sm:p-8">
          <ContactForm />
        </div>

        {/* Additional Info */}
        <div className="mt-10 text-center text-sm text-gray-400">
          <p>We typically respond within 48 hours. For urgent matters, reach us on social media.</p>
        </div>
      </div>
    </div>
  )
}