import { getDocument } from "@/lib/firestore-server";
import aiStudioConfig from "../firebase-applet-config.json";

// --- Types ---

export interface HeroContent {
  eyebrow: string;
  headline: string;
  headlineEmphasis: string;
  subhead: string;
  ctaLabel: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface AboutContent {
  badgeText: string;
  heading: string;
  paragraphs: string[];
  backgroundColor?: string;
  textColor?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

export interface ServicesContent {
  heading: string;
  subheading: string;
  items: ServiceItem[];
  backgroundColor?: string;
  textColor?: string;
}

export interface FreebieItem {
  title: string;
  description: string;
  icon: string;
  buttonText: string;
  href: string;
}

export interface FreebiesContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  items: FreebieItem[];
  backgroundColor?: string;
  textColor?: string;
}

export interface FutureItem {
  title: string;
  description: string;
  icon: string;
  slug: string;
}

export interface FutureContent {
  heading: string;
  subheading: string;
  items: FutureItem[];
  backgroundColor?: string;
  textColor?: string;
}

export interface PartnerProject {
  id: string;
  name: string;
  url: string;
  displayUrl: string;
  status: "live" | "in-progress";
  statusLabel: string;
  category: string;
  tagline: string;
  problemSolved: string;
  description: string;
  features: string[];
  metrics: { label: string; value: string }[];
  accentColor: string;
  seed: string;
  gradient: string;
}

export interface PartnersPageContent {
  eyebrow: string;
  headline: string;
  headlineEmphasis: string;
  subhead: string;
  bannerTitle: string;
  bannerDescription: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  projects: PartnerProject[];
}

// --- Defaults (used until an admin edits + saves content in Firestore) ---

export const DEFAULT_HERO: HeroContent = {
  eyebrow: "COOL · AUBURN · PLACERVILLE · EL DORADO & PLACER COUNTIES",
  headline: "Turn More Local Searches Into",
  headlineEmphasis: "Paying Customers",
  subhead:
    "Fast, modern websites, clear mobile menus, and local search foundations built for Foothill contractors, specialty eateries, bakeries, and makers. Straightforward digital tools that make your phone ring, showcase your craft, and help neighbors find you.",
  ctaLabel: "Book a Free 15-Min Chat",
  backgroundColor: "#F7F4ED",
  textColor: "#1A1A1A",
};

export const DEFAULT_ABOUT: AboutContent = {
  badgeText: "Local Partner · Foothills Proud",
  heading: "\"Hi, I'm your local digital growth partner.\"",
  paragraphs: [
    "I live right here in Cool, CA, working with hard-working small business owners across the Georgetown Divide, Auburn, Placerville, and the Foothills. Whether you're running a trade crew, serving up comfort food at a local eatery or food truck, or crafting specialty goods, your business deserves a digital presence that actually drives revenue.",
    "Most agencies charge big-city prices and speak in confusing tech jargon. I don't. I take a practical, builder's approach: websites that load in a flash on spotty foothill cell connections, clear Google presence, and frictionless forms that send customer inquiries straight to your phone.",
    "I build custom, modern systems tailored to how rural and foothill businesses actually operate — whether that's an online menu for hungry weekenders, an instant quote form for home services, or getting your Google listing to reflect your real hours and location.",
    "Whether your current site is slow and outdated, or you're starting fresh, I'm right down the road to help you look great, build trust, and win more local business.",
  ],
  backgroundColor: "#FFFFFF",
  textColor: "#1A1A1A",
};

export const DEFAULT_SERVICES: ServicesContent = {
  heading: "Practical Digital Tools for Local Businesses & Shops",
  subheading:
    "Built specifically for Foothill contractors, specialty eateries, retail shops, and makers who want more local customers without the tech headache.",
  items: [
    {
      title: "High-Converting Local Websites",
      description:
        "Clean, fast, mobile-first websites designed to turn visitors into phone calls and store visits. Perfectly tailored for trade contractors, local shops, and independent businesses.",
      icon: "Globe",
      badge: "MOST POPULAR",
    },
    {
      title: "Restaurant & Food Truck Menus",
      description:
        "Ditch the clunky, unreadable PDF menus. Give customers a snappy, mobile-first menu with clear pricing, daily hours, and catering inquiry forms that actually look appetizing.",
      icon: "Utensils",
      badge: "FOOD & SPECIALTY",
    },
    {
      title: "Google Business & Map Optimization",
      description:
        "Get your Google Business Profile claimed, verified, and dialed in with proper categories, hours, and photos so nearby neighbors find you first when searching.",
      icon: "MapPin",
      badge: "SEARCH READY",
    },
    {
      title: "Instant Lead & Quote Alerts",
      description:
        "Stop losing customers to phone tag. Custom contact and quote-request forms that route inquiries straight to your phone as an instant text or email notification.",
      icon: "Smartphone",
    },
    {
      title: "Website Rescues & Modernization",
      description:
        "Is your current site broken, slow, or embarrassing on a smartphone? We modernize your existing domain in days so you can proudly put it on your truck, flyer, or storefront.",
      icon: "LifeBuoy",
    },
    {
      title: "5-Star Review & Reputation Booster",
      description:
        "A frictionless 1-tap review link to text happy customers after a job or meal, helping you climb Google Maps by collecting genuine 5-star reviews on autopilot.",
      icon: "Star",
    },
  ],
  backgroundColor: "#F7F4ED",
  textColor: "#1A1A1A",
};

export const DEFAULT_FREEBIES: FreebiesContent = {
  eyebrow: "Zero-Risk Support",
  heading: "Free Foothill Growth Resources",
  subheading:
    "No pressure, no hard sell. Just honest, practical guidance from a neighbor to help your local business stand out and thrive.",
  items: [
    {
      title: "Free 3-Minute Video 'Leak' Audit",
      description:
        "Send over your website or Google listing. I'll record a private 3-minute video showing 3 specific spots where you might be losing local customers to competitors.",
      icon: "Search",
      buttonText: "Request My Free Audit",
      href: "mailto:growlocalcreative@gmail.com?subject=Free%203-Minute%20Website%20Audit&body=Hi%20Renee%2C%20I'd%20love%20a%20free%203-minute%20video%20audit%20of%20my%20business%20presence.%20My%20business%20name%20or%20website%20is%3A",
    },
    {
      title: "Google Search & Mobile Readiness Check",
      description:
        "Unsure if your Google Maps pin, hours, and mobile view are set up properly? I'll review your local presence and email you a simple checklist of quick wins you can implement right away.",
      icon: "CheckCircle2",
      buttonText: "Get My Readiness Check",
      href: "mailto:growlocalcreative@gmail.com?subject=Google%20Readiness%20Check&body=Hi%20Renee%2C%20could%20you%20check%20my%20Google%20listing%20and%20tell%20me%20what%20quick%20improvements%20I%20should%20make%3F%20My%20business%20name%20is%3A",
    },
  ],
  backgroundColor: "#F7F4ED",
  textColor: "#1A1A1A",
};

export const DEFAULT_FUTURE: FutureContent = {
  heading: "What's Coming Next",
  subheading: "Practical digital tools built one neighbor at a time for real everyday business needs.",
  items: [
    {
      title: "Interactive Digital Menus & Daily Specials",
      description: "Update your daily specials, soup of the day, or sold-out items from your phone in 10 seconds — without touching any code.",
      icon: "Utensils",
      slug: "digital-menu-specials",
    },
    {
      title: "Instant QR & Link-in-Bio Card",
      description: "One clean link you can put on table tents, takeout boxes, or flyers pointing people to your menu, Instagram, and Google review link.",
      icon: "Store",
      slug: "link-in-bio",
    },
    {
      title: "Simple Customer & Estimate Tracker",
      description: "A lightweight way to track catering inquiries, estimates, or loyal customers without getting bogged down in complicated spreadsheets.",
      icon: "Clock",
      slug: "simple-contact-tracker",
    },
  ],
  backgroundColor: "#F7F4ED",
  textColor: "#1A1A1A",
};

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heading: string;
  subheading: string;
  items: FaqItem[];
  backgroundColor?: string;
  textColor?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  isEnabled: boolean;
}

