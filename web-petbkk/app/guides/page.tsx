import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'คู่มือดูแลสัตว์เลี้ยงครบทุกเรื่อง',
  description: 'รวมคู่มือดูแลสัตว์เลี้ยงทุกเรื่อง สุขภาพ อาหาร พฤติกรรม ฉุกเฉิน และการเตรียมตัวรับน้องใหม่ ฟรี อ่านได้เลย',
  alternates: { canonical: 'https://www.thailandpethub.com/guides' },
  keywords: ['คู่มือสัตว์เลี้ยง', 'ดูแลสุนัข', 'ดูแลแมว', 'เลี้ยงสัตว์เลี้ยง', 'ข้อมูลสัตว์เลี้ยงไทย'],
  openGraph: {
    title: 'คู่มือดูแลสัตว์เลี้ยงครบทุกเรื่อง',
    description: 'คู่มือครบ สุขภาพ อาหาร พฤติกรรม ฉุกเฉิน และอื่นๆ',
    url: 'https://www.thailandpethub.com/guides',
  },
}

const CATEGORIES = [
  {
    cat: '🚨 ฉุกเฉิน & สุขภาพ',
    color: 'border-red-200 bg-red-50',
    headerColor: 'text-red-600',
    guides: [
      { href: '/emergency',    icon: '🚨', title: 'คู่มือฉุกเฉิน', desc: 'อาการที่ต้องพาหมอทันที' },
      { href: '/first-aid',    icon: '🩹', title: 'ปฐมพยาบาล',     desc: 'เลือดออก ชัก ก่อนพาหมอ' },
      { href: '/heatstroke',    icon: '☀️', title: 'โรคลมแดด',       desc: 'ฉุกเฉินในอากาศร้อน' },
      { href: '/toxic',         icon: '⚠️', title: 'อาหารต้องห้าม',  desc: '12 อาหารอันตราย' },
      { href: '/poison-plants', icon: '🌿', title: 'พืชพิษในบ้าน',  desc: 'ไม้ประดับที่อันตราย' },
      { href: '/symptoms',      icon: '🩺', title: 'ตรวจอาการ',      desc: 'น้องป่วย ต้องพาหมอไหม?' },
      { href: '/vomiting',      icon: '🤢', title: 'อาเจียน',         desc: 'ดูสีที่อาเจียน รู้สาเหตุ' },
      { href: '/diarrhea',      icon: '💩', title: 'ท้องเสีย',        desc: 'ดูแลที่บ้านหรือต้องพาหมอ' },
      { href: '/not-eating',    icon: '🍽️', title: 'ไม่กินอาหาร',   desc: 'สาเหตุและวิธีแก้' },
      { href: '/urinary',       icon: '🚽', title: 'FLUTD ปัสสาวะ',  desc: 'แมวปัสสาวะลำบาก' },
    ],
  },
  {
    cat: '🍖 อาหารและโภชนาการ',
    color: 'border-orange-200 bg-orange-50',
    headerColor: 'text-orange-600',
    guides: [
      { href: '/food',         icon: '🍖', title: 'ตรวจสอบอาหาร',    desc: 'เกรด A-F 1,200+ ยี่ห้อ' },
      { href: '/food/puppy',   icon: '🐶', title: 'อาหาร Puppy',     desc: 'ลูกสุนัข/ลูกแมว' },
      { href: '/food/senior',  icon: '👴', title: 'อาหาร Senior',    desc: 'สัตว์เลี้ยงสูงวัย' },
      { href: '/food/best',    icon: '⭐', title: 'อาหารเกรด A',     desc: 'ดีที่สุดสำหรับน้อง' },
      { href: '/food/budget',  icon: '💰', title: 'อาหารประหยัด',    desc: 'คุ้มค่า คุณภาพดี' },
      { href: '/ingredients',  icon: '🔬', title: 'ส่วนผสมอันตราย', desc: 'BHA BHT Ethoxyquin' },
      { href: '/allergy',      icon: '🤧', title: 'แพ้อาหาร',         desc: 'อาการ elimination diet' },
      { href: '/raw-food',     icon: '🥩', title: 'อาหาร Raw/BARF',   desc: 'ข้อดี เสี่ยง วิธีทำ' },
      { href: '/supplements',  icon: '💊', title: 'อาหารเสริม',       desc: 'โอเมก้า 3 กลูโคซามีน' },
    ],
  },
  {
    cat: '🏥 สุขภาพและการรักษา',
    color: 'border-blue-200 bg-blue-50',
    headerColor: 'text-blue-600',
    guides: [
      { href: '/vaccine',      icon: '💉', title: 'ตารางวัคซีน',   desc: 'คำนวณนัดฉีด' },
      { href: '/deworming',    icon: '🪱', title: 'ถ่ายพยาธิ',     desc: 'ตาราง วิธีการ ยา' },
      { href: '/heartworm',    icon: '🦟', title: 'พยาธิหัวใจ',    desc: 'ป้องกัน ยา อาการ' },
      { href: '/flea',         icon: '🦟', title: 'กำจัดหมัด/เห็บ', desc: 'ยา วิธี ป้องกัน' },
      { href: '/dental',       icon: '🦷', title: 'ดูแลฟัน',       desc: 'แปรงฟัน สเกล โรคเหงือก' },
      { href: '/kidney-disease',icon: '🫘', title: 'โรคไต CKD',      desc: 'อาการ อาหาร ระยะ' },
      { href: '/diabetes',     icon: '🩺', title: 'โรคเบาหวาน',     desc: 'อาการ อาหาร อินซูลิน' },
      { href: '/neutering',    icon: '✂️', title: 'ทำหมัน',          desc: 'ประโยชน์ ราคา ดูแลหลัง' },
      { href: '/microchip',    icon: '📡', title: 'ไมโครชิป',        desc: 'ขั้นตอนและประโยชน์' },
      { href: '/senior-care',  icon: '👴', title: 'น้องสูงวัย',      desc: 'อาหาร โรค ดูแลวัยชรา' },
      { href: '/pregnancy',    icon: '🐣', title: 'สัตว์เลี้ยงท้อง', desc: 'ดูแลระหว่างตั้งท้อง' },
    ],
  },
  {
    cat: '🧠 พฤติกรรมและการฝึก',
    color: 'border-purple-200 bg-purple-50',
    headerColor: 'text-purple-600',
    guides: [
      { href: '/training',             icon: '🎓', title: 'ฝึกสุนัข',              desc: 'นั่ง นอน positive' },
      { href: '/dog-behavior',         icon: '🐕', title: 'พฤติกรรมสุนัข',        desc: 'เห่า กัด ขุด ภาษากาย' },
      { href: '/cat-behavior',         icon: '🐱', title: 'พฤติกรรมแมว',          desc: 'ทำไมแมวถึง...' },
      { href: '/anxiety',              icon: '😰', title: 'Separation Anxiety',    desc: 'วิตกกังวล เห่า ทำลายของ' },
      { href: '/potty-training',       icon: '🚽', title: 'ฝึกฉี่ถูกที่',          desc: 'สุนัขและแมว step-by-step' },
      { href: '/dog-barking',          icon: '🐕', title: 'สุนัขเห่ามาก',          desc: '5 เทคนิคหยุดเห่า' },
      { href: '/cat-not-using-litter', icon: '🚽', title: 'แมวไม่ใช้กระบะทราย',   desc: 'สาเหตุและวิธีแก้' },
      { href: '/why-dogs-eat-grass',   icon: '🌿', title: 'ทำไมสุนัขกินหญ้า?',    desc: 'ปกติหรือน่าเป็นห่วง?' },
      { href: '/leash-training',       icon: '🦮', title: 'ฝึกเดินสายจูง',         desc: 'หยุดดึงสายจูง' },
      { href: '/cat-scratching',       icon: '🐾', title: 'แมวข่วนเฟอร์นิเจอร์',  desc: 'แก้ redirect ที่ได้ผล' },
    ],
  },
  {
    cat: '🐾 การดูแลทั่วไป',
    color: 'border-green-200 bg-green-50',
    headerColor: 'text-green-600',
    guides: [
      { href: '/newpet',       icon: '🆕', title: 'เลี้ยงน้องใหม่',    desc: 'เช็คลิสต์ 20 ข้อ' },
      { href: '/kitten-care',  icon: '🐱', title: 'เลี้ยงลูกแมว',     desc: 'แรกเกิด-1 ปี ครบทุกเรื่อง' },
      { href: '/puppy-care',   icon: '🐶', title: 'เลี้ยงลูกสุนัข',   desc: 'แรกเกิด-1 ปี วัคซีน ฝึก' },
      { href: '/checklist',   icon: '✅', title: 'เช็คลิสต์ดูแลน้อง', desc: 'ติดตามรายสัปดาห์' },
      { href: '/grooming',    icon: '🪮', title: 'ดูแลขน/Grooming',   desc: 'อาบน้ำ แปรงขน ตัดเล็บ' },
      { href: '/weight',      icon: '⚖️', title: 'ประเมินน้ำหนัก BCS', desc: 'เช็คอ้วนผอม' },
      { href: '/tips',        icon: '📚', title: 'เคล็ดลับดูแลน้อง',   desc: '15 คำถามยอดนิยม' },
      { href: '/breeds',          icon: '🐾', title: 'สายพันธุ์ยอดนิยม',  desc: '12 สายพันธุ์ในไทย' },
      { href: '/cat-litter',      icon: '🪨', title: 'ทรายแมว',           desc: 'Bentonite Tofu Silica' },
      { href: '/travel',          icon: '✈️', title: 'เดินทางกับน้อง',    desc: 'สายการบิน เอกสาร' },
      { href: '/insurance',       icon: '🛡️', title: 'ประกันสัตว์เลี้ยง', desc: 'เปรียบเทียบแผน' },
      { href: '/apartment-pets',  icon: '🏢', title: 'เลี้ยงในคอนโด',     desc: 'สายพันธุ์เหมาะ เคล็ดลับ' },
      { href: '/obesity',         icon: '⚖️', title: 'น้องอ้วน',           desc: 'BCS + ลดน้ำหนักปลอดภัย' },
      { href: '/skin',            icon: '🐾', title: 'โรคผิวหนัง คัน',     desc: 'ขนร่วง ผิวแดง ดูแลเบื้องต้น' },
      { href: '/eye-care',        icon: '👁️', title: 'ตาสัตว์เลี้ยง',      desc: 'ขี้ตา ตาแดง ตาอักเสบ' },
      { href: '/ear-care',        icon: '👂', title: 'ดูแลหู',               desc: 'ทำความสะอาด ไรหู' },
      { href: '/medicine-tips',   icon: '💊', title: 'วิธีให้ยา',            desc: 'ยาเม็ด ยาน้ำ สัตว์ดื้อยา' },
    ],
  },
  {
    cat: '🏠 ค้นหาและตัดสินใจ',
    color: 'border-gray-200 bg-gray-50',
    headerColor: 'text-gray-600',
    guides: [
      { href: '/hospital',    icon: '🏥', title: 'หาโรงพยาบาล',    desc: '503 แห่งในกรุงเทพ' },
      { href: '/adopt',       icon: '💚', title: 'รับเลี้ยงแทนซื้อ', desc: 'องค์กรช่วยสัตว์' },
      { href: '/cost',        icon: '💰', title: 'ค่าใช้จ่าย',       desc: 'ประมาณรายเดือน' },
      { href: '/compare',     icon: '⚖️', title: 'เปรียบเทียบอาหาร', desc: 'เทียบ 3 ยี่ห้อ' },
      { href: '/age',         icon: '🎂', title: 'คำนวณอายุ',        desc: 'เทียบอายุมนุษย์' },
      { href: '/breed-quiz',  icon: '🐾', title: 'ค้นหาสายพันธุ์',   desc: 'แบบทดสอบ 4 คำถาม' },
      { href: '/food-quiz',   icon: '🍖', title: 'แบบทดสอบอาหาร',   desc: 'อาหารไหนเหมาะกับน้อง?' },
      { href: '/my-pet',      icon: '📋', title: 'โปรไฟล์น้อง',      desc: 'ติดตามวัคซีน ถ่ายพยาธิ' },
    ],
  },
]

