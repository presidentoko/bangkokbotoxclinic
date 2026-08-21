import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'นโยบายความเป็นส่วนตัว',
  description:
    'ThailandPetHub เก็บข้อมูลอะไรบ้าง ใช้คุกกี้อย่างไร และคุณมีสิทธิ์อะไรตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)',
  alternates: { canonical: 'https://www.thailandpethub.com/privacy' },
}

const UPDATED = '21 สิงหาคม 2569'

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-7 scroll-mt-24">
      <h2 className="text-base font-bold text-gray-900 mb-2">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

/**
 * A privacy policy that describes what this site actually does, rather than a
 * generic template. Every claim below is checkable against the code: the
 * storage keys are the ones components read, the two forms are the only two
 * API routes, and the analytics and ad scripts are gated on environment
 * variables in components/Analytics.tsx.
 */
export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto">
      <nav aria-label="breadcrumb" className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">นโยบายความเป็นส่วนตัว</span>
      </nav>

      <h1 className="text-2xl font-black text-gray-900 mb-1">นโยบายความเป็นส่วนตัว</h1>
      <p className="text-xs text-gray-400 mb-6">ปรับปรุงล่าสุด {UPDATED}</p>

      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-7">
        <p className="text-sm text-gray-700 leading-relaxed">
          สรุปสั้น ๆ: <strong>เราไม่มีระบบสมาชิกและไม่ขายข้อมูลของคุณ</strong>{' '}
          ข้อมูลสัตว์เลี้ยงที่คุณกรอก (ชื่อ ช่วงวัย รายการที่บันทึกไว้)
          ถูกเก็บไว้ในเบราว์เซอร์ของคุณเองเท่านั้น ไม่ได้ส่งมาที่เซิร์ฟเวอร์ของเรา
          สิ่งที่ส่งมาถึงเราคือข้อความที่คุณกรอกในแบบฟอร์มติดต่อและอีเมลที่สมัครรับข่าวสารเท่านั้น
        </p>
      </div>

      <Section id="collect" title="1. ข้อมูลที่เก็บไว้ในเครื่องของคุณ">
        <p>
          เว็บไซต์ใช้ <strong>localStorage</strong> ของเบราว์เซอร์เพื่อจำการตั้งค่าของคุณ
          ข้อมูลเหล่านี้อยู่ในเครื่องของคุณ ไม่ถูกส่งมาที่เซิร์ฟเวอร์ และลบได้ทุกเมื่อ
          โดยการล้างข้อมูลเว็บไซต์ในเบราว์เซอร์:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>โปรไฟล์สัตว์เลี้ยง — ชื่อ ประเภท ช่วงวัย และรายละเอียดที่กรอกในหน้า “สัตว์เลี้ยงของฉัน”</li>
          <li>รายการอาหารและโรงพยาบาลที่คุณกดบันทึกหรือเปรียบเทียบ</li>
          <li>ประวัติสินค้าที่เพิ่งดู เพื่อแสดงกลับให้คุณ</li>
          <li>การเตือนวัคซีนที่คุณตั้งไว้เอง</li>
          <li>สถานะการปิดกล่องแนะนำติดตั้งแอป</li>
        </ul>
        <p>
          เว็บไซต์ยังติดตั้ง <strong>Service Worker</strong> เพื่อให้เปิดหน้าที่เคยดูได้เร็วขึ้นและใช้งานแบบออฟไลน์ได้บางส่วน
          ซึ่งเก็บเฉพาะไฟล์หน้าเว็บ ไม่ใช่ข้อมูลส่วนตัว
        </p>
      </Section>

      <Section id="send" title="2. ข้อมูลที่คุณส่งมาให้เรา">
        <p>มีเพียงสองช่องทางที่ข้อมูลถูกส่งมาถึงทีมงาน:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>แบบฟอร์มติดต่อ</strong> — ข้อความและข้อมูลติดต่อที่คุณกรอก
            ถูกส่งต่อเข้าแชทภายในของทีมงานผ่าน Telegram เพื่อให้เราตอบกลับได้
          </li>
          <li>
            <strong>สมัครรับข่าวสาร</strong> — เก็บเฉพาะอีเมลที่คุณกรอก
            ใช้เพื่อส่งข้อมูลดูแลสัตว์เลี้ยงเท่านั้น ไม่ส่งต่อให้บุคคลที่สาม
          </li>
        </ul>
        <p>
          หากต้องการให้ลบข้อมูลที่ส่งมา แจ้งได้ที่{' '}
          <a href="/contact" className="text-orange-600 hover:underline">หน้าติดต่อเรา</a>{' '}
          เราจะดำเนินการภายใน 30 วัน
        </p>
      </Section>

      <Section id="cookies" title="3. คุกกี้ การวิเคราะห์ และโฆษณา">
        <p>
          เราใช้ <strong>Google Analytics</strong> เพื่อดูภาพรวมว่าหน้าไหนมีคนอ่าน
          ข้อมูลที่ได้เป็นสถิติรวม ไม่ระบุตัวบุคคล
        </p>
        <p>
          เว็บไซต์นี้มีรายได้จากโฆษณา และแสดงโฆษณาผ่าน <strong>Google AdSense</strong>{' '}
          ซึ่งเป็นผู้ให้บริการภายนอก:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Google และพันธมิตรอาจใช้คุกกี้เพื่อแสดงโฆษณาที่เกี่ยวข้องกับความสนใจของคุณ
            โดยอ้างอิงจากการเข้าชมเว็บไซต์นี้และเว็บไซต์อื่น
          </li>
          <li>
            คุณปิดการใช้โฆษณาเฉพาะบุคคลได้ที่{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-orange-600 hover:underline"
            >
              การตั้งค่าโฆษณาของ Google
            </a>
          </li>
          <li>
            อ่านวิธีที่ Google ใช้ข้อมูลจากเว็บไซต์พันธมิตรได้ที่{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-orange-600 hover:underline"
            >
              policies.google.com
            </a>
          </li>
        </ul>
        <p>
          โฆษณาทุกชิ้นบนเว็บไซต์จะมีคำว่า “โฆษณา” กำกับไว้เสมอ
          และเราไม่ให้ผู้ลงโฆษณาเข้ามาแก้ไขอันดับหรือเกรดของข้อมูลที่เราเผยแพร่
        </p>
      </Section>

      <Section id="affiliate" title="4. ลิงก์ไปยังร้านค้า">
        <p>
          ลิงก์ “ซื้อ” บนหน้าสินค้าอาจเป็นลิงก์พันธมิตร (affiliate)
          หากคุณซื้อสินค้าผ่านลิงก์นั้น เราอาจได้รับค่าตอบแทนเล็กน้อยโดยที่คุณไม่ต้องจ่ายเพิ่ม
          ลิงก์เหล่านี้ถูกกำกับด้วย <code className="text-xs bg-gray-100 px-1 rounded">rel=&quot;sponsored&quot;</code>{' '}
          และ<strong>ไม่มีผลต่อเกรดหรือลำดับ</strong>ที่แสดงบนเว็บไซต์
        </p>
      </Section>

      <Section id="rights" title="5. สิทธิของคุณตาม PDPA">
        <p>
          ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 คุณมีสิทธิ์ขอเข้าถึง แก้ไข ลบ
          คัดค้านการประมวลผล หรือขอให้ระงับการใช้ข้อมูลส่วนบุคคลของคุณ
          เนื่องจากเราเก็บข้อมูลน้อยมาก การใช้สิทธิ์ส่วนใหญ่ทำได้ทันทีด้วยตัวคุณเอง
          โดยล้างข้อมูลเว็บไซต์ในเบราว์เซอร์ สำหรับข้อมูลที่ส่งมาทางแบบฟอร์ม
          ติดต่อเราได้ที่{' '}
          <a href="/contact" className="text-orange-600 hover:underline">หน้าติดต่อเรา</a>
        </p>
      </Section>

      <Section id="children" title="6. ผู้เยาว์">
        <p>
          เว็บไซต์นี้ให้ข้อมูลเกี่ยวกับการดูแลสัตว์เลี้ยง ไม่ได้มุ่งเป้าไปที่เด็กอายุต่ำกว่า 13 ปี
          และเราไม่ได้ตั้งใจเก็บข้อมูลจากผู้เยาว์
        </p>
      </Section>

      <Section id="disclaimer" title="7. ข้อจำกัดความรับผิด">
        <p>
          ข้อมูลบนเว็บไซต์นี้จัดทำขึ้นเพื่อการศึกษา <strong>ไม่ใช่คำวินิจฉัยหรือคำแนะนำทางสัตวแพทย์</strong>{' '}
          กรุณาปรึกษาสัตวแพทย์สำหรับอาการของสัตว์เลี้ยงของคุณเสมอ
          ข้อมูลโรงพยาบาลและอาหารมาจากแหล่งสาธารณะและอาจเปลี่ยนแปลงได้
          กรุณาตรวจสอบกับสถานพยาบาลหรือฉลากสินค้าก่อนตัดสินใจ
        </p>
      </Section>

      <Section id="changes" title="8. การเปลี่ยนแปลงนโยบาย">
        <p>
          หากมีการแก้ไขนโยบายนี้ เราจะปรับวันที่ด้านบน
          การเปลี่ยนแปลงที่มีนัยสำคัญจะแจ้งไว้บนหน้าเว็บไซต์
        </p>
      </Section>

      <div className="border-t border-gray-100 pt-5 mt-8 text-sm text-gray-500">
        <p>
          มีคำถามเรื่องข้อมูลส่วนบุคคล?{' '}
          <a href="/contact" className="text-orange-600 hover:underline font-medium">ติดต่อเรา</a>
          {' · '}
          <a href="/about" className="text-orange-600 hover:underline">เกี่ยวกับเรา</a>
        </p>
      </div>
    </main>
  )
}