export interface SiteSettings {
  agencyName: string;
  email: string;
  phone: string;
  location: string;
  primaryColor: string;
  primaryForeground: string;
  secondaryColor: string;
  secondaryForeground: string;
  backgroundColor: string;
  foregroundColor: string;
  cardColor: string;
  borderColor: string;
  footerDescription: string;
  socialLinks: SocialLink[];
  sectionOrder: string[];
  hiddenSections: string[];
  newsletter: {
    isEnabled: boolean;
    title: string;
    description: string;
    cta: string;
    successMessage: string;
  };
}

export const DEFAULT_FAQ: FaqContent = {
  heading: "Common Questions",
  subheading: "Straightforward answers to the questions folks usually ask before reaching out.",
  items: [
    {
      question: "Do you only work with contractors, or do you also help restaurants, bakeries, and shops?",
      answer:
        "Both! We love working with Foothill trades (contractors, tree care, septic, landscaping) as well as our beloved local restaurants, bakeries, coffee spots, and makers. Whether you need a streamlined mobile menu, an instant quote calculator, or Google Maps setup, the focus is always on making it easy for customers to spend money with you.",
    },
    {
      question: "Will you guarantee that I rank #1 on Google?",
      answer:
        "No honest developer can guarantee a #1 ranking because Google's algorithm changes constantly. What we DO guarantee is building a bulletproof foundation: a verified Google Business Profile, accurate categories and hours, local search tags, blazing fast mobile speeds, and a 1-tap review link that helps you naturally rise above local competitors.",
    },
    {
      question: "Can I update my own menu, specials, or hours later?",
      answer:
        "Yes, absolutely. We hand over the keys and give you an easy way to update your weekly specials, menu items, or business hours with zero technical stress.",
    },
    {
      question: "What if I don't have a domain or website yet?",
      answer:
        "No problem at all. We will walk you through registering your domain, setting up your email, and getting everything connected. If you already have an existing site that needs a rescue, we can work with what you have.",
    },
    {
      question: "Do I have to sign a long-term contract?",
      answer:
        "Never. We talk through your goals, give you a transparent, flat-rate project price, and deliver on time. Neighbor to neighbor, no corporate games.",
    },
  ],
  backgroundColor: "#FFFFFF",
  textColor: "#1A1A1A",
};

