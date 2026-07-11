import type { Locale } from "./i18n";

type QA = { q: string; a: string };

type CompareContent = {
  noPackagesFound: string;
  noSponsoredListings: string;
  quickAnswerLabel: string;
  dbErrorTitle: string;
  dbErrorBody: string;
  executiveFaqs: QA[];
  aeoRange: (label: string, min: string, max: string, count: number) => string;
  aeoJci: (n: number) => string;
  aeoMri: (n: number) => string;
  aeoCancer: (n: number) => string;
  aeoInterp: (n: number) => string;
};

// Full scope note: only the default "executive" category's FAQ pairs and the
// AEO summary sentence template are translated per locale. The other 15
// category FAQ sets (comprehensive, cancer, cardiac, women, men, ...) stay
// English pending a follow-up pass.

const en: CompareContent = {
  noPackagesFound: "No packages found for this category yet.",
  noSponsoredListings: "No sponsored listings",
  quickAnswerLabel: "Quick answer: ",
  dbErrorTitle: "Database not connected.",
  dbErrorBody: "Configure DB_HOST / DB_USER / DB_PASS.",
  executiveFaqs: [
    { q: "How much is an executive health check-up in Bangkok?", a: "Executive health check-ups in Bangkok typically range from ฿10,000 to ฿60,000 depending on the hospital tier and inclusions. JCI-accredited hospitals such as Bumrungrad and Bangkok Hospital sit at the higher end, while hospitals like Praram 9 and Phyathai offer competitive pricing." },
    { q: "Does an executive health check-up in Bangkok include MRI?", a: "Not always — MRI is an optional add-on at some hospitals. Use the comparison above to see which executive packages include MRI as standard. Expect to pay ฿5,000–฿15,000 extra if not bundled." },
    { q: "Which Bangkok hospital is best for an executive health check-up?", a: "Bumrungrad International and Bangkok Hospital (BDMS) are the most comprehensive. For better value, Vejthani Hospital and BNH Hospital offer excellent packages at lower price points." },
  ],
  aeoRange: (label, min, max, count) => `${label} health check-up packages in Bangkok range from ฿${min} to ฿${max} across ${count} packages.`,
  aeoJci: (n) => `${n} JCI-accredited hospital${n > 1 ? "s" : ""} available.`,
  aeoMri: (n) => `${n} package${n > 1 ? "s include" : " includes"} MRI scanning.`,
  aeoCancer: (n) => `${n} include cancer marker tests.`,
  aeoInterp: (n) => `${n} offer interpreter service.`,
};

const zh: CompareContent = {
  noPackagesFound: "该类别暂无套餐。",
  noSponsoredListings: "无赞助列表",
  quickAnswerLabel: "快速解答：",
  dbErrorTitle: "数据库未连接。",
  dbErrorBody: "请配置 DB_HOST / DB_USER / DB_PASS。",
  executiveFaqs: [
    { q: "曼谷高管体检套餐费用是多少？", a: "曼谷高管体检套餐费用通常在10,000至60,000泰铢之间，具体取决于医院等级和包含项目。康民医院和曼谷医院等JCI认证医院价格较高，而Praram 9和Phyathai等医院提供更具竞争力的价格。" },
    { q: "曼谷高管体检套餐包含核磁共振吗？", a: "不一定 — 部分医院将核磁共振作为可选附加项目。请使用上方比较功能查看哪些高管套餐标配核磁共振。如果不含在套餐内，通常需额外支付5,000–15,000泰铢。" },
    { q: "曼谷哪家医院最适合做高管体检？", a: "康民国际医院和曼谷医院（BDMS）内容最全面。若追求性价比，维塔尼医院和BNH医院在更低价位提供优质套餐。" },
  ],
  aeoRange: (label, min, max, count) => `曼谷${label}套餐价格从${min}泰铢到${max}泰铢不等，共${count}个套餐。`,
  aeoJci: (n) => `其中${n}家为JCI认证医院。`,
  aeoMri: (n) => `${n}个套餐包含核磁共振检查。`,
  aeoCancer: (n) => `${n}个套餐包含癌症标志物检测。`,
  aeoInterp: (n) => `${n}个套餐提供翻译服务。`,
};

