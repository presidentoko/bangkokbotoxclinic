const ALL_GUIDES = [
  { key: 'toxic',       href: '/toxic',       icon: '⚠️', title: 'อาหารต้องห้าม',     desc: '12 อาหารอันตรายสำหรับสัตว์เลี้ยง' },
  { key: 'tips',        href: '/tips',        icon: '📚', title: 'เคล็ดลับดูแลน้อง',   desc: '15 คำถามที่พบบ่อยสำหรับเจ้าของ' },
  { key: 'emergency',   href: '/emergency',   icon: '🚨', title: 'คู่มือฉุกเฉิน',      desc: 'อาการที่ต้องไปหาหมอทันที' },
  { key: 'newpet',      href: '/newpet',      icon: '🆕', title: 'เลี้ยงน้องใหม่',     desc: 'เช็คลิสต์ 20 ข้อสำหรับมือใหม่' },
  { key: 'ingredients', href: '/ingredients', icon: '🔬', title: 'ส่วนผสมอันตราย',     desc: 'BHA, BHT, Ethoxyquin + อื่นๆ' },
  { key: 'vaccine',     href: '/vaccine',     icon: '💉', title: 'ตารางวัคซีน',        desc: 'คำนวณนัดฉีดวัคซีนน้อง' },
  { key: 'food',        href: '/food',        icon: '🍖', title: 'ตรวจสอบอาหาร',       desc: 'เกรด A-F + ส่วนผสม 1,200 ยี่ห้อ' },
  { key: 'hospital',    href: '/hospital',    icon: '🏥', title: 'หาโรงพยาบาลสัตว์',   desc: '503 โรงพยาบาลทั่วไทย' },
  { key: 'dental',      href: '/dental',      icon: '🦷', title: 'ดูแลฟัน',             desc: 'แปรงฟัน สเกลฟัน โรคเหงือก' },
  { key: 'deworming',   href: '/deworming',   icon: '🪱', title: 'ถ่ายพยาธิ',           desc: 'ตารางถ่ายพยาธิและยาที่ควรใช้' },
  { key: 'flea',        href: '/flea',        icon: '🦟', title: 'กำจัดหมัด/เห็บ',      desc: 'ยา วิธีใช้ และการทำความสะอาด' },
  { key: 'grooming',    href: '/grooming',    icon: '🪮', title: 'ดูแลขน & Grooming',   desc: 'อาบน้ำ แปรงขน ตัดเล็บ ดูแลหู' },
  { key: 'microchip',   href: '/microchip',   icon: '📡', title: 'ไมโครชิป',             desc: 'ขั้นตอน ราคา และประโยชน์' },
  { key: 'training',    href: '/training',    icon: '🐕', title: 'ฝึกสุนัข',             desc: 'นั่ง นอน อยู่ที่ด้วย positive reinforcement' },
  { key: 'insurance',   href: '/insurance',   icon: '🛡️', title: 'ประกันสัตว์เลี้ยง',    desc: 'เปรียบเทียบและสิ่งที่ต้องรู้' },
  { key: 'first-aid',    href: '/first-aid',    icon: '🩹', title: 'ปฐมพยาบาลเบื้องต้น',  desc: 'เลือดออก ชัก จมน้ำ ก่อนหาหมอ' },
  { key: 'potty-training', href: '/potty-training', icon: '🚽', title: 'ฝึกฉี่ถูกที่',      desc: 'สุนัขและแมว step-by-step' },
  { key: 'weight',        href: '/weight',        icon: '⚖️', title: 'ประเมินน้ำหนัก BCS', desc: 'ตรวจสอบว่าน้องอ้วนหรือผอม' },
  { key: 'cat-behavior', href: '/cat-behavior', icon: '🐱', title: 'พฤติกรรมแมว',          desc: 'ทำไมแมวถึง... อ่านภาษาแมว' },
  { key: 'neutering',  href: '/neutering',  icon: '✂️', title: 'ทำหมัน',           desc: 'ประโยชน์ อายุที่เหมาะ ราคา ดูแลหลัง' },
  { key: 'heartworm',  href: '/heartworm',  icon: '🦟', title: 'พยาธิหัวใจ',       desc: 'ป้องกัน ยาที่ใช้ และอาการ' },
  { key: 'allergy',    href: '/allergy',    icon: '🤧', title: 'สัตว์เลี้ยงแพ้อาหาร', desc: 'อาการ elimination diet' },
  { key: 'travel',     href: '/travel',     icon: '✈️', title: 'เดินทางกับน้อง',      desc: 'สายการบิน เอกสาร ข้ามประเทศ' },
  { key: 'anxiety',       href: '/anxiety',       icon: '😰', title: 'Separation Anxiety',  desc: 'วิตกกังวล เห่า ทำลายของ' },
  { key: 'kidney-disease',href: '/kidney-disease',icon: '🫘', title: 'โรคไต CKD',           desc: 'อาการ อาหาร ระยะ ดูแลที่บ้าน' },
  { key: 'raw-food',   href: '/raw-food',   icon: '🥩', title: 'อาหาร Raw (BARF)',   desc: 'ข้อดี ข้อเสีย วิธีทำปลอดภัย' },
  { key: 'heatstroke',   href: '/heatstroke',   icon: '☀️', title: 'โรคลมแดด',          desc: 'ฉุกเฉิน — ปฐมพยาบาลและป้องกัน' },
  { key: 'dog-behavior', href: '/dog-behavior', icon: '🐕', title: 'พฤติกรรมสุนัข',    desc: 'เห่า กัด ขุด ภาษากาย' },
  { key: 'breeds',      href: '/breeds',      icon: '🐾', title: 'สายพันธุ์ยอดนิยม', desc: 'สุนัขและแมวนิยมเลี้ยงในไทย' },
  { key: 'supplements', href: '/supplements', icon: '💊', title: 'อาหารเสริม',      desc: 'โอเมก้า 3 กลูโคซามีน โพรไบโอติก' },
  { key: 'cat-litter',  href: '/cat-litter',  icon: '🪨', title: 'เลือกทรายแมว',   desc: 'Bentonite Tofu Silica เปรียบเทียบ' },
  { key: 'senior-care', href: '/senior-care', icon: '👴', title: 'น้องสูงวัย',   desc: 'อาหาร โรค และการดูแลในวัยชรา' },
  { key: 'pregnancy',   href: '/pregnancy',   icon: '🐣', title: 'สัตว์เลี้ยงท้อง', desc: 'ดูแลระหว่างตั้งท้องและหลังคลอด' },
  { key: 'diabetes',       href: '/diabetes',       icon: '🩺', title: 'โรคเบาหวาน',      desc: 'อาการ อาหาร และการรักษา' },
  { key: 'poison-plants',  href: '/poison-plants',  icon: '🌿', title: 'พืชพิษในบ้าน',   desc: 'ไม้ประดับที่อันตรายกับน้อง' },
  { key: 'apartment-pets', href: '/apartment-pets', icon: '🏢', title: 'เลี้ยงในคอนโด',  desc: 'สายพันธุ์เหมาะ เคล็ดลับพื้นที่จำกัด' },
  { key: 'kitten-care',    href: '/kitten-care',    icon: '🐱', title: 'เลี้ยงลูกแมว',  desc: 'ตั้งแต่แรกเกิดถึง 1 ปี' },
  { key: 'puppy-care',      href: '/puppy-care',      icon: '🐶', title: 'เลี้ยงลูกสุนัข',   desc: 'ตั้งแต่แรกเกิดถึง 1 ปี' },
  { key: 'leash-training',  href: '/leash-training',  icon: '🦮', title: 'ฝึกเดินสายจูง',   desc: 'สุนัขดึงสายจูง step-by-step' },
  { key: 'cat-scratching',  href: '/cat-scratching',  icon: '🐾', title: 'แมวข่วนเฟอร์นิเจอร์', desc: 'วิธีแก้ redirect ที่ได้ผล' },
  { key: 'ear-care',        href: '/ear-care',        icon: '👂', title: 'ดูแลหูสัตว์เลี้ยง',  desc: 'ทำความสะอาด ไรหู หูอักเสบ' },
  { key: 'medicine-tips',   href: '/medicine-tips',   icon: '💊', title: 'วิธีให้ยาสัตว์เลี้ยง', desc: 'ยาเม็ด ยาน้ำ สัตว์ไม่ยอมกิน' },
  { key: 'eye-care',        href: '/eye-care',        icon: '👁️', title: 'ตาสัตว์เลี้ยง',       desc: 'ขี้ตา ตาแดง ตาอักเสบ' },
  { key: 'diarrhea',        href: '/diarrhea',        icon: '💩', title: 'ท้องเสีย',             desc: 'ดูแลที่บ้านหรือต้องพาหมอ' },
  { key: 'not-eating',      href: '/not-eating',      icon: '🍽️', title: 'สัตว์เลี้ยงไม่กิน',   desc: 'สาเหตุและวิธีแก้' },
  { key: 'symptoms',        href: '/symptoms',        icon: '🩺', title: 'ตรวจสอบอาการ',       desc: 'เลือกอาการ รู้ขั้นตอน' },
  { key: 'breed-quiz',      href: '/breed-quiz',      icon: '🐾', title: 'ค้นหาสายพันธุ์',     desc: 'แบบทดสอบ 4 คำถาม' },
  { key: 'urinary',         href: '/urinary',         icon: '🚽', title: 'โรคทางเดินปัสสาวะ',  desc: 'FLUTD แมวปัสสาวะลำบาก' },
  { key: 'vomiting',        href: '/vomiting',        icon: '🤢', title: 'สัตว์เลี้ยงอาเจียน',  desc: 'ดูแลที่บ้านหรือต้องพาหมอ' },
  { key: 'obesity',         href: '/obesity',         icon: '🐾', title: 'น้องอ้วน — ลดน้ำหนัก', desc: 'BCS ตรวจด้วยมือ + แผนอาหาร' },
  { key: 'skin',            href: '/skin',            icon: '🐾', title: 'โรคผิวหนัง คัน ขนร่วง', desc: 'สาเหตุและการดูแลเบื้องต้น' },
  { key: 'food-quiz',              href: '/food-quiz',              icon: '🍖', title: 'แบบทดสอบอาหาร',          desc: 'อาหารอะไรเหมาะกับน้อง? 4 คำถาม' },
  { key: 'why-dogs-eat-grass',     href: '/why-dogs-eat-grass',     icon: '🌿', title: 'ทำไมสุนัขกินหญ้า?',       desc: 'ปกติหรือเปล่า? 5 สาเหตุ' },
  { key: 'cat-not-using-litter',   href: '/cat-not-using-litter',   icon: '🚽', title: 'แมวไม่ใช้กระบะทราย',     desc: 'สาเหตุและวิธีแก้ทีละขั้น' },
  { key: 'dog-barking',            href: '/dog-barking',            icon: '🐕', title: 'สุนัขเห่ามาก',             desc: '5 เทคนิคหยุดเห่าที่ได้ผล' },
]

import SocialShare from './SocialShare'

interface Props {
  current: string
  count?: number
}

export default function RelatedGuides({ current, count = 4 }: Props) {
  const filtered = ALL_GUIDES.filter(g => g.key !== current)
  const currentIdx = ALL_GUIDES.findIndex(g => g.key === current)
  const offset = currentIdx >= 0 ? (currentIdx * 7) % Math.max(filtered.length - count + 1, 1) : 0
  const guides = [...filtered.slice(offset, offset + count), ...filtered].slice(0, count)

  return (
    <div className="mt-10 border-t border-gray-100 pt-8">
      <SocialShare />
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 mt-6">คู่มือที่เกี่ยวข้อง</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {guides.map(g => (
          <a
            key={g.key}
            href={g.href}
            className="bg-white rounded-xl border p-3 hover:shadow-md hover:border-orange-200 hover:-translate-y-0.5 transition-all group"
          >
            <p className="text-2xl mb-1.5">{g.icon}</p>
            <p className="font-semibold text-sm text-gray-800 group-hover:text-orange-600 transition-colors leading-tight">{g.title}</p>
            <p className="text-[11px] text-gray-400 mt-1 leading-snug">{g.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
