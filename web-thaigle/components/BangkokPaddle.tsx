const SPOTS = [
  {
    name: "Stand-Up Paddle Boarding (SUP) in Bangkok Area",
    emoji: "🏄",
    area: "Bangkachao (Bang Krachao Green Lung), Chao Phraya River, nearby reservoirs and dams",
    price: "SUP rental ฿400–800/hour; SUP lesson (beginner) ฿1,500–3,000; SUP tour ฿1,500–3,500",
    why: "Stand-up paddle boarding has a growing Bangkok area scene — the Chao Phraya River's main channel and the protected waterways of Bang Krachao (the green peninsular area across from Klong Toey port) provide accessible flat-water paddling. Bang Krachao is Bangkok's most nature-rich SUP environment: the labyrinthine canals (khlongs) through the green interior of this 'lung of Bangkok' offer quiet, shaded paddling through mangroves, orchards, and traditional stilted village communities inaccessible by road. Guided SUP tours of Bang Krachao canals are organized regularly by paddling schools and tour operators — typically half-day format. Further afield: Kaeng Krachan reservoir (3 hours from Bangkok) provides SUP in a national park setting with dramatic hills as backdrop.",
    tip: "Bang Krachao SUP logistics: the area is accessible by ferry from Klong Toey pier (running periodically) or by private longtail boat. SUP rentals and tours depart from the Bang Krachao side. The best time for Bang Krachao SUP: early morning (7–10am) before the heat builds and with calmer canal water surface. Chao Phraya SUP: paddling on the main Chao Phraya requires experienced paddlers — boat traffic (including fast longtail boats and cargo vessels) creates significant wake and risk. Canal SUP (khlongs rather than the main river) is safer for beginners. Thai Paddle Club and similar Bangkok paddle communities organize regular group sessions — joining an organized group provides both instruction and safety in numbers.",
  },
  {
    name: "Kayaking & Dragon Boat Racing",
    emoji: "🚣",
    area: "Bangkok water sport facilities, Bangkachao canals, Chao Phraya riverside, Bang Phra Lake (Chonburi)",
    price: "Kayak rental ฿200–400/hour; Dragon boat training session ฿200–400; Bang Phra Lake day access ฿100",
    why: "Kayaking and dragon boat racing complete Bangkok's paddle sports landscape. Dragon boat racing is a significant competitive and recreational sport in Thailand — the Thai Dragon Boat Association organizes competitive races, and training teams exist in Bangkok for both Thai nationals and expatriates. The Bangkok-area dragon boat scene: Bangkapi Club, Chao Phraya riverside teams, and community teams at the Bang Phra reservoir (eastern suburb). Competition calendar: dragon boat races occur year-round with major races during Chinese New Year and festival periods. The competitive culture is welcoming to newcomers with paddling experience — showing up to a team practice with basic fitness and willingness to learn is the normal entry path. Kayaking: recreational kayak rentals exist at Bang Krachao and at some canal-side locations for exploring Bangkok's water network independently.",
    tip: "Dragon boat entry for foreigners: the Thai dragon boat community is international — teams at established Bangkok clubs welcome foreign paddlers to training sessions. The boats require synchronized timing and technique — 20-person boats need coordination, making the first few sessions about learning the stroke and rhythm. Physical requirements: dragon boat paddling is a genuine upper-body workout; reasonable baseline fitness helps but beginners are accommodated. The safety infrastructure: dragon boats are extremely stable and rarely capsize in training conditions — the primary safety concern is Bangkok's water quality (the Chao Phraya and urban canals are polluted; contact with the water should be minimized and hands washed immediately after practice).",
  },
  {
    name: "Wakeboarding & Water Sports Parks",
    emoji: "🏂",
    area: "Bangkok Watersports Complex (Ram Intra), Ski Nautique Bangkok, cable wake parks near Bangkok",
    price: "Cable wakeboarding ฿400–800/hour; Boat wakeboarding session ฿2,000–4,000; Half-day water sports package ฿1,500–3,000",
    why: "Cable wakeboarding in Bangkok is well-developed — the sport has grown significantly in Thailand since the early 2010s, and Bangkok has multiple cable wake parks (using overhead cable systems that pull riders across a course, eliminating the need for a boat). Cable parks are beginner-accessible — the consistent, controllable cable tension is more forgiving than boat wakes for first-time riders, and instructors at Bangkok's parks speak English and work with beginners regularly. The Ram Intra area (northeastern Bangkok) has multiple water sport facilities including cable wake parks and inflatable obstacle courses. For boat wakeboarding: private sessions on nearby reservoirs provide a quieter, more personalized experience. Kiteboarding: Pranburi (near Hua Hin, 4 hours from Bangkok) and Hat Yao near Hua Hin are the nearest kiteboarding destinations.",
    tip: "Cable wake park practical advice: wear a rash guard or wetsuit (Bangkok sun is intense, and falls mean prolonged sun exposure in water); bring your own board shorts/swimwear as rental swimwear at parks is limited. Beginner wakeboarding lessons: 1–2 hours of instruction is sufficient to get up and ride a basic straight line for most people with decent balance and fitness. The social scene at Bangkok cable parks is good — mix of Thai riders, expats, and international visitors; the shared learning environment is friendly. Safety: helmets and life vests are mandatory and provided at all Bangkok cable wake parks — no exceptions. Driving: cable wake parks are in outer Bangkok areas most efficiently reached by car or motorcycle — taxis/Grab work but confirm the park location specifically as GPS can be imprecise for these facilities.",
  },
];

export function BangkokPaddle() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏄 Bangkok water sports — SUP, kayaking, dragon boat & cable wakeboarding
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-blue-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
