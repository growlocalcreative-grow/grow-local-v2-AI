import { getDocument } from "@/lib/firestore-server";
import aiStudioConfig from "../firebase-applet-config.json";

// --- Types ---

export interface HeroContent {
  eyebrow: string;
  headline: string;
  headlineEmphasis: string;
  subhead: string;
  ctaLabel: string;
}

export interface AboutContent {
  badgeText: string;
  heading: string;
  paragraphs: string[];
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
}

// --- Defaults (used until an admin edits + saves content in Firestore) ---

export const DEFAULT_HERO: HeroContent = {
  eyebrow: "COOL, CA · GEORGETOWN DIVIDE · SERVING EL DORADO & PLACER COUNTIES",
  headline: "Getting Your Business",
  headlineEmphasis: "Online, Made Simple",
  subhead:
    "I'm your neighborhood professional button pusher — helping small businesses, nonprofits, churches, and local makers across the Divide get a simple, working website without the tech headache. No jargon, no big-agency price tag, just a neighbor who's good with computers.",
  ctaLabel: "Let's Chat",
};

export const DEFAULT_ABOUT: AboutContent = {
  badgeText: "A Neighbor, Not a Corporation",
  heading: "\"Hi, I'm your local professional button pusher.\"",
  paragraphs: [
    "I live right here in Cool, CA, and I spend a lot of my time helping folks across the Foothills — small business owners, nonprofit leaders, church volunteers, and local makers — who just need their business online and aren't sure where to start.",
    "No computer science degree, no fancy corporate team. I'm entrepreneurial, mostly self-taught, and I genuinely enjoy figuring this stuff out so you don't have to.",
    "I'll also be upfront with you: I lean on AI tools to help me build faster and keep my prices down. Sometimes that means the code under the hood isn't picture-perfect because of my own prompts — but the site you see and use works, and I test everything myself before it ever goes live.",
    "Whether you need a simple one-page site, help getting found on Google, or just someone to explain what all this \"online\" stuff even means, I'm here to push the buttons so you don't have to.",
  ],
};

export const DEFAULT_SERVICES: ServicesContent = {
  heading: "Simple Web Tools for Local Neighbors",
  subheading:
    "No jargon, no enterprise price tag — just the basics done right, so your business, nonprofit, or passion project can be found online.",
  items: [
    {
      title: "Basic Website Setup",
      description:
        "A clean, simple site that tells people who you are, what you do, and how to reach you. Perfect if you don't have a website yet.",
      icon: "Globe",
      badge: "POPULAR",
    },
    {
      title: "Website Rescues",
      description:
        "If your current site is broken, outdated, or just plain embarrassing, I'll clean it up and get it working again.",
      icon: "LifeBuoy",
    },
    {
      title: "Google Business Profile Setup",
      description:
        "Make sure local folks can actually find you when they search. I'll get your Google listing dialed in so you show up.",
      icon: "Search",
    },
    {
      title: "Simple Contact & Booking Forms",
      description:
        "A basic way for people to reach out or book time with you, right from your site — no complicated software to learn.",
      icon: "Smartphone",
    },
    {
      title: "Nonprofit & Community Pages",
      description:
        "Churches, clubs, and local nonprofits get the same simple, honest approach — built to fit a volunteer budget.",
      icon: "Heart",
    },
    {
      title: "AI-Assisted Builds, Transparently",
      description:
        "I use AI tools to build faster and keep costs down, and I'm upfront about that. I test everything myself before you ever see it.",
      icon: "Sparkles",
    },
  ],
};

export const DEFAULT_FREEBIES: FreebiesContent = {
  eyebrow: "Special Offers",
  heading: "Community Freebies",
  subheading:
    "I'm a maker first. Sometimes the best way to start a partnership is by helping you solve a small problem for free.",
  items: [
    {
      title: "Free Website Audit",
      description:
        "Got an existing site but not getting any calls or messages? I'll look it over and send you a quick video with 3 simple fixes to stop losing folks.",
      icon: "Search",
      buttonText: "Get My Free Audit",
      href: "mailto:growlocalcreative@gmail.com?subject=Free%20Website%20Audit%20Request&body=Hi%20Renee%2C%20I'd%20love%20a%20free%20audit%20on%20my%20current%20website%20to%20see%20where%20I'm%20losing%20folks.%20Here%20is%20my%20current%20domain%3A",
    },
    {
      title: "Free Business Landing Page",
      description:
        "Don't have a website at all? Let's get you on the map. I'll set up a simple, clean, single-page site so local folks can actually find you — whether you run a small shop, a nonprofit, or a side hustle.",
      icon: "Monitor",
      buttonText: "Claim My Free Page",
      href: "mailto:growlocalcreative@gmail.com?subject=Free%20Landing%20Page%20Inquiry&body=Hi%20Renee%2C%20I%20don't%20have%20a%20website%20yet%20and%20I'd%20love%20to%20chat%20about%20setting%20up%20a%20free%20basic%20landing%20page%20for%20my%20business.",
    },
  ],
};

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heading: string;
  subheading: string;
  items: FaqItem[];
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
}