function GuidesJsonLd() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: 'https://www.thailandpethub.com' },
      { '@type': 'ListItem', position: 2, name: 'คู่มือทั้งหมด', item: 'https://www.thailandpethub.com/guides' },
    ],
  }
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'คู่มือดูแลสัตว์เลี้ยงทั้งหมด',
    itemListElement: CATEGORIES.flatMap(c => c.guides).map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: g.title,
      url: `https://www.thailandpethub.com${g.href}`,
    })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    </>
  )
}

export default function GuidesPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <GuidesJsonLd />
      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">คู่มือทั้งหมด</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-2">📚 คู่มือดูแลสัตว์เลี้ยง</h1>
      <p className="text-gray-500 text-sm mb-8">ครบทุกเรื่อง อ่านฟรี ไม่มีโฆษณาแทรก</p>

      <div className="space-y-6">
        {CATEGORIES.map(c => (
          <section key={c.cat} className={`rounded-2xl border p-5 ${c.color}`}>
            <h2 className={`font-black text-lg mb-4 ${c.headerColor}`}>{c.cat}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {c.guides.map(g => (
                <a
                  key={g.href}
                  href={g.href}
                  className="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-md hover:border-orange-200 hover:-translate-y-0.5 transition-all group"
                >
                  <p className="text-xl mb-1.5">{g.icon}</p>
                  <p className="font-semibold text-sm text-gray-800 group-hover:text-orange-600 transition-colors leading-tight">{g.title}</p>
                  <p className="text-[11px] text-gray-400 mt-1 leading-snug">{g.desc}</p>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 text-center">
        <a href="/" className="text-orange-500 hover:text-orange-600 text-sm font-semibold">← กลับหน้าหลัก</a>
      </div>
    </main>
  )
}
