import HomeSearchBars from '@/components/HomeSearchBars'
import PetProfileSetup from '@/components/PetProfileSetup'
import PersonalizedFoodRecs from '@/components/PersonalizedFoodRecs'
import PopularFoods from '@/components/PopularFoods'
import RecentFoods from '@/components/RecentFoods'

const FOOD_CHIPS = [
  { label: 'Royal Canin', href: '/food?q=royal+canin' },
  { label: '🐶 Puppy/Kitten', href: '/food/puppy' },
  { label: '🐈 แมว', href: '/food?animal=cat' },
  { label: '⭐ เกรด A', href: '/food/best' },
  { label: '👴 Senior', href: '/food/senior' },
  { label: '💰 ประหยัด', href: '/food/budget' },
]

const HOSPITAL_CHIPS = [
  { label: '⏰ 24 ชั่วโมง', href: '/hospital?filter=24h' },
  { label: '🚨 ฉุกเฉิน', href: '/hospital/emergency' },
  { label: '📍 ใกล้ฉัน', href: '/hospital?filter=near' },
]

const STATS = [
  { num: '986', label: 'อาหารที่ตรวจสอบแล้ว', icon: '🍖' },
  { num: '503', label: 'โรงพยาบาลสัตว์', icon: '🏥' },
  { num: '฿0', label: 'ค่าบริการ ฟรีตลอด', icon: '💝' },
]

