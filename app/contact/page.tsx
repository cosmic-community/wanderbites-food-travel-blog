import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact — Wanderbites',
  description: 'Get in touch with the Wanderbites team. We\'d love to hear from you — whether it\'s a story tip, a collaboration idea, or just to say hello.',
}

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-terracotta-500 transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal-800">Contact</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left column — intro */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Got a story tip from a back-alley noodle shop? Want to collaborate on a food travel
            piece? Or just want to say hello? Drop us a message — we read every one.
          </p>

          <div className="space-y-4 text-sm text-gray-500">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">📧</span>
              <div>
                <p className="font-medium text-charcoal-800">Email</p>
                <p>my@email.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">🌍</span>
              <div>
                <p className="font-medium text-charcoal-800">Based in</p>
                <p>Wherever the food takes us</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">⏱️</span>
              <div>
                <p className="font-medium text-charcoal-800">Response time</p>
                <p>Usually within 48 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — form */}
        <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}