export const DEFAULT_FAQ: FaqContent = {
  heading: "Common Questions",
  subheading: "The stuff folks usually ask before reaching out.",
  items: [
    {
      question: "Do I need to already have a domain or hosting?",
      answer:
        "Nope. If you don't have a domain yet, I'll walk you through getting one and getting it connected. If you already have a site somewhere, I can work with what's there.",
    },
    {
      question: "Do you work with nonprofits and churches, not just businesses?",
      answer:
        "Yes. I work with small businesses, nonprofits, churches, and local makers across the Georgetown Divide and El Dorado & Placer Counties — the approach is the same simple, honest process either way.",
    },
    {
      question: "What does the free website audit actually include?",
      answer:
        "I'll look over your current site and send you a short video walking through 3 simple fixes that could help you get more calls or messages from it — no obligation.",
    },
    {
      question: "You mentioned using AI tools. What does that mean for my site?",
      answer:
        "I use AI-assisted tools to build faster and keep costs down, which I think is only fair to be upfront about. I test every site myself before it goes live, so you're never the first one finding the bugs.",
    },
    {
      question: "Do I need to sign a long contract?",
      answer:
        "No long contracts. We talk about what you need, I give you a straightforward price, and we go from there — neighbor to neighbor.",
    },
  ],
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
  footerDescription: "Helping small businesses, nonprofits, and makers across the Georgetown Divide push the right buttons so life stays simpler.",
  socialLinks: [
    { platform: "Instagram", url: "https://instagram.com/growlocalcreative", isEnabled: true },
    { platform: "Facebook", url: "https://facebook.com/growlocalcreative", isEnabled: true },
    { platform: "LinkedIn", url: "https://linkedin.com/company/growlocalcreative", isEnabled: false },
  ],
};



async function fetchContentDoc<T>(docId: string, fallback: T): Promise<T> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || aiStudioConfig.projectId;
  
  if (!projectId) {
    console.warn(`[Content] No project ID found. Skipping fetch for ${docId}`);
    return fallback;
  }

  try {
    const data = await getDocument("content", docId);
    if (data) {
      console.log(`[Content] Successfully fetched ${docId} from Firestore`);
      return { ...fallback, ...data } as T;
    }
    console.log(`[Content] No document found for ${docId}, using defaults`);
    return fallback;
  } catch (error) {
    console.warn(`[Content] Failed to load content/${docId} from Firestore REST API. Using default values.`, error);
    return fallback;
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const getHeroContent = () => fetchContentDoc<HeroContent>("hero", DEFAULT_HERO);
export const getAboutContent = () => fetchContentDoc<AboutContent>("about", DEFAULT_ABOUT);
export const getServicesContent = () => fetchContentDoc<ServicesContent>("services", DEFAULT_SERVICES);
export const getFreebiesContent = () => fetchContentDoc<FreebiesContent>("freebies", DEFAULT_FREEBIES);
export const getFaqContent = () => fetchContentDoc<FaqContent>("faq", DEFAULT_FAQ);

export async function getSiteSettingsContent(): Promise<SiteSettings> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || aiStudioConfig.projectId;
  
  if (!projectId) {
    return DEFAULT_SETTINGS;
  }

  try {
    const data = await getDocument("site_settings", "global");
    if (data) {
      console.log(`[Content] Successfully fetched site_settings from Firestore`);
      return { ...DEFAULT_SETTINGS, ...data } as SiteSettings;
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.warn(`[Content] Failed to load site_settings from Firestore. Using defaults.`, error);
    return DEFAULT_SETTINGS;
  }
}