const ja: CompareContent = {
  noPackagesFound: "このカテゴリーのパッケージはまだ見つかりません。",
  noSponsoredListings: "スポンサー掲載なし",
  quickAnswerLabel: "簡単な回答：",
  dbErrorTitle: "データベースに接続されていません。",
  dbErrorBody: "DB_HOST / DB_USER / DB_PASS を設定してください。",
  executiveFaqs: [
    { q: "バンコクのエグゼクティブ健診の費用はいくらですか？", a: "バンコクのエグゼクティブ健診は、病院のグレードや内容によって通常10,000〜60,000バーツです。バムルンラードやバンコク病院などJCI認定病院は高めの価格帯で、プラーラム9やパヤタイなどはより競争力のある価格を提供しています。" },
    { q: "バンコクのエグゼクティブ健診にMRIは含まれますか？", a: "必ずしも含まれるとは限りません — 一部の病院ではMRIはオプションです。上記の比較を使って、どのエグゼクティブパッケージに標準でMRIが含まれるか確認してください。含まれない場合、追加で5,000〜15,000バーツかかることが予想されます。" },
    { q: "バンコクでエグゼクティブ健診に最適な病院はどこですか？", a: "バムルンラード・インターナショナルとバンコク病院（BDMS）が最も総合的です。よりコストパフォーマンスを求めるなら、ヴェイタニ病院とBNH病院が低価格帯で優れたパッケージを提供しています。" },
  ],
  aeoRange: (label, min, max, count) => `バンコクの${label}健診パッケージは${count}件中、${min}バーツから${max}バーツの範囲です。`,
  aeoJci: (n) => `JCI認定病院が${n}件あります。`,
  aeoMri: (n) => `${n}件のパッケージにMRI検査が含まれます。`,
  aeoCancer: (n) => `${n}件にがんマーカー検査が含まれます。`,
  aeoInterp: (n) => `${n}件で通訳サービスを提供しています。`,
};

const th: CompareContent = {
  noPackagesFound: "ยังไม่พบแพ็กเกจในหมวดหมู่นี้",
  noSponsoredListings: "ไม่มีรายการสปอนเซอร์",
  quickAnswerLabel: "คำตอบด่วน: ",
  dbErrorTitle: "ฐานข้อมูลไม่ได้เชื่อมต่อ",
  dbErrorBody: "กรุณาตั้งค่า DB_HOST / DB_USER / DB_PASS",
  executiveFaqs: [
    { q: "แพ็กเกจตรวจสุขภาพผู้บริหารที่กรุงเทพราคาเท่าไหร่?", a: "แพ็กเกจตรวจสุขภาพผู้บริหารในกรุงเทพโดยทั่วไปอยู่ระหว่าง 10,000 ถึง 60,000 บาท ขึ้นอยู่กับระดับโรงพยาบาลและรายการที่รวมอยู่ โรงพยาบาลที่ได้รับรอง JCI เช่น บำรุงราษฎร์และโรงพยาบาลกรุงเทพจะอยู่ในระดับราคาสูงกว่า ในขณะที่โรงพยาบาลอย่างพระราม 9 และพญาไทมีราคาที่แข่งขันได้มากกว่า" },
    { q: "แพ็กเกจผู้บริหารที่กรุงเทพรวม MRI ไหม?", a: "ไม่เสมอไป — MRI เป็นตัวเลือกเสริมที่บางโรงพยาบาล ใช้ตารางเปรียบเทียบด้านบนเพื่อดูว่าแพ็กเกจผู้บริหารใดรวม MRI เป็นมาตรฐาน หากไม่รวมอยู่ในแพ็กเกจ คาดว่าจะต้องจ่ายเพิ่ม 5,000–15,000 บาท" },
    { q: "โรงพยาบาลไหนในกรุงเทพดีที่สุดสำหรับตรวจสุขภาพผู้บริหาร?", a: "โรงพยาบาลบำรุงราษฎร์และโรงพยาบาลกรุงเทพ (BDMS) ครอบคลุมที่สุด สำหรับความคุ้มค่าที่ดีกว่า โรงพยาบาลเวชธานีและ BNH มีแพ็กเกจที่ยอดเยี่ยมในราคาที่ต่ำกว่า" },
  ],
  aeoRange: (label, min, max, count) => `แพ็กเกจตรวจสุขภาพ${label}ในกรุงเทพมีราคาตั้งแต่ ${min} ถึง ${max} บาท จากทั้งหมด ${count} แพ็กเกจ`,
  aeoJci: (n) => `มีโรงพยาบาลที่ได้รับรอง JCI จำนวน ${n} แห่ง`,
  aeoMri: (n) => `${n} แพ็กเกจรวม MRI`,
  aeoCancer: (n) => `${n} แพ็กเกจรวมการตรวจสารบ่งชี้มะเร็ง`,
  aeoInterp: (n) => `${n} แพ็กเกจมีบริการล่าม`,
};