export const DEFAULT_PARTNERS: PartnersPageContent = {
  eyebrow: "OUR WORK & LOCAL PARTNERSHIPS",
  headline: "Real Local Work.",
  headlineEmphasis: "Real Community Impact.",
  subhead:
    "Take a look at the websites, mobile menus, and digital tools we've built right here in the Georgetown Divide and Foothills. From local contractors and business alliances to smokehouse menus and community charities—fast, honest, and built to turn interest into action.",
  bannerTitle: "Why We Build for Local Groups & Community Neighbors",
  bannerDescription:
    "When our neighbors thrive, the entire Georgetown Divide thrives. We build high-performance web systems for community clubs, local charities, and trade businesses alike because every local enterprise deserves a modern, lightning-fast digital storefront without corporate price tags, tech jargon, or monthly hostage fees.",
  ctaTitle: "Ready for a Website That Actually Rings Your Phone?",
  ctaDescription:
    "Whether you're a contractor looking to lock in high-margin jobs, a local bakery needing a menu folks can actually read, or a service business ready to get found on Google—let's build your 24/7 digital storefront.",
  ctaButtonText: "Book a Free 15-Minute Local Growth Chat",
  projects: [
    {
      id: "fixitcool",
      name: "Fix It Cool",
      url: "https://www.fixitcool.com",
      displayUrl: "www.fixitcool.com",
      status: "live",
      statusLabel: "Live Website",
      category: "Contractors & Home Repairs",
      tagline: "Turning urgent home repair searches into immediate phone calls.",
      problemSolved: "Homeowners in Cool and the Divide needed a fast way to find reliable local help without wading through corporate directories or non-responsive forms.",
      description: "Designed for immediate mobile action. Built to load in under a second on spotty Sierra cell reception, featuring prominent one-tap calling, clear repair service categories, and verified local Foothills service radiuses.",
      features: [
        "One-tap emergency call & text buttons in header",
        "Sub-second load times on rural 3G/LTE connections",
        "Focused service areas covering Cool, ALT & the Divide",
        "Clear upfront repair lists (carpentry, decks, plumbing, maintenance)"
      ],
      metrics: [
        { label: "Mobile Speed", value: "< 0.8s" },
        { label: "Conversion Focus", value: "Direct Call" },
        { label: "Target Area", value: "Georgetown Divide" }
      ],
      accentColor: "#2F5233",
      seed: "fixitcool",
      gradient: "from-emerald-950 via-slate-900 to-emerald-900"
    },
    {
      id: "alt-business",
      name: "ALT Business Connections",
      url: "https://www.altbusinessconnections.org",
      displayUrl: "www.altbusinessconnections.org",
      status: "live",
      statusLabel: "Live Website",
      category: "Business Alliance & Networking",
      tagline: "Keeping local commerce and connection circulating right here on the Divide.",
      problemSolved: "Local entrepreneurs needed a centralized digital home to showcase verified local merchants and drive attendance to monthly networking breakfasts.",
      description: "A welcoming, modern community hub that spotlights homegrown Divide businesses. Features an accessible directory, upcoming breakfast and mixer schedules, and straightforward membership paths to strengthen regional commerce.",
      features: [
        "Searchable local merchant & trade professional directory",
        "Monthly breakfast meeting announcements & RSVPs",
        "Community-first branding celebrating Divide business owners",
        "Frictionless updates without complex maintenance overhead"
      ],
      metrics: [
        { label: "Community Reach", value: "Georgetown Divide" },
        { label: "Member Hub", value: "Directory & Events" },
        { label: "Design Style", value: "Warm Foothill" }
      ],
      accentColor: "#B46524",
      seed: "altbusiness",
      gradient: "from-amber-950 via-stone-900 to-amber-900"
    },
    {
      id: "divide-womens-club",
      name: "Divide Women's Club",
      url: "https://www.dividewomensclub.org",
      displayUrl: "www.dividewomensclub.org",
      status: "live",
      statusLabel: "Live Website",
      category: "Community & Historic Nonprofit",
      tagline: "Decades of community giving, youth scholarships, and volunteer events made modern.",
      problemSolved: "A historic community anchor needed to modernize their outreach, simplify student scholarship applications, and boost turnout for community charity events.",
      description: "Serving our mountain towns for generations, the Divide Women's Club now has an elegant, high-accessibility web presence. Local students and parents can easily apply for scholarships, and neighbors can stay informed on seasonal fundraisers.",
      features: [
        "Digital scholarship application downloads & deadline alerts",
        "Seasonal event calendars (craft faires, bake sales, teas)",
        "High-contrast, large-print mobile friendly typography",
        "Tribute to decades of Foothill community heritage and service"
      ],
      metrics: [
        { label: "Impact", value: "Annual Scholarships" },
        { label: "Community", value: "Divide Towns" },
        { label: "Format", value: "Accessible & Clean" }
      ],
      accentColor: "#4B5542",
      seed: "dividewomen",
      gradient: "from-stone-950 via-zinc-900 to-emerald-950"
    },
    {
      id: "pigsure-bbq",
      name: "Pig-Sure Perfect BBQ",
      url: "https://pig-sure-perfect-bbq.growlocalcreative.workers.dev/",
      displayUrl: "pig-sure-perfect-bbq.workers.dev",
      status: "in-progress",
      statusLabel: "In The Workshop",
      category: "Artisanal Eatery & Catering",
      tagline: "Mouth-watering mobile menu & catering booking engine designed to pack the pit.",
      problemSolved: "Hungry customers abandoning slow, pinch-and-zoom PDF menus while trying to find weekend smokehouse pop-up locations.",
      description: "Nothing loses a customer faster than an unreadable PDF menu on a phone. For Pig-Sure Perfect BBQ, we designed an ultra-fast digital menu, real-time pop-up schedule, and instant catering quote pipeline that lets locals book authentic slow-smoked meats in seconds.",
      features: [
        "Zero-PDF mobile menu with vivid meats & sides breakdowns",
        "Automated event catering quote request form with guest-count slider",
        "Pop-up location tracker for weekend smoke sessions",
        "Edge-deployed on Cloudflare Workers for instant 50ms load times"
      ],
      metrics: [
        { label: "Menu Load", value: "< 300ms" },
        { label: "Hosting", value: "Cloudflare Edge" },
        { label: "Conversion", value: "Catering Bookings" }
      ],
      accentColor: "#8B2E15",
      seed: "pigsurebbq",
      gradient: "from-red-950 via-stone-900 to-amber-950"
    },
    {
      id: "cool-charity",
      name: "Cool Charity",
      url: "https://www.coolcharity.org",
      displayUrl: "www.coolcharity.org",
      status: "in-progress",
      statusLabel: "In The Workshop",
      category: "Grassroots Relief & Giving",
      tagline: "Direct, transparent grassroots aid when our foothill neighbors need it most.",
      problemSolved: "Traditional charity portals feel impersonal and take heavy administrative cuts. Cool Charity needed a direct, local platform focused on trust and direct neighbor aid.",
      description: "Hyper-local mutual aid runs on radical transparency. Cool Charity is being built to connect Foothill neighbors directly to relief drives, emergency storm aid, and volunteer support with zero overhead and zero corporate middleman.",
      features: [
        "Transparent project-by-project community donation trackers",
        "Volunteer shift & skill coordination board",
        "Winter weather & rural emergency relief resource hub",
        "100% focused on Cool and surrounding foothill communities"
      ],
      metrics: [
        { label: "Transparency", value: "100% Local" },
        { label: "Focus", value: "Community Aid" },
        { label: "Structure", value: "Grassroots" }
      ],
      accentColor: "#2A4D69",
      seed: "coolcharity",
      gradient: "from-sky-950 via-slate-900 to-teal-950"
    }
  ]
};

