export interface NavItem { href: string; label: string }
export interface NavGroup { title: string; items: NavItem[] }

export const NAV_PRIMARY: NavItem[] = [
  { href: '/food',      label: '🍖 อาหาร' },
  { href: '/hospital',  label: '🏥 โรงพยาบาล' },
  { href: '/adopt',     label: '🐾 รับเลี้ยงแทนการซื้อ' },
  { href: '/guides',    label: '📚 คู่มือทั้งหมด' },
  { href: '/emergency', label: '🚨 ฉุกเฉิน' },
]

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'เครื่องมือยอดนิยม',
    items: [
      { href: '/my-pet',     label: '🐾 โปรไฟล์น้อง' },
      { href: '/compare',    label: '⚖️ เปรียบเทียบ' },
      { href: '/cost',       label: '💰 ค่าใช้จ่าย' },
      { href: '/age',        label: '🎂 คำนวณอายุ' },
      { href: '/vaccine',    label: '💉 วัคซีน' },
      { href: '/checklist',  label: '✅ เช็คลิสต์' },
      { href: '/symptoms',   label: '🩺 ตรวจอาการ' },
      { href: '/breed-quiz', label: '🐾 ค้นหาสายพันธุ์' },
      { href: '/food-quiz',  label: '🍖 แบบทดสอบอาหาร' },
      { href: '/saved',      label: '❤️ บันทึก' },
    ],
  },
  {
    title: 'ดูแลสุขภาพ',
    items: [
      { href: '/hospital/surgery', label: '🔪 ทำหมัน/ผ่าตัด' },
      { href: '/dental',           label: '🦷 ดูแลฟัน' },
      { href: '/deworming',        label: '🪱 ถ่ายพยาธิ' },
      { href: '/flea',             label: '🦟 หมัด/เห็บ' },
      { href: '/heartworm',        label: '🦟 พยาธิหัวใจ' },
      { href: '/allergy',          label: '🤧 แพ้อาหาร' },
      { href: '/kidney-disease',   label: '🫘 โรคไต' },
      { href: '/first-aid',        label: '🩹 ปฐมพยาบาล' },
      { href: '/microchip',        label: '📡 ไมโครชิป' },
      { href: '/insurance',        label: '🛡️ ประกัน' },
      { href: '/neutering',        label: '✂️ ทำหมัน' },
      { href: '/weight',           label: '⚖️ น้ำหนัก' },
      { href: '/heatstroke',       label: '☀️ ลมแดด' },
      { href: '/diarrhea',         label: '💩 ท้องเสีย' },
      { href: '/not-eating',       label: '🍽️ ไม่กินอาหาร' },
    ],
  },
  {
    title: 'พฤติกรรม & การฝึก',
    items: [
      { href: '/training',       label: '🎓 ฝึกสุนัข' },
      { href: '/potty-training', label: '🚽 ฝึกฉี่ถูกที่' },
      { href: '/cat-behavior',   label: '🐱 พฤติกรรมแมว' },
      { href: '/dog-behavior',   label: '🐕 พฤติกรรมสุนัข' },
      { href: '/anxiety',        label: '😰 แยกไม่ได้' },
      { href: '/breeds',         label: '🐾 สายพันธุ์' },
      { href: '/grooming',       label: '🪮 Grooming' },
    ],
  },
  {
    title: 'อื่นๆ',
    items: [
      { href: '/food/senior', label: '👴 อาหาร Senior' },
      { href: '/food/budget', label: '💰 อาหารประหยัด' },
      { href: '/food/puppy',  label: '🐶 อาหาร Puppy' },
      { href: '/toxic',       label: '⚠️ อาหารต้องห้าม' },
      { href: '/newpet',      label: '🆕 เลี้ยงใหม่' },
      { href: '/travel',      label: '✈️ เดินทาง' },
      { href: '/raw-food',    label: '🥩 Raw Food' },
      { href: '/ingredients', label: '🔬 ส่วนผสม' },
      { href: '/tips',        label: '📚 เคล็ดลับ' },
    ],
  },
]
