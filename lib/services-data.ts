export interface ServiceStep {
  number: string;
  title: string;
  description: string;
}

export interface ServiceDeliverable {
  title: string;
  detail: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface SpecialtyService {
  slug: "website-rescues" | "google-business-optimization" | "restaurant-food-truck-menus";
  name: string;
  shortName: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroHeadline: string;
  heroEmphasis: string;
  heroSubhead: string;
  whoItsFor: string[];
  problemsSolved: {
    symptom: string;
    fix: string;
  }[];
  process: ServiceStep[];
  deliverables: ServiceDeliverable[];
  featuredProjectIds: string[];
  featuredProofHeadline: string;
  featuredProofNote: string;
  relatedChecklistLink?: boolean;
  faqs: ServiceFaq[];
}

export const SPECIALTY_SERVICES: SpecialtyService[] = [
  {
    slug: "website-rescues",
    name: "Website Rescues & Modernization",
    shortName: "Website Rescues",
    eyebrow: "Website Rescues & Modernization · Sierra Foothills & Greater Sacramento",
    metaTitle: "Website Rescues & Modernization for Local Businesses",
    metaDescription:
      "Turn a slow, broken, or outdated small-business website into a fast, mobile-first storefront you own 100%. Flat-rate rebuilds for Foothill & Sacramento area businesses.",
    keywords: [
      "Website Rescue Cool CA",
      "Website Modernization Auburn CA",
      "Small Business Website Redesign Roseville",
      "Fix Outdated Website Placerville",
      "Fast Mobile Contractor Website",
      "Grow Local Creative Website Rescue",
    ],
    heroHeadline: "Rescue Your Outdated Website Without",
    heroEmphasis: "Starting From Scratch",
    heroSubhead:
      "If your current site crawls on cell data, looks broken on phones, or traps you in bloated monthly builder fees, we rebuild it on your existing domain in days—clean, fast, and 100% yours.",
    whoItsFor: [
      "Contractors and trade crews embarrassed to put their current URL on their truck or estimate sheet",
      "Local shops and makers stuck paying high monthly fees for clunky drag-and-drop sites that barely load",
      "Established businesses whose old web designer disappeared and left broken forms, dead links, or expired SSL warnings",
      "Growing Foothill and Greater Sacramento teams ready to modernize their look while keeping their Google ranking history",
    ],
    problemsSolved: [
      {
        symptom: "Site takes 6+ seconds to open on Foothill LTE or breaks on smartphones",
        fix: "We rebuild on modern lightweight web architecture that loads in under a second even on spotty Highway 49 or mountain cell reception.",
      },
      {
        symptom: "Contact forms go into a black hole or customers have to hunt for your phone number",
        fix: "We place 1-tap Call, Text, and Quote buttons front and center and route every inquiry straight to your phone or inbox.",
      },
      {
        symptom: "Locked inside an agency retainer or proprietary builder you can't edit",
        fix: "You keep full ownership of your domain, hosting account, and code—flat-rate project pricing with zero long-term contracts.",
      },
      {
        symptom: "Zero visibility on Google Search or AI assistants like ChatGPT and Perplexity",
        fix: "Every rescued site launches with clean HTML, structured Schema.org data, local city signals, and intact 301 redirects so you never lose existing search equity.",
      },
    ],
    process: [
      {
        number: "01.",
        title: "Free 15-Minute Rescue Audit",
        description:
          "We walk through your current website live on a phone, pinpoint exactly where visitors are dropping off, and give you a clear flat-rate quote.",
      },
      {
        number: "02.",
        title: "Clean, Mobile-First Rebuild",
        description:
          "We write sharp local copy, compress every photo, structure your services clearly, and build a fast site tailored to how your real customers hire or buy.",
      },
      {
        number: "03.",
        title: "Zero-Downtime Domain & Redirect Handoff",
        description:
          "We connect your existing domain name, set up SSL security, and map redirects from old URLs so Google and returning customers transition seamlessly.",
      },
      {
        number: "04.",
        title: "Keys Handed Over & Local Support",
        description:
          "We walk you through simple updates, link your Google Business Profile, and stay right down the road in Cool whenever you need future additions.",
      },
    ],
    deliverables: [
      {
        title: "Sub-Second Mobile Performance",
        detail: "Engineered for real phones on rural Foothill and suburban cellular networks—no bloated templates or heavy sliders.",
      },
      {
        title: "Preserved Domain & SEO Redirects",
        detail: "Keep your current web address, business email, and search history intact while upgrading speed and structure.",
      },
      {
        title: "Direct Call, Text & Quote Routing",
        detail: "Frictionless mobile buttons and clean lead forms that notify you immediately without spam clutter.",
      },
      {
        title: "Search & AI-Ready Technical Foundation",
        detail: "Clean semantic headings, self-referencing canonicals, XML sitemap, and LocalBusiness Schema.org markup built in from day one.",
      },
      {
        title: "100% Client Ownership",
        detail: "No hostage retainers, no surprise renewal markups, and no proprietary lock-in.",
      },
      {
        title: "Google Business Profile Alignment",
        detail: "We verify your website URL, services, hours, and phone number match your Google listing down to the last digit.",
      },
    ],
    featuredProjectIds: ["fixitcool", "nbd-construction", "sweetwater-rustic"],
    featuredProofHeadline: "Real Websites Built for Speed & Calls",
    featuredProofNote:
      "From rural home-repair crews in Cool to DIY Network-featured contractors across Sacramento, Placer, and El Dorado Counties, every site is built to earn trust immediately.",
    faqs: [
      {
        question: "Will rescuing my website break my existing domain name or business email?",
        answer:
          "No. We inspect your DNS records before touching anything so your business email (Google Workspace, Microsoft 365, etc.) stays online without interruption while we switch your domain to the new site.",
      },
      {
        question: "How long does a Website Rescue & Modernization project take?",
        answer:
          "Most local business website rescues go from our first 15-minute chat to a live, modernized site in 1 to 2 weeks—depending on how many pages and project photos we're organizing.",
      },
      {
        question: "What if my old web designer disappeared and I don't know where my site is hosted?",
        answer:
          "That happens more often than you'd think. During our free 15-minute chat we can look up your public domain registrar and hosting setup together and map out the easiest way to regain full control.",
      },
      {
        question: "Will I lose my current Google rankings when we modernize the site?",
        answer:
          "When done carefully, modernization strengthens your rankings. We preserve your important URL paths (or add clean 301 redirects), fix broken mobile layouts, improve page speed, and add structured LocalBusiness data Google expects.",
      },
      {
        question: "Do I have to pay a monthly agency retainer after launch?",
        answer:
          "Never. You pay a transparent flat rate for the build and own your website outright. If you ever want occasional updates or new pages down the road, you can reach out only when you need us.",
      },
    ],
  },
  {
    slug: "google-business-optimization",
    name: "Google Business & Map Optimization",
    shortName: "Google Maps SEO",
    eyebrow: "Google Business & Map Optimization · Sierra Foothills & Greater Sacramento",
    metaTitle: "Google Business Profile & Maps Optimization",
    metaDescription:
      "Claim, verify, and optimize your Google Business Profile for higher Google Maps visibility across Cool, Auburn, Roseville, Folsom, Placerville, Camino & Grass Valley.",
    keywords: [
      "Google Business Profile Optimization Cool CA",
      "Google Maps SEO Auburn CA",
      "Local SEO Roseville CA",
      "Google Maps Ranking Placerville",
      "Service Area Business Google Profile",
      "Fix Suspended Google Business Profile",
    ],
    heroHeadline: "Show Up First When Nearby Neighbors Search",
    heroEmphasis: "Google Maps",
    heroSubhead:
      "When a homeowner has a burst pipe or a family searches for dinner nearby, they tap the top 3 Google Map results. We dial in your Google Business Profile—categories, rural service areas, photos, and 1-tap review links—without paying a dime for ads.",
    whoItsFor: [
      "Mobile trades and home-based contractors who need to hide their home street address while ranking across multiple towns",
      "Businesses stuck outside the Google Map Pack behind competitors with worse service",
      "Local shops, farms, and eateries with outdated hours, wrong map pins, or duplicate unverified listings",
      "Owners who get great word-of-mouth praise in person but struggle to collect consistent 5-star Google reviews",
    ],
    problemsSolved: [
      {
        symptom: "Suspended or unverified listing caused by a P.O. Box or UPS Store address",
        fix: "We configure a compliant Service-Area Business (SAB) profile using your legitimate base while keeping your residential street address hidden from the public.",
      },
      {
        symptom: "Showing up for the wrong searches—or missing entirely in neighboring towns",
        fix: "We align your primary category, 3–5 high-intent secondary categories, detailed services list, and explicit city/ZIP service zones.",
      },
      {
        symptom: "Stale profile with zero recent photos, missing hours, or generic stock images",
        fix: "We structure a real local photo set (branded truck/storefront, team, finished work) and a simple 60-second weekly update routine Google rewards.",
      },
      {
        symptom: "Happy customers mean to leave a review, then forget once they get busy",
        fix: "We set up your direct 1-tap Google review shortlink and a friendly 30-second text template you can send right after finishing a job.",
      },
    ],
    process: [
      {
        number: "01.",
        title: "Map Pack & Profile Diagnostic",
        description:
          "We check how your business currently shows up on Google Maps across your target towns and compare your categories and signals against the top 3 local results.",
      },
      {
        number: "02.",
        title: "Verification, Categories & Service-Area Setup",
        description:
          "We clean up NAP (Name, Address, Phone) consistency, lock in the exact primary and secondary categories searchers use, and map out your real county and city coverage.",
      },
      {
        number: "03.",
        title: "Services, Photos & Local Proof Buildout",
        description:
          "We write plain-English service descriptions, add real geotagged local photography, set accurate regular and holiday hours, and link cleanly to your website.",
      },
      {
        number: "04.",
        title: "1-Tap Review System & Weekly Playbook",
        description:
          "You walk away with your direct review shortlink, copy-and-paste text script, and a repeatable 60-second Friday update habit that keeps your listing active.",
      },
    ],
    deliverables: [
      {
        title: "Compliant Rural & Service-Area Configuration",
        detail: "Proper address handling so mobile contractors and home-based studios avoid P.O. Box suspensions while protecting home privacy.",
      },
      {
        title: "Primary & Secondary Category Tuning",
        detail: "Competitor-checked category selection covering over 60% of local Map Pack relevance weight.",
      },
      {
        title: "Full Service Menu & Local Description Copy",
        detail: "Clear descriptions naming your real trades, specialties, and Foothill/Sacramento towns without spammy keyword stuffing.",
      },
      {
        title: "1-Tap Google Review Shortlink & Text Script",
        detail: "A frictionless link you can text to happy clients or print on a QR code to build steady 5-star reviews.",
      },
      {
        title: "Website-to-Maps Trust Alignment",
        detail: "Matching phone numbers, hours, booking URLs, and LocalBusiness Schema.org signals between your site and Google.",
      },
      {
        title: "60-Second Weekly Google Update Template",
        detail: "Simple Friday photo + 2-sentence post system to keep your profile outranking dormant competitors.",
      },
    ],
    featuredProjectIds: ["fixitcool", "nbd-construction", "alt-business"],
    featuredProofHeadline: "Built Around How Neighbors Actually Search",
    featuredProofNote:
      "Every local site we build pairs tightly with Google Maps—matching real service areas, accurate hours, and instant tap-to-call conversion.",
    relatedChecklistLink: true,
    faqs: [
      {
        question: "Can you guarantee a #1 ranking on Google Maps?",
        answer:
          "No honest specialist can guarantee #1 because Google weighs searcher proximity, reviews, and ongoing algorithm shifts. What we guarantee is a completely dialed-in foundation—clean verification, exact categories, accurate service areas, fast website alignment, and a real review engine—that gives you the strongest possible footing.",
      },
      {
        question: "I work out of my home in the Foothills—do I have to publish my street address?",
        answer:
          "No. If you travel to customers' homes or job sites, Google allows you to verify your profile privately and hide your street address from public view while displaying your target towns and counties.",
      },
      {
        question: "Why shouldn't I use my Cool or Georgetown P.O. Box on Google Maps?",
        answer:
          "Google's automated compliance checks routinely suspend profiles using P.O. Boxes or private mailbox stores. Using your actual physical base (hidden for service-area businesses) keeps your listing safe and verified.",
      },
      {
        question: "How many cities can we target on a Google Business Profile?",
        answer:
          "Google allows up to 20 service areas within roughly a 2-hour driving radius. We help you choose the highest-value towns you actually serve—such as Cool, Auburn, Roseville, Loomis, Lincoln, Folsom, Fair Oaks, Foresthill, Placerville, Camino, Pollock Pines, Grass Valley, and Nevada City.",
      },
      {
        question: "Can I try optimizing my profile myself first?",
        answer:
          "Absolutely! Grab our free 5-Minute Google Maps Setup Checklist right on this site—it walks through the top 5 high-impact fixes step by step. If you'd rather hand it off, book a free 15-minute chat and we'll take care of it for you.",
      },
    ],
  },
  {
    slug: "restaurant-food-truck-menus",
    name: "Restaurant & Food Truck Menus",
    shortName: "Mobile Menus",
    eyebrow: "Restaurant & Food Truck Menus · Sierra Foothills & Greater Sacramento",
    metaTitle: "Mobile Restaurant & Food Truck Menu Websites",
    metaDescription:
      "Replace unreadable PDF menus with lightning-fast, mobile-first restaurant, bakery, and food truck menus with daily specials, pop-up schedules, and catering forms.",
    keywords: [
      "Restaurant Mobile Menu Web Design",
      "Food Truck Website and Menu",
      "Replace PDF Restaurant Menu",
      "Smokehouse and BBQ Menu Website",
      "Bakery Menu Website Auburn Placerville",
      "Catering Quote Form for Restaurants",
    ],
    heroHeadline: "Ditch Unreadable PDF Menus for a",
    heroEmphasis: "Mouth-Watering Mobile Menu",
    heroSubhead:
      "Hungry customers on their phones abandon pinch-and-zoom PDFs in seconds. We build ultra-fast digital menus for local restaurants, smokehouses, bakeries, cafes, and food trucks—with live hours, pop-up stops, and direct catering inquiries.",
    whoItsFor: [
      "Restaurants, diners, and cafes whose current menu is a blurry scanned PDF or Facebook photo nobody can read on a phone",
      "Food trucks and weekend smokehouses that need an easy-to-update location schedule and pop-up calendar",
      "Bakeries, Apple Hill farm stands, and specialty food makers taking seasonal pre-orders or catering requests",
      "Independent eateries tired of losing high commissions to third-party ordering platforms just to display their food online",
    ],
    problemsSolved: [
      {
        symptom: "Customers pinch, zoom, and squint at a 12MB PDF menu on spotty parking-lot reception",
        fix: "We convert your menu into crisp, readable, tap-friendly mobile HTML that opens in under half a second and is searchable directly by Google.",
      },
      {
        symptom: "Outdated prices, sold-out brisket, or wrong holiday hours sitting on third-party sites",
        fix: "You get a single source of truth you can update quickly—so specials, prices, and hours stay accurate everywhere.",
      },
      {
        symptom: "Catering inquiries buried in Instagram DMs or missed voicemails during dinner rush",
        fix: "We build a clean catering quote form capturing event date, guest count, and menu picks—routed straight to your inbox or phone.",
      },
      {
        symptom: "Food truck regulars asking 'Where are you parked today?' every single weekend",
        fix: "We feature a bold, scannable weekly pop-up schedule right at the top of your mobile page with 1-tap Google Maps directions.",
      },
    ],
    process: [
      {
        number: "01.",
        title: "Menu & Workflow Review",
        description:
          "Send us your current menu (even a photo of your menu board), hours, and catering details. We map out the cleanest category flow for hungry mobile visitors.",
      },
      {
        number: "02.",
        title: "Appetizing, Sub-Second Mobile Build",
        description:
          "We design a crisp digital menu with clear sections, dietary notes, pricing, real food photography, and 1-tap Call & Directions buttons.",
      },
      {
        number: "03.",
        title: "Pop-Up Schedule, QR Codes & Catering Pipeline",
        description:
          "We add your catering request form, weekend location schedule (if mobile), and generate clean QR codes you can put on tables, trucks, or takeout boxes.",
      },
      {
        number: "04.",
        title: "Google Maps Menu Sync & Handoff",
        description:
          "We link your shiny new mobile menu straight into your Google Business Profile so Google displays your real menu items when locals search what to eat.",
      },
    ],
    deliverables: [
      {
        title: "Zero-PDF Mobile-First Menu",
        detail: "Instant-loading, thumb-friendly sections with clear pricing, descriptions, and optional dietary labels.",
      },
      {
        title: "Easy Specials & Hours Updates",
        detail: "Update daily specials, seasonal items, or sold-out dishes without calling an agency or wrestling with PDF exports.",
      },
      {
        title: "Direct Catering & Pre-Order Inquiry Form",
        detail: "Capture event dates, headcounts, and food requests cleanly so you book profitable catering jobs without phone tag.",
      },
      {
        title: "Food Truck & Pop-Up Schedule Block",
        detail: "Show where you're serving this week with 1-tap directions—perfect for breweries, markets, and Foothill weekend events.",
      },
      {
        title: "Print-Ready QR Table & Takeout Links",
        detail: "One clean link and QR code for menus, Google reviews, and Instagram—no monthly QR subscription traps.",
      },
      {
        title: "Google Search & Maps Menu Visibility",
        detail: "Real HTML text lets Google and AI search tools recommend your specific dishes (like brisket, sourdough, or gluten-free pastries) to hungry locals.",
      },
    ],
    featuredProjectIds: ["pigsure-bbq", "sweetwater-rustic"],
    featuredProofHeadline: "See How Fast a Zero-PDF Menu Feels",
    featuredProofNote:
      "For Pig-Sure Perfect BBQ, we replaced clunky PDFs with an edge-deployed mobile menu, weekend smoke-session tracker, and catering quote form that loads in under 300ms.",
    faqs: [
      {
        question: "Why is a real web menu better than uploading a PDF of my printed menu?",
        answer:
          "PDFs force phone visitors to pinch and zoom, take forever to download on weak cell signal, and hide your dish names from Google Search. A mobile web menu opens instantly, reads cleanly on any screen, and helps Google match your dishes when nearby diners search.",
      },
      {
        question: "Can I update prices, weekly specials, or sold-out items myself?",
        answer:
          "Yes. We set up a simple, stress-free way for you to adjust specials, hours, or prices right from your phone or computer—no technical skills required.",
      },
      {
        question: "Do you take a percentage of my orders or charge monthly menu fees?",
        answer:
          "Zero commissions and zero monthly menu hostage fees. We build your menu site for a flat project rate and you keep 100% of every dollar your customers spend.",
      },
      {
        question: "Can you link to Toast, Square, Clover, or my existing online ordering system?",
        answer:
          "Yes! If you already use Square, Toast, Clover, or SpotOn for checkout, we connect clean 'Order Pickup' buttons directly to your existing checkout so nothing disrupts your kitchen workflow.",
      },
      {
        question: "Is this a good fit for seasonal farms, bake shops, and Apple Hill stands?",
        answer:
          "It's a huge win for Camino, Placerville, Auburn, and Nevada County seasonal spots. Clear mobile hours, live availability, and directions keep weekend visitors coming straight to your counter.",
      },
    ],
  },
];

export function getSpecialtyServiceBySlug(slug: string): SpecialtyService | undefined {
  return SPECIALTY_SERVICES.find((s) => s.slug === slug);
}

/** Map homepage Services section titles to their dedicated Phase 2 landing pages */
export function getServiceLandingHref(title: string): string | null {
  const lower = title.toLowerCase();
  if (lower.includes("rescue") || lower.includes("modernization") || lower.includes("high-converting")) {
    return "/services/website-rescues";
  }
  if (lower.includes("google") || lower.includes("map") || lower.includes("review")) {
    return "/services/google-business-optimization";
  }
  if (lower.includes("restaurant") || lower.includes("food truck") || lower.includes("menu")) {
    return "/services/restaurant-food-truck-menus";
  }
  return null;
}
