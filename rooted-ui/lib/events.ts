export type Vibe = "introspective" | "parallel" | "cocreative" | "kinetic"

export interface Event {
  id: string
  title: string
  place: string
  address: string
  time: string
  date: number
  month: "january" | "february"
  vibe: Vibe
  vibeDescriptor: string
  cost: string
  toBring: string
  matchNarrative: string
  eventUrl: string
}

export const vibeInfo: Record<Vibe, { label: string; description: string }> = {
  introspective: { label: "Introspective", description: "Quiet, solo-but-together" },
  parallel: { label: "Parallel", description: "Side-by-side, no-pressure" },
  cocreative: { label: "Co-Creative", description: "Collaborative, expressive" },
  kinetic: { label: "Kinetic", description: "High-motion, collective" },
}

export const events: Event[] = [
  // January Events
  {
    id: "1",
    title: "Sunrise Yoga at Discovery Green",
    place: "Discovery Green",
    address: "1500 McKinney St, Houston, TX 77010",
    time: "7:00 AM - 8:00 AM",
    date: 4,
    month: "january",
    vibe: "introspective",
    vibeDescriptor: "Peaceful morning flow",
    cost: "Free",
    toBring: "Yoga mat, water bottle",
    matchNarrative: "Since you mentioned needing a quiet, grounding start to your day, this sunrise yoga session offers that solo-but-together energy you're seeking.",
    eventUrl: "https://www.discoverygreen.com/yoga"
  },
  {
    id: "2",
    title: "Buffalo Bayou Trail Run",
    place: "Buffalo Bayou Park",
    address: "1800 Allen Pkwy, Houston, TX 77019",
    time: "8:00 AM - 10:00 AM",
    date: 5,
    month: "january",
    vibe: "kinetic",
    vibeDescriptor: "Energetic group run",
    cost: "$10",
    toBring: "Running shoes, sunscreen",
    matchNarrative: "For those moments when you want to feel alive and part of something moving, this group run channels that collective kinetic energy.",
    eventUrl: "https://buffalobayou.org/visit/destination/buffalo-bayou-park/"
  },
  {
    id: "3",
    title: "Book Club Brunch",
    place: "Brasserie 19",
    address: "1962 W Gray St, Houston, TX 77019",
    time: "10:30 AM - 12:30 PM",
    date: 11,
    month: "january",
    vibe: "parallel",
    vibeDescriptor: "Cozy literary gathering",
    cost: "$25-40 for brunch",
    toBring: "This month's book: Demon Copperhead",
    matchNarrative: "You mentioned wanting connection without pressure — this book club offers that side-by-side energy where you can just be, together.",
    eventUrl: "https://www.meetup.com/houston-book-clubs/"
  },
  {
    id: "4",
    title: "Meditation at the Menil",
    place: "Menil Collection",
    address: "1533 Sul Ross St, Houston, TX 77006",
    time: "9:00 AM - 10:00 AM",
    date: 12,
    month: "january",
    vibe: "introspective",
    vibeDescriptor: "Art-inspired stillness",
    cost: "Free",
    toBring: "Comfortable clothing",
    matchNarrative: "When you need space to breathe and just exist, this meditation session surrounded by art offers that introspective sanctuary.",
    eventUrl: "https://www.menil.org/"
  },
  {
    id: "5",
    title: "Heights Night Market",
    place: "Heights Mercantile",
    address: "714 Yale St, Houston, TX 77007",
    time: "5:00 PM - 9:00 PM",
    date: 17,
    month: "january",
    vibe: "cocreative",
    vibeDescriptor: "Vibrant local market",
    cost: "Free entry",
    toBring: "Cash for vendors",
    matchNarrative: "For those evenings when you want to feel the creative pulse of your community, this market brings makers and seekers together.",
    eventUrl: "https://www.heightsmercantile.com/"
  },
  {
    id: "6",
    title: "Kayak the Bayou",
    place: "Bayou Paddlesports",
    address: "10603 Kingspoint Rd, Houston, TX 77075",
    time: "2:00 PM - 5:00 PM",
    date: 18,
    month: "january",
    vibe: "kinetic",
    vibeDescriptor: "Water adventure",
    cost: "$35 rental included",
    toBring: "Change of clothes, towel",
    matchNarrative: "When you're craving that full-body, in-the-moment adventure, paddling the bayou with others gets you moving and connected.",
    eventUrl: "https://www.bayoupaddlesports.com/"
  },
  {
    id: "7",
    title: "Poetry Open Mic",
    place: "Brasil Cafe",
    address: "2604 Dunlavy St, Houston, TX 77006",
    time: "7:00 PM - 9:30 PM",
    date: 24,
    month: "january",
    vibe: "cocreative",
    vibeDescriptor: "Creative expression night",
    cost: "Free with purchase",
    toBring: "Your poems or just ears",
    matchNarrative: "You mentioned wanting to express yourself — this open mic is a space where your voice matters and others are ready to listen.",
    eventUrl: "https://www.brasilcafehouston.com/"
  },
  {
    id: "8",
    title: "Sound Bath Session",
    place: "Jung Center Houston",
    address: "5200 Montrose Blvd, Houston, TX 77006",
    time: "6:30 PM - 8:00 PM",
    date: 25,
    month: "january",
    vibe: "introspective",
    vibeDescriptor: "Deep relaxation",
    cost: "$20",
    toBring: "Blanket, pillow",
    matchNarrative: "Since you're seeking deep rest and inner stillness, this sound bath lets you sink into yourself while being held by shared presence.",
    eventUrl: "https://www.junghouston.org/"
  },
  {
    id: "9",
    title: "Urban Cycling Tour",
    place: "Market Square Park",
    address: "301 Milam St, Houston, TX 77002",
    time: "9:00 AM - 12:00 PM",
    date: 26,
    month: "january",
    vibe: "kinetic",
    vibeDescriptor: "Downtown exploration",
    cost: "$15",
    toBring: "Bike or rent one, helmet",
    matchNarrative: "For those who find clarity in motion, this cycling tour lets you explore the city while riding alongside new friends.",
    eventUrl: "https://www.bikehouston.org/"
  },

  // February Events
  {
    id: "10",
    title: "Tea & Journaling Circle",
    place: "Path of Tea",
    address: "2340 W Alabama St, Houston, TX 77098",
    time: "10:00 AM - 12:00 PM",
    date: 1,
    month: "february",
    vibe: "introspective",
    vibeDescriptor: "Reflective morning ritual",
    cost: "$18 includes tea",
    toBring: "Journal, favorite pen",
    matchNarrative: "You mentioned wanting quiet reflection — this journaling circle offers that contemplative space where silence is shared, not awkward.",
    eventUrl: "https://www.pathoftea.com/"
  },
  {
    id: "11",
    title: "Salsa Dancing Social",
    place: "Sambuca",
    address: "909 Texas Ave, Houston, TX 77002",
    time: "8:00 PM - 11:00 PM",
    date: 7,
    month: "february",
    vibe: "kinetic",
    vibeDescriptor: "Latin rhythms night",
    cost: "$10 cover",
    toBring: "Dancing shoes, ID",
    matchNarrative: "When you want to feel the rhythm move through you and connect with others through dance, this salsa night delivers that collective energy.",
    eventUrl: "https://www.sambuca-restaurant.com/"
  },
  {
    id: "12",
    title: "Beach Volleyball Tournament",
    place: "Wakiki Beach Volley",
    address: "1401 McKinney St, Houston, TX 77010",
    time: "1:00 PM - 6:00 PM",
    date: 8,
    month: "february",
    vibe: "kinetic",
    vibeDescriptor: "Competitive fun",
    cost: "$20 per team",
    toBring: "Athletic wear, team spirit",
    matchNarrative: "For those times when friendly competition and shared adrenaline are exactly what you need, this tournament brings that high-energy connection.",
    eventUrl: "https://www.wakikivolley.com/"
  },
  {
    id: "13",
    title: "Galentine's Pottery Night",
    place: "Fired Up Houston",
    address: "2400 Times Blvd, Houston, TX 77005",
    time: "6:00 PM - 9:00 PM",
    date: 13,
    month: "february",
    vibe: "cocreative",
    vibeDescriptor: "Creative friendship celebration",
    cost: "$45 all materials",
    toBring: "Your creative energy",
    matchNarrative: "You mentioned wanting to create alongside others — this pottery night offers that hands-on, expressive togetherness you're craving.",
    eventUrl: "https://www.fireduphouston.com/"
  },
  {
    id: "14",
    title: "Valentine's Sunset Picnic",
    place: "Hermann Park",
    address: "6001 Fannin St, Houston, TX 77030",
    time: "5:30 PM - 7:30 PM",
    date: 14,
    month: "february",
    vibe: "parallel",
    vibeDescriptor: "Romantic evening together",
    cost: "Free",
    toBring: "Picnic basket, blanket",
    matchNarrative: "For that gentle, side-by-side presence where words aren't always necessary, this sunset gathering offers peaceful togetherness.",
    eventUrl: "https://www.hermannpark.org/"
  },
  {
    id: "15",
    title: "Rock Climbing Intro",
    place: "Texas Rock Gym",
    address: "1526 Campbell Rd, Houston, TX 77055",
    time: "11:00 AM - 1:00 PM",
    date: 15,
    month: "february",
    vibe: "kinetic",
    vibeDescriptor: "Beginner-friendly climbing",
    cost: "$30 gear included",
    toBring: "Athletic clothing",
    matchNarrative: "When you want to challenge yourself physically while others cheer you on, this climbing session brings that supportive, active energy.",
    eventUrl: "https://www.texasrockgym.com/"
  },
  {
    id: "16",
    title: "Nature Walk & Sketching",
    place: "Houston Arboretum",
    address: "4501 Woodway Dr, Houston, TX 77024",
    time: "9:00 AM - 11:00 AM",
    date: 21,
    month: "february",
    vibe: "parallel",
    vibeDescriptor: "Mindful nature art",
    cost: "Free",
    toBring: "Sketchbook, pencils",
    matchNarrative: "Since you mentioned wanting focused, quiet time in nature, this sketching walk offers that parallel presence — together, but in your own world.",
    eventUrl: "https://www.houstonarboretum.org/"
  },
  {
    id: "17",
    title: "Game Night Meetup",
    place: "Tea + Victory",
    address: "2030 E TC Jester Blvd, Houston, TX 77008",
    time: "6:00 PM - 10:00 PM",
    date: 22,
    month: "february",
    vibe: "cocreative",
    vibeDescriptor: "Board game bonding",
    cost: "$8 table fee",
    toBring: "Favorite game (optional)",
    matchNarrative: "You mentioned wanting interactive connection — game nights offer that playful, collaborative space where strangers become teammates.",
    eventUrl: "https://www.teaandvictory.com/"
  },
  {
    id: "18",
    title: "Trail Hiking Adventure",
    place: "Memorial Park",
    address: "6501 Memorial Dr, Houston, TX 77007",
    time: "7:30 AM - 10:30 AM",
    date: 28,
    month: "february",
    vibe: "kinetic",
    vibeDescriptor: "Morning trail exploration",
    cost: "Free",
    toBring: "Hiking shoes, water, snacks",
    matchNarrative: "When you want to move your body and find connection on the trail, this hike brings together people who think best while walking.",
    eventUrl: "https://www.memorialparkconservancy.org/"
  }
]

export function getEventsForMonth(month: "january" | "february"): Event[] {
  return events.filter(event => event.month === month)
}

export function getEventsForDay(month: "january" | "february", day: number): Event[] {
  return events.filter(event => event.month === month && event.date === day)
}