const TOOLS = [
  { href: '/food',        icon: '🍖', title: 'ตรวจอาหาร',         desc: 'เกรด A-F + ส่วนผสม' },
  { href: '/hospital',    icon: '🏥', title: 'หาโรงพยาบาล',       desc: 'GPS ใกล้ฉัน' },
  { href: '/compare',     icon: '⚖️', title: 'เปรียบเทียบ',       desc: 'เทียบ 3 ยี่ห้อ' },
  { href: '/vaccine',     icon: '💉', title: 'วัคซีน',             desc: 'คำนวณตาราง' },
  { href: '/cost',        icon: '💰', title: 'ค่าใช้จ่าย',         desc: 'ประมาณรายเดือน' },
  { href: '/age',         icon: '🎂', title: 'คำนวณอายุ',          desc: 'เทียบอายุมนุษย์' },
  { href: '/adopt',       icon: '🐾', title: 'รับเลี้ยง',          desc: 'องค์กรช่วยสัตว์' },
  { href: '/toxic',       icon: '⚠️', title: 'อาหารต้องห้าม',      desc: '12 อาหารอันตราย' },
  { href: '/emergency',   icon: '🚨', title: 'ฉุกเฉิน',            desc: 'คู่มือเร่งด่วน' },
  { href: '/ingredients', icon: '🔬', title: 'ส่วนผสมอันตราย',     desc: 'BHA, BHT + อื่นๆ' },
  { href: '/tips',          icon: '📚', title: 'เคล็ดลับ',           desc: '15 คำถามยอดนิยม' },
  { href: '/newpet',        icon: '🆕', title: 'เลี้ยงน้องใหม่',     desc: 'เช็คลิสต์ 20 ข้อ' },
  { href: '/dental',        icon: '🦷', title: 'ดูแลฟัน',            desc: 'แปรง/สเกลฟัน' },
  { href: '/deworming',     icon: '🪱', title: 'ถ่ายพยาธิ',          desc: 'ตารางและวิธีการ' },
  { href: '/checklist',     icon: '✅', title: 'เช็คลิสต์รายสัปดาห์',desc: 'ติดตามการดูแลน้อง' },
  { href: '/hospital/surgery', icon: '🔪', title: 'ผ่าตัด/ทำหมัน',   desc: 'โรงพยาบาลที่มีห้องผ่าตัด' },
  { href: '/flea',             icon: '🦟', title: 'กำจัดหมัด/เห็บ',  desc: 'ยา วิธีกำจัด ป้องกัน' },
  { href: '/grooming',         icon: '🪮', title: 'ดูแลขน/Grooming', desc: 'อาบน้ำ แปรงขน ตัดเล็บ' },
  { href: '/food/puppy',       icon: '🐶', title: 'อาหาร Puppy',      desc: 'ลูกสุนัข/ลูกแมว' },
  { href: '/training',         icon: '🎓', title: 'ฝึกสุนัข',         desc: 'คำสั่งพื้นฐาน positive' },
  { href: '/microchip',        icon: '📡', title: 'ไมโครชิป',          desc: 'ขั้นตอนและราคา' },
  { href: '/insurance',        icon: '🛡️', title: 'ประกันสัตว์เลี้ยง', desc: 'เปรียบเทียบแผน' },
  { href: '/first-aid',        icon: '🩹', title: 'ปฐมพยาบาล',          desc: 'ก่อนพาไปหาหมอ' },
  { href: '/potty-training',   icon: '🚽', title: 'ฝึกฉี่ถูกที่',        desc: 'สุนัขและแมว' },
  { href: '/weight',           icon: '⚖️', title: 'ประเมินน้ำหนัก',      desc: 'BCS 1-9 เช็คอ้วนผอม' },
  { href: '/cat-behavior',     icon: '🐱', title: 'พฤติกรรมแมว',          desc: 'ทำไมแมวถึง...' },
  { href: '/neutering',        icon: '✂️', title: 'ทำหมัน',               desc: 'ประโยชน์ ราคา ดูแลหลัง' },
  { href: '/heartworm',        icon: '🦟', title: 'พยาธิหัวใจ',            desc: 'ป้องกัน ยาที่ใช้ อาการ' },
  { href: '/allergy',          icon: '🤧', title: 'แพ้อาหาร',              desc: 'อาการ + elimination diet' },
  { href: '/travel',           icon: '✈️', title: 'เดินทางกับน้อง',         desc: 'สายการบิน เอกสาร' },
  { href: '/anxiety',          icon: '😰', title: 'แยกเจ้าของไม่ได้',        desc: 'separation anxiety' },
  { href: '/kidney-disease',   icon: '🫘', title: 'โรคไต CKD',               desc: 'อาการ อาหาร ดูแลที่บ้าน' },
  { href: '/raw-food',         icon: '🥩', title: 'อาหาร Raw/BARF',           desc: 'ข้อดี เสี่ยง วิธีทำ' },
  { href: '/heatstroke',       icon: '☀️', title: 'โรคลมแดด',                desc: 'ฉุกเฉิน ปฐมพยาบาล' },
  { href: '/dog-behavior',     icon: '🐕', title: 'พฤติกรรมสุนัข',           desc: 'เห่า กัด ขุด ภาษากาย' },
  { href: '/breeds',           icon: '🐾', title: 'สายพันธุ์ยอดนิยม',        desc: '12 สายพันธุ์ในไทย' },
  { href: '/supplements',      icon: '💊', title: 'อาหารเสริม',               desc: 'โอเมก้า 3 กลูโคซามีน โพรไบโอติก' },
  { href: '/guides',           icon: '📚', title: 'คู่มือทั้งหมด',            desc: 'รวมทุกเรื่องที่ต้องรู้' },
  { href: '/symptoms',         icon: '🩺', title: 'ตรวจอาการ',               desc: 'น้องป่วย ต้องพาหมอไหม?' },
  { href: '/breed-quiz',       icon: '🐾', title: 'ค้นหาสายพันธุ์',          desc: 'แบบทดสอบ 4 คำถาม' },
  { href: '/my-pet',           icon: '📋', title: 'โปรไฟล์น้อง',             desc: 'ติดตามวัคซีน ถ่ายพยาธิ' },
  { href: '/diarrhea',         icon: '💩', title: 'ท้องเสีย',                desc: 'ดูแลที่บ้านหรือต้องพาหมอ' },
  { href: '/not-eating',       icon: '🍽️', title: 'ไม่กินอาหาร',            desc: 'สาเหตุและวิธีแก้' },
  { href: '/food-quiz',        icon: '🍖', title: 'แบบทดสอบอาหาร',           desc: 'อาหารไหนเหมาะกับน้อง?' },
  { href: '/vomiting',         icon: '🤢', title: 'อาเจียน',                 desc: 'ดูสีที่อาเจียน รู้สาเหตุ' },
  { href: '/urinary',          icon: '🚽', title: 'ทางเดินปัสสาวะ',          desc: 'FLUTD แมวปัสสาวะลำบาก' },
  { href: '/obesity',          icon: '⚖️', title: 'น้องอ้วน',               desc: 'BCS ตรวจด้วยมือ + ลดน้ำหนัก' },
  { href: '/skin',             icon: '🐾', title: 'โรคผิวหนัง',              desc: 'คัน ขนร่วง ผิวแดง' },
]

