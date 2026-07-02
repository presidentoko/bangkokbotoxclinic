const TOPICS = [
  {
    title: "Psychotherapy & Counseling in Bangkok",
    emoji: "🧠",
    summary: "Bangkok has a growing English-language mental health sector serving expats, third culture individuals, and internationally-connected Thai residents — therapists trained in CBT, psychodynamic, and other evidence-based approaches.",
    action: "Finding a therapist in Bangkok: (1) MIND Healthcare (mindcareasia.com) — English and Thai speaking therapists, multiple Bangkok locations; (2) Bumrungrad International Hospital's psychiatric department provides psychiatry and psychology services with English-speaking staff; (3) Samitivej Hospital mental health center; (4) Private practice therapists: many Bangkok-based therapists work independently — Psychology Today (international listings), Expat Woman Bangkok resources, and expat community Facebook groups provide referrals. Specializations available in Bangkok: expat transition adjustment, trauma (EMDR practitioners are present), relationship and couples counseling, addiction support, and child/adolescent therapy. Online therapy: international services (BetterHelp, Talkspace) serve Bangkok-based users via video session when in-person isn't preferred.",
  },
  {
    title: "Retreat & Recovery Programs in Thailand",
    emoji: "🌿",
    summary: "Thailand has become a significant destination for longer wellness retreats — alcohol and drug rehabilitation, burnout recovery, trauma processing, and emotional wellness programs in residential settings.",
    action: "Thailand recovery and retreat programs: (1) The Dawn (Chiang Mai) — internationally recognized residential addiction and mental health treatment center with Western therapeutic standards and Thai cultural integration; (2) Koh Samui and Koh Phangan areas have multiple wellness retreats combining yoga, meditation, therapy, and detox in island settings; (3) CAST Recovery (Chiang Mai) focuses on addiction recovery with evidence-based treatment; (4) The luxury wellness retreat sector in Chiang Mai and northern Thailand combines traditional Thai medicine, nature immersion, and therapeutic programming; (5) Vipassana meditation retreats (10-day silent retreats at Wat Mahadhatu Bangkok or northern Thailand centers) provide intensive mindfulness-based recovery and emotional processing experiences at no charge (donation basis). Costs vary dramatically — from donation-based retreat centers to ฿80,000–200,000+ for residential programs.",
  },
  {
    title: "Traditional Healing & Alternative Therapies",
    emoji: "🌀",
    summary: "Bangkok offers diverse traditional and alternative healing modalities alongside conventional mental health care — traditional Thai medicine, energy healing, and holistic approaches are accessible and often culturally meaningful.",
    action: "Bangkok alternative healing access: (1) Traditional Thai medicine practitioners (mor boran) are available at hospital traditional medicine departments — Chao Phraya Abhaibhubejhr Hospital (near Bangkok, Prachin Buri) and traditional medicine departments at Siriraj Hospital provide authentic traditional Thai medicine consultations; (2) Reiki and energy healing practitioners advertise through expat community groups and wellness studio platforms; (3) Sound healing (singing bowl therapy, gong baths) is available at several Bangkok yoga studios — a traditionally Buddhist practice with documented relaxation physiological effects; (4) Acupuncture: widely available at both traditional Chinese medicine clinics (particularly in Chinatown) and integrated at several international hospitals; (5) Thai traditional medicine integration at Bumrungrad includes traditional Thai massage specifically in a medical wellness context. Cost range: traditional modalities in Bangkok cost ฿300–1,500 per session.",
  },
  {
    title: "Crisis & Emergency Mental Health Support",
    emoji: "🆘",
    summary: "Mental health crisis resources in Bangkok — knowing where to go in an emergency is essential for both residents and visitors experiencing acute mental health situations.",
    action: "Bangkok mental health crisis resources: (1) Emergency services: 1669 (EMS) responds to psychiatric emergencies and can transport to appropriate hospital; (2) Bangkok Mental Health Hospital (Somdet Chaopraya) — the main psychiatric hospital in Bangkok, accepts voluntary and involuntary admissions; (3) Bumrungrad International Emergency — English-speaking staff, psychiatric consultation available around the clock; (4) Crisis hotlines: Department of Mental Health Thailand: 1323 (Thai language); Bangkok crisis line (international): various expat health service providers maintain emergency contact lists; (5) Samaritans Thailand (Bangkok): operates an English-language emotional support line; (6) Community support: Bangkok Expats and similar Facebook groups maintain lists of current crisis resources — checking group pinned posts for updated contact numbers provides most current information. Important: do not hesitate to go to a hospital emergency department for psychiatric emergencies — Bangkok's international hospitals have appropriate crisis assessment capacity.",
  },
];

export function BangkokTherapy() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        🧠 Bangkok mental health & therapy — counseling, retreats & traditional healing
      </div>
      <div className="space-y-1">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-teal-100 rounded-xl">
            <summary className="cursor-pointer p-3 flex items-center gap-2">
              <span className="text-xl">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-[var(--muted)] shrink-0">{t.summary.slice(0, 60)}…</span>
            </summary>
            <div className="px-3 pb-3 text-[10px] text-[var(--fg)] leading-snug border-t border-teal-50 pt-2">
              {t.summary}
              <div className="mt-1 text-teal-700">▶ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
