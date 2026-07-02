const TOPICS = [
  {
    title: "Thai Laws Foreigners Commonly Violate — What You Must Know",
    emoji: "⚖️",
    summary: "Thailand has several laws that are strictly enforced against foreigners and that visitors frequently violate out of ignorance: (1) Lèse-majesté (Article 112, Criminal Code): defaming, insulting, or threatening the Thai monarch, consort, or heir carries a 3–15 year prison sentence per offense; this law is applied broadly; social media posts made from abroad about the Thai royal family can be prosecuted if the poster enters Thailand; sharing content perceived as critical of the monarchy is equally prosecutable as original authorship; (2) Drug laws: Thailand's drug laws are extremely severe; possession of Class 1 narcotics (heroin, methamphetamine, MDMA, cocaine) triggers a 1-year to life sentence; cannabis was decriminalized in June 2022 but recriminalized through regulatory processes beginning in 2024 (legal status continues to evolve; checking current status before use is essential); poppy seeds (legal in many countries) are a Category 1 narcotic in Thailand; (3) Gambling: all forms of gambling are illegal in Thailand except the government lottery and horse racing at authorized tracks; casino visits in illegal operations and participation in illegal gambling (Mafia-owned poker rooms that cater to expats) carry criminal exposure; (4) Carrying wrong identification: foreigners must carry their original passport (or a certified copy) at all times; police spot-checks can result in detention at the immigration detention center while original documents are verified; (5) Disrespecting religious sites: entering temples improperly dressed (knees and shoulders covered), pointing feet at Buddha images, touching sacred objects without permission, or taking photos where prohibited can result in fines and legal consequences; at Wat Phra Kaew (Grand Palace complex), enforcement is active.",
    action: "Thai law for foreigners: Siam Legal International (siamlegal.com) for legal services; Law Office of Thailand (lawofficeofthailand.com); for drug law: do not rely on informal guidance — the legal situation changes; for emergency legal assistance: contact your home country's Embassy in Bangkok immediately upon arrest.",
  },
  {
    title: "Police & Legal Interactions in Bangkok — Foreigner's Guide",
    emoji: "🚔",
    summary: "Navigating Bangkok police interactions and the Thai legal system requires specific knowledge: (1) Royal Thai Police (RTP): Thailand's national police force; Bangkok Metropolitan Police under the RTP handle city policing; tourist police (สถานีตำรวจท่องเที่ยว) are a separate division with English-language capability deployed at major tourist sites; (2) Tourist Police Division: Bangkok's Tourist Police (1155 hotline) are specifically trained for foreign tourist interactions; they speak English, do not extort foreigners, and can mediate disputes; calling 1155 in tourist-policing situations provides an English-speaking interlocutor; (3) Police checkpoint interactions: if stopped at a police roadside checkpoint (common during holidays and evening hours), remain calm; present identification (passport, driver's license); follow instructions; do not offer a bribe unless you receive a very direct and clear indication that an informal payment is expected (extortion by traffic police at checkpoints does occur, particularly with motorbikes); excessive resistance or argument with police creates worse outcomes than compliance; (4) Arrest rights in Thailand: upon arrest, you have the right to contact your Embassy; Thailand is signatory to the Vienna Convention on Consular Relations which requires police to inform you of the right to contact your consulate; this right is not always volunteered; asserting it clearly is important; (5) Bail in Thailand: bail is available for most non-capital offenses; having a Thai lawyer present significantly improves bail outcomes; the Embassy can provide a list of qualified Thai lawyers but cannot pay bail or legal fees on your behalf.",
    action: "Tourist Police: 1155 (English hotline, 24 hours, toll-free); General Emergency: 191; Bangkok's Tourist Police Booth locations: near Wat Phra Kaew, Chatuchak, Khao San Road, major shopping centers; Your Embassy in Bangkok: UK Embassy (02-305-8333), US Embassy (02-205-4000), Australian Embassy (02-344-6300).",
  },
  {
    title: "Thai Traffic Laws & Driving in Bangkok",
    emoji: "🚗",
    summary: "Driving in Bangkok as a foreigner involves specific legal requirements and practical realities: (1) International Driving Permit (IDP): foreigners legally driving in Thailand require a Thai driver's license or an International Driving Permit (IDP) issued in their home country; an IDP is not issued in Thailand — it must be obtained before arriving; an IDP is valid for 1 year or until the national license expires; (2) Thai Driver's License: foreigners with a valid non-immigrant visa (3 months minimum) can apply for a Thai driver's license at the Land Transport Department; the process requires the IDP from home country plus translation, medical certificate, vision/reaction test, 15-question written test, and practical test; (3) Motorbike legal requirements: riding a motorbike in Bangkok requires a Thai motorbike license (Category A) or IDP with motorbike endorsement; renting a motorbike without the correct license means no insurance coverage and full personal liability for any accident; Bangkok traffic police actively check motorbike licensing in enforcement operations; (4) Traffic realities: Bangkok traffic laws are technically strict but enforcement is inconsistent; running red lights (on motorbike), lane changes without signaling, and phone use while driving are extremely common despite being illegal; driving defensively and expecting other drivers to violate traffic law is the practical standard; (5) DUI enforcement: drunk driving is increasingly enforced in Thailand; roadside blood alcohol checkpoints (especially after midnight on weekends near entertainment areas) are common; the legal limit is 0.05% BAC (0.0% for vehicles with fewer than 7 seats on expressways in some contexts); consequences include large fines, license suspension, and potentially jail time.",
    action: "International Driving Permit (IDP): obtain from automobile association in your home country before arriving in Thailand; Thai Driver's License: Land Transport Department Bangkok (dlt.go.th); car/motorbike rental insurance: confirm insurance coverage explicitly before signing rental agreement; for accident situations: call 1669 (ambulance) and 191 (police).",
  },
];

export function BangkokLawLegal() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        ⚖️ Bangkok legal guide — Thai laws to know, police interactions & traffic rules for foreigners
      </div>
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