export const DEFAULT_SETTINGS: SiteSettings = {
  agencyName: "Grow Local Creative",
  email: "growlocalcreative@gmail.com",
  phone: "916-869-4142",
  location: "Based in Cool, CA",
  primaryColor: "#3D4337",
  primaryForeground: "#F7F4ED",
  secondaryColor: "#A1A68C",
  secondaryForeground: "#3D4337",
  backgroundColor: "#F7F4ED",
  foregroundColor: "#1A1A1A",
  cardColor: "#FFFFFF",
  borderColor: "#E5E5E5",
  footerDescription: "Helping Foothill small businesses, contractors, eateries, and makers build strong local presences that attract customers and keep life simple.",
  socialLinks: [
    { platform: "Instagram", url: "https://instagram.com/growlocalcreative", isEnabled: true },
    { platform: "Facebook", url: "https://facebook.com/growlocalcreative", isEnabled: true },
    { platform: "LinkedIn", url: "https://linkedin.com/company/growlocalcreative", isEnabled: false },
  ],
  sectionOrder: ["hero", "about", "services", "future", "freebies", "faq", "newsletter"],
  hiddenSections: [],
  newsletter: {
    isEnabled: true,
    title: "Grab the 5-Minute Google Maps Setup Checklist",
    description: "Get our step-by-step 1-page PDF checklist showing exactly how to optimize your Google Business profile so local Foothill neighbors find you first—plus occasional practical web tips.",
    cta: "Send Me the Free Checklist",
    successMessage: "You're all set! Check your inbox for your 5-Minute Google Maps Checklist."
  }
};