export default function HomePage() {
  return (
    <main>
      {/* ── HERO (full-bleed gradient) ──────────────────────────────── */}
      <div className="-mx-4 -mt-8 bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 px-4 pt-12 pb-16 mb-0 relative overflow-hidden">
        {/* Decorative paw prints */}
        <div className="absolute top-4 right-8 text-white/10 text-8xl select-none pointer-events-none">🐾</div>
        <div className="absolute bottom-8 left-4 text-white/10 text-6xl select-none pointer-events-none rotate-12">🐾</div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 backdrop-blur-sm border border-white/30">
            🇹🇭 แหล่งข้อมูลสัตว์เลี้ยงอันดับ 1 ของไทย
          </div>

          <p className="text-white/80 text-sm font-bold tracking-wide mb-2">🐾 PetBKK</p>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
            ตรวจสอบอาหารสัตว์เลี้ยง · หาโรงพยาบาลสัตว์ใกล้คุณ
          </h1>
          <p className="text-white/85 text-base sm:text-lg font-medium mb-8 leading-relaxed">
            เช็คส่วนผสมและเกรด A–F ของอาหาร 986 รายการ ค้นโรงพยาบาลสัตว์ 503 แห่งทั่วไทย<br/>
            <span className="text-white/70 text-sm sm:text-base">ดูแลน้องได้ครบ ฟรี 100%</span>
          </p>

          {/* Search bars */}
          <HomeSearchBars />

          {/* Quick chips */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {[...FOOD_CHIPS, ...HOSPITAL_CHIPS].map(c => (
              <a key={c.href} href={c.href}
                className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium backdrop-blur-sm border border-white/20 transition-all">
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS strip (overlapping hero) ─────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 -mt-6 mb-8 relative z-10">
        <div className="grid grid-cols-3 gap-3">
          {STATS.map(s => (
            <div key={s.label} className="bg-white rounded-2xl shadow-md border border-orange-50 px-2 py-4 text-center">
              <p className="text-lg mb-0.5">{s.icon}</p>
              <p className="text-xl font-black text-orange-500">{s.num}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PET PROFILE ─────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4">
        <PetProfileSetup />
        <PersonalizedFoodRecs />
      </div>

      {/* ── RECENTLY VIEWED ─────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4">
        <RecentFoods />
      </div>

      {/* ── POPULAR FOODS ───────────────────────────────────────────── */}
      <PopularFoods />

      {/* ── TOOLS GRID ──────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <h2 className="text-base font-black text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-orange-400 rounded-full inline-block"></span>
          เครื่องมือสำหรับเจ้าของน้อง
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {TOOLS.map(tool => (
            <a key={tool.href} href={tool.href}
              className="bg-white rounded-2xl border border-gray-100 p-3 hover:shadow-md hover:border-orange-200 hover:-translate-y-0.5 transition-all group text-center">
              <p className="text-2xl mb-1.5">{tool.icon}</p>
              <p className="font-bold text-xs text-gray-800 group-hover:text-orange-600 transition-colors leading-tight">{tool.title}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug hidden sm:block">{tool.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* ── ADOPTION CTA ────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 pb-4">
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-6 text-center text-white relative overflow-hidden">
          <div className="absolute top-2 right-4 text-white/10 text-6xl select-none pointer-events-none">🐾</div>
          <p className="text-3xl mb-2 relative z-10">🐾</p>
          <p className="font-black text-xl mb-1 relative z-10">อย่าซื้อ — ให้รับเลี้ยงแทน</p>
          <p className="text-white/80 text-sm mb-4 relative z-10">สัตว์จรจัดในไทยกว่า 5 ล้านตัวรอบ้านใหม่</p>
          <a href="/adopt"
            className="inline-block px-6 py-2.5 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors text-sm shadow-sm relative z-10">
            ดูรายชื่อองค์กรรับเลี้ยง →
          </a>
        </div>
      </div>
    </main>
  )
}
