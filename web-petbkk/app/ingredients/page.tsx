import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'สารอันตรายในอาหารสัตว์เลี้ยง — PetBKK',
  description: 'รายการสารเคมีและส่วนประกอบที่ควรหลีกเลี่ยงในอาหารสุนัขและแมว พร้อมคำอธิบาย',
}

interface Ingredient {
  name: string
  aliases?: string[]
  risk: 'high' | 'medium'
  why: string
}

interface Group {
  grade: 'black' | 'red'
  label: string
  color: string
  bgColor: string
  items: Ingredient[]
}

const GROUPS: Group[] = [
  {
    grade: 'black',
    label: 'อันตราย (สีดำ) — ควรหลีกเลี่ยงอย่างเด็ดขาด',
    color: 'text-gray-900',
    bgColor: 'bg-gray-900',
    items: [
      {
        name: 'BHA (Butylated Hydroxyanisole)',
        risk: 'high',
        why: 'สารกันหืนสังเคราะห์ที่ IARC จัดเป็น "อาจก่อมะเร็ง" ในมนุษย์ ห้ามใช้ในอาหารมนุษย์หลายประเทศ',
      },
      {
        name: 'BHT (Butylated Hydroxytoluene)',
        risk: 'high',
        why: 'สารกันหืนสังเคราะห์คล้าย BHA มีความเสี่ยงการก่อมะเร็งและผลต่อตับและไต',
      },
      {
        name: 'Ethoxyquin',
        risk: 'high',
        why: 'สารกันหืนที่ถูกแบนในอาหารมนุษย์ในหลายประเทศ เชื่อมโยงกับมะเร็งตับและไต',
      },
      {
        name: 'Propylene Glycol',
        risk: 'high',
        why: 'ห้ามใช้ในอาหารแมวโดย FDA สามารถทำลายเม็ดเลือดแดงของแมว ทำให้เกิดโรคเลือด',
      },
      {
        name: 'Artificial Colors (Red 40, Yellow 5, Blue 2)',
        aliases: ['สีสังเคราะห์', 'Tartrazine', 'Sunset Yellow'],
        risk: 'high',
        why: 'สีย้อมสังเคราะห์ที่ไม่จำเป็นสำหรับสัตว์เลี้ยง (สัตว์ไม่ได้เลือกอาหารด้วยสี) เชื่อมโยงกับภูมิแพ้และสมาธิสั้น',
      },
      {
        name: 'Carrageenan',
        risk: 'high',
        why: 'สารเพิ่มความข้นจากสาหร่าย พบว่าก่อการอักเสบในทางเดินอาหาร เชื่อมโยงกับลำไส้ใหญ่อักเสบ',
      },
    ],
  },
  {
    grade: 'red',
    label: 'ควรระวัง (สีแดง) — ใช้ได้แต่ควรจำกัดปริมาณ',
    color: 'text-red-700',
    bgColor: 'bg-red-500',
    items: [
      {
        name: 'Corn Syrup / Sugar',
        aliases: ['น้ำตาล', 'กลูโคส', 'ฟรุกโตส'],
        risk: 'medium',
        why: 'น้ำตาลไม่จำเป็นในอาหารสัตว์เลี้ยง ทำให้อ้วน ฟันผุ และเพิ่มความเสี่ยงเบาหวาน',
      },
      {
        name: 'Meat by-products',
        aliases: ['เนื้อสัตว์เศษเหลือ', 'by-product meal'],
        risk: 'medium',
        why: 'วัตถุดิบคุณภาพต่ำ ไม่ระบุชนิดสัตว์ ประกอบด้วยอวัยวะ กระดูก ขน ที่ไม่เหมาะสมสำหรับอาหาร',
      },
      {
        name: 'Salt (เกลือมากเกินไป)',
        aliases: ['Sodium Chloride'],
        risk: 'medium',
        why: 'เกลือเล็กน้อยจำเป็น แต่ปริมาณมากเกินทำลายไตโดยเฉพาะในสัตว์สูงวัยหรือที่มีโรคไต',
      },
      {
        name: 'Wheat Gluten / Corn Gluten',
        risk: 'medium',
        why: 'ใช้เป็นแหล่งโปรตีนราคาถูกแทนเนื้อสัตว์จริง บางตัวแพ้กลูเตน ทำให้เกิดปัญหาทางเดินอาหาร',
      },
      {
        name: 'Generic "Animal Fat"',
        aliases: ['ไขมันสัตว์', 'Poultry Fat (ไม่ระบุชนิด)'],
        risk: 'medium',
        why: 'ไม่ระบุแหล่งที่มา อาจมาจากสัตว์ที่ไม่ผ่านมาตรฐาน คุณภาพผันแปรมาก',
      },
    ],
  },
]

export default function IngredientsPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-1">🔬 ส่วนผสมอันตราย</h1>
      <p className="text-sm text-gray-400 mb-6">รู้จักส่วนผสมที่ควรหลีกเลี่ยงในอาหารสัตว์เลี้ยง</p>

      <div className="space-y-8">
        {GROUPS.map(group => (
          <section key={group.grade}>
            {group.grade === 'black' ? (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">⛔</span>
                <h2 className="text-lg font-black text-gray-900">หลีกเลี่ยงอย่างเคร่งครัด</h2>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">อันตรายมาก</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">⚠️</span>
                <h2 className="text-lg font-black text-gray-900">ควรระวัง</h2>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">จำกัดปริมาณ</span>
              </div>
            )}
            <div className="space-y-3">
              {group.items.map(item => (
                <div key={item.name} className={`bg-white rounded-xl border p-4 border-l-4 ${
                  group.grade === 'black' ? 'border-l-red-500' : 'border-l-orange-400'
                }`}>
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                    <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.risk === 'high' ? 'bg-gray-900 text-white' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.risk === 'high' ? 'อันตราย' : 'ระวัง'}
                    </span>
                  </div>
                  {item.aliases && (
                    <p className="text-xs text-gray-400 mb-2">รู้จักในชื่อ: {item.aliases.join(', ')}</p>
                  )}
                  <p className="text-sm text-gray-600 leading-relaxed">{item.why}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 bg-green-50 border border-green-100 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">✅</span>
          <h2 className="text-lg font-black text-gray-900">ส่วนผสมที่ดี</h2>
          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">แนะนำ</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
          {[
            { name: 'Chicken / Beef / Fish (ระบุชนิดชัดเจน)', desc: 'เนื้อสัตว์จริง คุณภาพดี' },
            { name: 'Sweet Potato / Pumpkin', desc: 'คาร์โบไฮเดรตดี ย่อยง่าย' },
            { name: 'Salmon Oil / Fish Oil', desc: 'โอเมก้า-3 ดีต่อผิวหนังและสมอง' },
            { name: 'Mixed Tocopherols (Vitamin E)', desc: 'สารกันหืนธรรมชาติ ปลอดภัย' },
            { name: 'Blueberry / Cranberry', desc: 'แอนตี้ออกซิแดนท์ธรรมชาติ' },
            { name: 'Probiotics (Lactobacillus)', desc: 'ดีต่อลำไส้และระบบภูมิคุ้มกัน' },
          ].map(item => (
            <div key={item.name} className="bg-white rounded-xl border border-l-4 border-l-green-500 p-3 flex items-start gap-2">
              <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <a href="/food" className="inline-block px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm">
          ตรวจสอบอาหารของน้อง →
        </a>
      </div>
    </main>
  )
}
