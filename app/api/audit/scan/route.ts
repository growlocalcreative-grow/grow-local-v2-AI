import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import {
  AuditValidationError,
  buildNoWebsiteChecks,
  scanWebsite,
} from "@/lib/audit-scanner";
import {
  BUSINESS_TYPE_LABELS,
  type AuditAiReport,
  type AuditScanResponse,
  type BusinessTypeOption,
} from "@/lib/audit-types";

export const dynamic = "force-dynamic";

const ALLOWED_BUSINESS_TYPES = new Set<BusinessTypeOption>([
  "contractor",
  "restaurant-food-truck",
  "shop-maker",
  "service-nonprofit",
]);

// Lightweight per-IP sliding-window rate limiter to protect Gemini quota
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 6;
const ipHits = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (ipHits.get(ip) || []).filter((ts) => ts > windowStart);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipHits.set(ip, recent);
    return false;
  }

  recent.push(now);
  ipHits.set(ip, recent);

  // Prevent unbounded map growth
  if (ipHits.size > 500) {
    for (const [key, timestamps] of ipHits.entries()) {
      if (timestamps.every((ts) => ts <= windowStart)) {
        ipHits.delete(key);
      }
    }
  }

  return true;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });
}

const AUDIT_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    headlineSummary: {
      type: Type.STRING,
      description:
        "1 to 2 warm, plain-English sentences summarizing what is working and the biggest opportunity for this local business.",
    },
    recommendedSpecialty: {
      type: Type.STRING,
      enum: ["website-rescues", "google-business-optimization", "restaurant-food-truck-menus"],
      description: "The single best-fit Grow Local Creative specialty for this business.",
    },
    recommendedSpecialtyReason: {
      type: Type.STRING,
      description: "One short sentence explaining why this specialty fits their exact situation.",
    },
    topLeaks: {
      type: Type.ARRAY,
      description: "Exactly 3 prioritized leaks or opportunities, ordered from highest impact first.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "Short plain-English title under 10 words.",
          },
          severity: {
            type: Type.STRING,
            enum: ["high", "medium", "quick-win"],
          },
          whatWeFound: {
            type: Type.STRING,
            description: "1 sentence grounded strictly in the real scan facts or no-website status.",
          },
          whyItCostsCustomers: {
            type: Type.STRING,
            description: "1 practical sentence explaining how this costs local calls, visits, or orders.",
          },
          howToFix: {
            type: Type.STRING,
            description: "1 to 2 clear, actionable, jargon-free steps the owner can take.",
          },
        },
        required: ["title", "severity", "whatWeFound", "whyItCostsCustomers", "howToFix"],
      },
    },
    quickWins: {
      type: Type.ARRAY,
      description: "Exactly 3 simple 5-minute DIY quick wins the owner can do this week.",
      items: { type: Type.STRING },
    },
  },
  required: [
    "headlineSummary",
    "recommendedSpecialty",
    "recommendedSpecialtyReason",
    "topLeaks",
    "quickWins",
  ],
};

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            "You've run several audits in the last few minutes. Please wait a couple of minutes before running another scan, or book a free 15-minute chat with Renee directly.",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    // Honeypot anti-bot field
    if (typeof body.websiteTrap === "string" && body.websiteTrap.trim().length > 0) {
      return NextResponse.json({ error: "Unable to process request." }, { status: 400 });
    }

    const mode = body.mode === "no-website" ? "no-website" : "website";
    const businessType = ALLOWED_BUSINESS_TYPES.has(body.businessType)
      ? (body.businessType as BusinessTypeOption)
      : "contractor";
    const town =
      typeof body.town === "string" && body.town.trim().length > 0
        ? body.town.trim().slice(0, 80)
        : "Auburn, CA";
    const businessName =
      typeof body.businessName === "string" ? body.businessName.trim().slice(0, 120) : "";
    const rawUrl = typeof body.url === "string" ? body.url.trim() : "";

    let scanFacts = null;
    let checks;

    if (mode === "website") {
      if (!rawUrl) {
        return NextResponse.json(
          { error: "Please enter your website address, or switch to 'I Don't Have a Website Yet'." },
          { status: 400 }
        );
      }
      const scanned = await scanWebsite(rawUrl, businessType, town);
      scanFacts = scanned.facts;
      checks = scanned.checks;
    } else {
      checks = buildNoWebsiteChecks(businessType, town);
    }

    const ai = getAiClient();
    if (!ai) {
      return NextResponse.json(
        {
          error:
            "Our AI narrative writer is temporarily offline because the server GEMINI_API_KEY is not configured yet. Your real website checks completed below—please reach out to Renee at (916) 869-4142 for a personal walkthrough.",
          scanFacts,
          checks,
        },
        { status: 503 }
      );
    }

    const businessLabel = BUSINESS_TYPE_LABELS[businessType];
    const contextBlock =
      mode === "website" && scanFacts
        ? JSON.stringify(
            {
              mode: "live_website_scan",
              businessName: businessName || undefined,
              businessType: businessLabel,
              town,
              url: scanFacts.finalUrl,
              usesHttps: scanFacts.usesHttps,
              responseMs: scanFacts.responseMs,
              titleText: scanFacts.titleText || "(missing)",
              metaDescription: scanFacts.metaDescription || "(missing)",
              h1Text: scanFacts.h1Text || "(missing)",
              hasMobileViewport: scanFacts.hasMobileViewport,
              hasClickablePhone: scanFacts.hasClickablePhone,
              hasBookingOrContactCta: scanFacts.hasBookingOrContactCta,
              hasPdfMenuLink: scanFacts.hasPdfMenuLink,
              mentionsTown: scanFacts.mentionsTown,
              hasLocalBusinessSchema: scanFacts.hasLocalBusinessSchema,
              hasGoogleOrSocialLinks: scanFacts.hasGoogleOrSocialLinks,
              hasOpenGraph: scanFacts.hasOpenGraph,
              wordCount: scanFacts.wordCount,
            },
            null,
            2
          )
        : JSON.stringify(
            {
              mode: "no_website_yet",
              businessName: businessName || "(not provided)",
              businessType: businessLabel,
              town,
              note: "This local business does not have a website yet and wants to know the highest-impact steps to start showing up on Google and turning nearby searches into paying customers.",
            },
            null,
            2
          );

    const prompt = `You are Renee, founder of Grow Local Creative in Cool, CA — a warm, practical, neighbor-to-neighbor web designer and local Google Maps specialist serving small businesses across El Dorado, Placer, Nevada, and Sacramento Counties.

Voice rules:
- Write like a helpful local neighbor having coffee, NOT a corporate marketing agency.
- Plain English only. Avoid tech jargon, hype words ("skyrocket", "synergy", "revolutionary"), and NEVER invent numerical scores like "67/100".
- Ground every observation strictly in the real facts provided below. Never fabricate issues that contradict the scan facts, and acknowledge what is already working well.
- Mention their town (${town}) naturally.
- Choose the single best-fit Grow Local Creative specialty:
  - "restaurant-food-truck-menus" if they are a restaurant/food truck/bakery (especially if a PDF menu or no mobile menu is present).
  - "google-business-optimization" if their site basics are mostly okay or they have no website yet and their biggest gap is local town/Google Maps/Schema visibility.
  - "website-rescues" if their site is slow, missing mobile viewport, missing HTTPS, missing tap-to-call/CTA, or needs modernization.
- Return exactly 3 prioritized topLeaks (highest impact first) and exactly 3 concise 5-minute DIY quickWins.

Business & Scan Facts:
${contextBlock}`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: AUDIT_RESPONSE_SCHEMA,
      },
    });

    const rawText = aiResponse.text;
    if (!rawText) {
      return NextResponse.json(
        {
          error: "Our audit writer returned an empty response. Please try again in a moment.",
          scanFacts,
          checks,
        },
        { status: 502 }
      );
    }

    const aiReport = JSON.parse(rawText) as AuditAiReport;

    const payload: AuditScanResponse = {
      mode,
      businessName,
      businessType,
      town,
      scanFacts,
      checks,
      aiReport,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AuditValidationError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    const status =
      typeof (err as { status?: unknown })?.status === "number"
        ? (err as { status: number }).status
        : 502;
    const message = err instanceof Error ? err.message : "Unexpected audit error";
    console.error("[Audit Scan Error]", status, message);

    if (status === 429) {
      return NextResponse.json(
        {
          error:
            "Our AI audit tool is getting lots of local visitors right now. Please wait a minute and try again, or call Renee directly at (916) 869-4142.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error:
          "We hit a snag generating your custom audit report. Please try again in a moment or reach out to Renee directly.",
      },
      { status: status >= 400 && status < 600 ? status : 502 }
    );
  }
}