async function fetchContentDoc<T extends object>(docId: string, fallback: T): Promise<T> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || aiStudioConfig.projectId;
  
  if (!projectId) {
    console.warn(`[Content] No project ID found. Skipping fetch for ${docId}`);
    return fallback;
  }

  try {
    const data = await getDocument("content", docId);
    if (data) {
      console.log(`[Content] Successfully fetched ${docId} from Firestore`);
      // Robust merge: only overwrite if data[key] is not null/undefined
      const result = { ...fallback };
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          (result as any)[key] = data[key];
        }
      }
      return result as T;
    }
    console.log(`[Content] No document found for ${docId}, using defaults`);
    return fallback;
  } catch (error) {
    console.warn(`[Content] Failed to load content/${docId} from Firestore REST API. Using default values.`, error);
    return fallback;
  }
}

export const getHeroContent = () => fetchContentDoc<HeroContent>("hero", DEFAULT_HERO);
export const getAboutContent = () => fetchContentDoc<AboutContent>("about", DEFAULT_ABOUT);
export const getServicesContent = () => fetchContentDoc<ServicesContent>("services", DEFAULT_SERVICES);
export const getFreebiesContent = () => fetchContentDoc<FreebiesContent>("freebies", DEFAULT_FREEBIES);
export const getFutureContent = () => fetchContentDoc<FutureContent>("future", DEFAULT_FUTURE);
export const getFaqContent = () => fetchContentDoc<FaqContent>("faq", DEFAULT_FAQ);
export const getPartnersContent = () => fetchContentDoc<PartnersPageContent>("partners", DEFAULT_PARTNERS);

export async function getSiteSettingsContent(): Promise<SiteSettings> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || aiStudioConfig.projectId;
  
  if (!projectId) {
    return DEFAULT_SETTINGS;
  }

  try {
    const data = await getDocument("site_settings", "global");
    if (data) {
      console.log(`[Content] Successfully fetched site_settings from Firestore`);
      // Robust merge for settings
      const result = { ...DEFAULT_SETTINGS };
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          (result as any)[key] = data[key];
        }
      }
      // If newsletter is using old default copy, upgrade it to Option C checklist
      if (result.newsletter) {
        if (
          !result.newsletter.title ||
          result.newsletter.title === "Practical digital tips for Foothill business owners." ||
          result.newsletter.title === "Join the Digest"
        ) {
          result.newsletter.title = DEFAULT_SETTINGS.newsletter.title;
          result.newsletter.description = DEFAULT_SETTINGS.newsletter.description;
          result.newsletter.cta = DEFAULT_SETTINGS.newsletter.cta;
          result.newsletter.successMessage = DEFAULT_SETTINGS.newsletter.successMessage;
        }
      }
      return result as SiteSettings;
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.warn(`[Content] Failed to load site_settings from Firestore. Using defaults.`, error);
    return DEFAULT_SETTINGS;
  }
}
