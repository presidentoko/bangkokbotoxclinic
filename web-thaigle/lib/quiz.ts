export type QuizResultType = {
  id: string;
  title: string;
  emoji: string;
  desc: string;
  color: string;
  recs: { label: string; url: string; emoji: string }[];
  dayPlanUrl?: string;
};

export const QUIZ_RESULTS: QuizResultType[] = [
  {
    id: "foodie",
    title: "The Bangkok Foodie",
    emoji: "🌶️",
    desc: "You're here for the food and nothing else. Street stalls at 2am, 5-star tasting menus at 8pm — you do it all. Your Instagram is basically a food diary. No regrets.",
    color: "from-orange-500 to-red-500",
    recs: [
      { label: "Best Thai Restaurants", url: "/restaurants/cuisine/thai", emoji: "🍛" },
      { label: "Thai Street Food Guide", url: "/guide/best-thai-food-bangkok", emoji: "🥢" },
      { label: "Thai Cooking Classes", url: "/activities/cooking", emoji: "👨‍🍳" },
    ],
    dayPlanUrl: "/day-plan/thonglor/foodie",
  },
  {
    id: "wellness",
    title: "The Wellness Warrior",
    emoji: "🧘",
    desc: "Thai massage every day, yoga at sunrise, detox smoothies for lunch. Bangkok is your annual reset. You leave feeling like a completely different person — and you are.",
    color: "from-green-500 to-teal-500",
    recs: [
      { label: "Best Spas & Massage", url: "/activities/spa", emoji: "💆" },
      { label: "Yoga & Pilates Studios", url: "/activities/yoga-pilates", emoji: "🧘" },
      { label: "Wellness Centers", url: "/activities/wellness", emoji: "🌿" },
    ],
    dayPlanUrl: "/day-plan/thonglor/wellness",
  },
  {
    id: "fighter",
    title: "The Muay Thai Pilgrim",
    emoji: "🥊",
    desc: "You didn't come to Bangkok to relax. You came to train. Morning sessions, afternoon runs, evening fights. You'll go home with bruised shins and the best story at every dinner party.",
    color: "from-red-500 to-orange-600",
    recs: [
      { label: "Best Muay Thai Gyms", url: "/activities/muay-thai", emoji: "🥊" },
      { label: "Muay Thai Guide", url: "/guide/best-muay-thai-gyms-bangkok", emoji: "📖" },
      { label: "Post-Training Restaurants", url: "/best/highly-recommended", emoji: "🍽️" },
    ],
    dayPlanUrl: "/day-plan/sukhumvit/active",
  },
  {
    id: "nomad",
    title: "The Digital Nomad",
    emoji: "💻",
    desc: "Meetings before 10am, café-hopping from 11am, co-working by day, rooftop bars by night. Bangkok is your office. A very good office with extremely affordable lunch.",
    color: "from-blue-500 to-purple-500",
    recs: [
      { label: "Best Coworking Spaces", url: "/activities/coworking", emoji: "💻" },
      { label: "Digital Nomad Guide", url: "/activities/digital-nomad", emoji: "🗺️" },
      { label: "Cafés & Remote Work", url: "/restaurants/cuisine/cafe", emoji: "☕" },
    ],
    dayPlanUrl: "/day-plan/thonglor/foodie",
  },
  {
    id: "explorer",
    title: "The Hidden Gem Hunter",
    emoji: "🔍",
    desc: "You go to the places no one knows about. Tiny alley restaurants with 2,000 reviews and zero English signage. Hole-in-the-wall massage shops that tourists walk past. You find the real Bangkok.",
    color: "from-amber-500 to-yellow-500",
    recs: [
      { label: "Hidden Gem Restaurants", url: "/restaurants/bangkok/hidden-gems", emoji: "💎" },
      { label: "Explore by District", url: "/restaurants/bangkok", emoji: "📍" },
      { label: "Anti-Tourist Traps", url: "/restaurants/bangkok/tourist-traps", emoji: "🚩" },
    ],
    dayPlanUrl: "/day-plan/old-town/foodie",
  },
  {
    id: "budget",
    title: "The Budget Champion",
    emoji: "💪",
    desc: "50 baht pad see ew? You found it. Massage for 200 baht? Been there 3 times already. You get more out of Bangkok for less than anyone else. A skill, honestly.",
    color: "from-emerald-500 to-green-600",
    recs: [
      { label: "Budget-Friendly Restaurants", url: "/best/affordable", emoji: "🍜" },
      { label: "Budget Bangkok Activities", url: "/activities/budget", emoji: "🎯" },
      { label: "Street Food Bangkok", url: "/restaurants/cuisine/street_food", emoji: "🥢" },
    ],
    dayPlanUrl: "/day-plan/ari/foodie",
  },
];
