const TOPICS = [
  {
    title: "Learning Chinese (Mandarin) in Bangkok",
    emoji: "🀄",
    summary: "Bangkok is one of Asia's best cities for Mandarin Chinese language learning — combining the world's largest overseas Chinese community (Thailand's Chinese-Thai population is among Southeast Asia's largest), multiple Chinese educational institutions, and a commercial demand for Chinese-language skills driven by China's tourism and investment in Thailand: (1) Confucius Institute Bangkok: affiliated with multiple Bangkok universities (Chulalongkorn, Kasetsart, etc.), the Confucius Institutes offer free or subsidized Mandarin classes at various levels; (2) Private Mandarin language schools: multiple Bangkok language schools (Benjawan's, EasyThai.net, and Chinese-language focused institutes) offer intensive and part-time Mandarin programs; (3) Chinese Cultural Centre Bangkok: affiliated with the People's Republic of China embassy; offers cultural and language programs; (4) Private tutors: Bangkok's Chinese-speaking community provides an excellent pool of private Mandarin tutors (Taiwanese, mainland Chinese, and Thai-Chinese who speak standard Mandarin) available through platforms like Preply, iTalki, and bulletin boards at Chinese schools; (5) HSK preparation: the Hanyu Shuiping Kaoshi (HSK — Chinese proficiency test) is taken in Bangkok at examination centers affiliated with Confucius Institutes; HSK certification is increasingly required for working in Thailand's Chinese-linked business sectors.",
    action: "Bangkok Chinese learning: Confucius Institute Thailand (ci.thu.ac.th), Chinese Cultural Centre Bangkok (Ratchadamnoen Road), and private tutor platforms such as iTalki for flexible Mandarin practice.",
  },
  {
    title: "Bangkok's Thai-Chinese Cultural Bilingualism",
    emoji: "🇨🇳",
    summary: "Thailand's Thai-Chinese community (estimated at 14% of the population, but disproportionately represented in Bangkok's business and commercial class) maintains a distinctive cultural and linguistic landscape: (1) Teochew dialect community: Bangkok's original Chinese immigrants were primarily Teochew (Chaoshan Chinese from eastern Guangdong province); Teochew remains spoken in older Yaowarat businesses and in many Thai-Chinese family contexts; it differs significantly from Mandarin and Cantonese; (2) Mandarin as bridge language: Thailand's educational system now teaches Mandarin (standard Putonghua) rather than Teochew as the Chinese language curriculum; younger Thai-Chinese generations are more Mandarin than Teochew literate; (3) Code-switching in business: Bangkok's commercial districts (particularly Yaowarat, Sampeng Lane, and Pratunam) regularly involve code-switching between Thai and Chinese in business contexts; the ability to conduct basic Mandarin conversation (or even Teochew greeting phrases) in Yaowarat creates genuine social capital; (4) Chinese signage: Bangkok's Chinatown (Yaowarat) is one of the most visually Chinese neighborhoods outside mainland China and Taiwan; the red-and-gold signage, temple architecture, and street food offerings create an immersive Chinese cultural environment that extends language learning to environmental context; (5) Chinese New Year cultural peak: Bangkok's Chinese New Year celebrations (typically January–February, based on lunar calendar) in Yaowarat represent the year's most immersive public expression of Thai-Chinese culture.",
    action: "Bangkok Thai-Chinese cultural immersion: Yaowarat Chinatown walking exploration (any evening, most vibrant 6–10pm), morning dim sum at traditional teahouses, and conversation with Yaowarat shopkeepers using basic Mandarin or Teochew phrases.",
  },
  {
    title: "Japanese Language Learning in Bangkok",
    emoji: "🇯🇵",
    summary: "Bangkok is an excellent environment for Japanese language learning — with one of Southeast Asia's largest Japanese expatriate communities, strong Thai cultural affinity for Japanese culture (anime, J-pop, Japanese food), and multiple formal Japanese language education institutions: (1) Japan Foundation Bangkok: operates formal Japanese language instruction and proficiency test (JLPT — Japanese Language Proficiency Test) at all levels; the primary official Japanese language resource center for Bangkok; (2) Japanese Language School Bangkok (multiple private schools): several private language schools in the Sukhumvit area (particularly near Japan Town) offer Japanese language courses for Thai students and foreign learners; (3) JLPT examination: Bangkok is a major JLPT examination center; the test is offered December and July annually; Bangkok test-takers are predominantly Thai students seeking Japanese business or academic connections; (4) Conversational practice with Japanese community: Bangkok's Japan Town (Sukhumvit Soi 49–63 area) has Japanese restaurants, izakayas, grocery stores, and community spaces where informal Japanese language practice opportunities arise naturally; (5) Anime and manga Japanese: Bangkok's anime and manga culture is deeply embedded in Thai youth culture; the Thai fandom community uses Japanese-origin vocabulary extensively (senpai, kawaii, otaku, nani) in Thai language social media — evidence of the cultural permeation.",
    action: "Bangkok Japanese learning: Japan Foundation Bangkok Language Center (japanfoundation.or.th/en), Japanese Language School Bangkok listings in Sukhumvit, and JLPT examination registration through Japan Foundation Bangkok.",
  },
  {
    title: "Korean Language Learning in Bangkok",
    emoji: "🇰🇷",
    summary: "The K-wave (Korean Wave — hallyu) has created significant demand for Korean language learning among Bangkok's Thai population — driven by K-drama and K-pop enthusiasm that extends across virtually all age groups in Thailand: (1) King Sejong Institute Bangkok: the official Korean government-sponsored Korean language institution in Bangkok offers subsidized Korean language classes based on the KSI curriculum; (2) Korean Cultural Center Bangkok: programming includes Korean language education, cultural events, and TOPIK (Test of Proficiency in Korean) examination preparation; (3) Private Korean language schools: multiple private language schools have added Korean language tracks to meet growing demand; several are operated by Korean instructors in Sukhumvit area; (4) Online learning with Thai-specific content: multiple Thai-language YouTube channels teach Korean to Thai learners using Thai-language instruction; this is arguably the dominant learning medium for Thai Korean learners; (5) Language exchange community: Bangkok's Korean-Thai language exchange community (matching Korean speakers wanting Thai practice with Thai speakers wanting Korean practice) operates through Facebook groups and the Tandem/HelloTalk language exchange apps; (6) TOPIK examination in Bangkok: the Test of Proficiency in Korean is administered twice annually in Bangkok through the King Sejong Institute and Korean Cultural Center; TOPIK certification is increasingly relevant for Thai people working in Korean businesses or planning Korean university study.",
    action: "Bangkok Korean learning: King Sejong Institute Bangkok (sejong.or.kr), Korean Cultural Center Bangkok (kccinasia.org/bangkok), and Bangkok Korean-Thai Language Exchange Facebook group for conversation partner matching.",
  },
];

export function BangkokChineseLanguage() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🀄 Bangkok Asian language learning — Mandarin, Japanese & Korean study resources
      </h2>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-red-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-red-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
