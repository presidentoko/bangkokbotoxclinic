import type { Metadata } from 'next'
import { ContactForm } from './ContactForm'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'th' ? 'ติดต่อเรา — ChicPreowned' : 'Contact — ChicPreowned',
    description: locale === 'th'
      ? 'ติดต่อสอบถามเกี่ยวกับราคาสินค้าแบรนด์เนมมือสองในไทย'
      : 'Get in touch with questions about pre-owned luxury prices in Thailand.',
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const isTH = locale === 'th'

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-2">{isTH ? 'ติดต่อเรา' : 'Contact Us'}</h1>
      <p className="text-gray-600 mb-8">
        {isTH
          ? 'สอบถามราคา แจ้งข้อผิดพลาด หรืออยากแนะนำสินค้าใหม่? เราอ่านทุกข้อความ'
          : 'Questions about pricing? Spot an error? Want to suggest a new brand or model? We read every message.'}
      </p>
      <ContactForm locale={locale} />
    </div>
  )
}