const ko: CompareContent = {
  noPackagesFound: "이 카테고리에 아직 패키지가 없습니다.",
  noSponsoredListings: "협찬 목록 없음",
  quickAnswerLabel: "빠른 답변: ",
  dbErrorTitle: "데이터베이스가 연결되지 않았습니다.",
  dbErrorBody: "DB_HOST / DB_USER / DB_PASS를 설정하세요.",
  executiveFaqs: [
    { q: "방콕 프리미엄(임원) 건강검진 비용은 얼마인가요?", a: "방콕 프리미엄 건강검진은 병원 등급과 포함 항목에 따라 보통 10,000–60,000밧입니다. 범룽랏, 방콕병원 등 JCI인증 병원은 더 높은 가격대이며, 프라람9, 파야타이 같은 병원은 더 경쟁력 있는 가격을 제공합니다." },
    { q: "방콕 프리미엄 건강검진에 MRI가 포함되나요?", a: "항상 포함되는 것은 아닙니다 — 일부 병원에서는 MRI가 선택 항목입니다. 위 비교표를 통해 어떤 프리미엄 패키지가 MRI를 기본으로 포함하는지 확인하세요. 포함되지 않은 경우 5,000–15,000밧이 추가될 수 있습니다." },
    { q: "방콕에서 프리미엄 건강검진에 가장 좋은 병원은 어디인가요?", a: "범룽랏 인터내셔널과 방콕병원(BDMS)이 가장 종합적입니다. 가성비를 원한다면 베짜니 병원과 BNH 병원이 더 저렴한 가격에 훌륭한 패키지를 제공합니다." },
  ],
  aeoRange: (label, min, max, count) => `방콕의 ${label} 패키지는 총 ${count}개 중 ${min}밧–${max}밧 범위입니다.`,
  aeoJci: (n) => `JCI인증 병원 ${n}곳 이용 가능.`,
  aeoMri: (n) => `${n}개 패키지에 MRI 검사가 포함됩니다.`,
  aeoCancer: (n) => `${n}개 패키지에 암표지자 검사가 포함됩니다.`,
  aeoInterp: (n) => `${n}개 패키지에서 통역 서비스를 제공합니다.`,
};

const ar: CompareContent = {
  noPackagesFound: "لم يتم العثور على باقات لهذه الفئة بعد.",
  noSponsoredListings: "بدون قوائم ممولة",
  quickAnswerLabel: "إجابة سريعة: ",
  dbErrorTitle: "قاعدة البيانات غير متصلة.",
  dbErrorBody: "قم بتهيئة DB_HOST / DB_USER / DB_PASS.",
  executiveFaqs: [
    { q: "كم تكلفة الفحص الصحي التنفيذي في بانكوك؟", a: "تتراوح تكلفة الفحوصات الصحية التنفيذية في بانكوك عادةً بين 10,000 و60,000 بات حسب فئة المستشفى والمحتويات. المستشفيات المعتمدة من JCI مثل بامرونغراد ومستشفى بانكوك تقع في النطاق الأعلى، بينما تقدم مستشفيات مثل برارام 9 وفياثاي أسعاراً تنافسية أكثر." },
    { q: "هل يشمل الفحص الصحي التنفيذي في بانكوك الرنين المغناطيسي؟", a: "ليس دائماً — الرنين المغناطيسي إضافة اختيارية في بعض المستشفيات. استخدم المقارنة أعلاه لمعرفة أي الباقات التنفيذية تشمل الرنين المغناطيسي كجزء أساسي. توقع دفع 5,000–15,000 بات إضافية إذا لم يكن مشمولاً." },
    { q: "أي مستشفى في بانكوك هو الأفضل للفحص الصحي التنفيذي؟", a: "بامرونغراد الدولي ومستشفى بانكوك (BDMS) هما الأكثر شمولاً. للحصول على قيمة أفضل، تقدم مستشفيات فيثاني وBNH باقات ممتازة بأسعار أقل." },
  ],
  aeoRange: (label, min, max, count) => `تتراوح أسعار باقات الفحص الصحي ${label} في بانكوك من ${min} إلى ${max} بات عبر ${count} باقة.`,
  aeoJci: (n) => `تتوفر ${n} مستشفى معتمد من JCI.`,
  aeoMri: (n) => `${n} باقة تشمل تصوير الرنين المغناطيسي.`,
  aeoCancer: (n) => `${n} باقة تشمل فحوصات علامات السرطان.`,
  aeoInterp: (n) => `${n} باقة توفر خدمة الترجمة.`,
};

const COMPARE_I18N: Record<Locale, CompareContent> = { en, zh, ja, th, ko, ar };

export function compareT(locale: Locale): CompareContent {
  return COMPARE_I18N[locale] ?? COMPARE_I18N.en;
}
