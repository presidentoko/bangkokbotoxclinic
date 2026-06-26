import type { Metadata } from 'next'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact — SecondLuxuryItems',
  description: 'Get in touch with questions about pre-owned luxury prices, price corrections, or anything else.',
}

export default function ContactPage() {
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Questions about pricing data? Spot an error? Want to suggest a brand or model? We read every message.
      </p>
      <ContactForm />
    </div>
  )
}
