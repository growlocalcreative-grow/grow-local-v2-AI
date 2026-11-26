import { NextRequest, NextResponse } from "next/server";
import { createDocument } from "@/lib/firestore-server";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Lightweight per-IP rate limiter for lead submissions
const LEAD_WINDOW_MS = 15 * 60 * 1000;
const LEAD_MAX_REQUESTS = 10;
const leadHits = new Map<string, number[]>();

function allowLeadRequest(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - LEAD_WINDOW_MS;
  const recent = (leadHits.get(ip) || []).filter((ts) => ts > windowStart);
  if (recent.length >= LEAD_MAX_REQUESTS) {
    leadHits.set(ip, recent);
    return false;
  }
  recent.push(now);
  leadHits.set(ip, recent);
  return true;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function sanitizeSafeUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().slice(0, 500);
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString().slice(0, 500);
    }
  } catch {
    // ignore invalid url
  }
  return "";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!allowLeadRequest(ip)) {
      return NextResponse.json(
        { error: "Too many submissions right now. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    // Honeypot check
    if (typeof body.companyFax === "string" && body.companyFax.trim().length > 0) {
      return NextResponse.json({ error: "Unable to process submission." }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || email.length > 256 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address so we can unlock your full action plan." },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
    const hasWebsite = Boolean(body.hasWebsite);
    const websiteUrl = hasWebsite ? sanitizeSafeUrl(body.websiteUrl) : "";
    const businessName = typeof body.businessName === "string" ? body.businessName.trim().slice(0, 140) : "";
    const businessType =
      typeof body.businessType === "string" && body.businessType.trim().length > 0
        ? body.businessType.trim().slice(0, 80)
        : "contractor";
    const town =
      typeof body.town === "string" && body.town.trim().length > 0
        ? body.town.trim().slice(0, 80)
        : "Auburn, CA";
    const recommendedSpecialty =
      typeof body.recommendedSpecialty === "string"
        ? body.recommendedSpecialty.trim().slice(0, 80)
        : "website-rescues";

    const rawTopIssues = Array.isArray(body.topIssues) ? body.topIssues : [];
    const topIssues = rawTopIssues
      .filter((item: unknown): item is string => typeof item === "string" && item.trim().length > 0)
      .slice(0, 5)
      .map((item: string) => item.trim().slice(0, 160));

    const summary = typeof body.summary === "string" ? body.summary.trim().slice(0, 800) : "";
    const createdAt = new Date().toISOString();

    const leadData = {
      email,
      name,
      phone,
      hasWebsite,
      websiteUrl,
      businessName,
      businessType,
      town,
      recommendedSpecialty,
      topIssues,
      summary,
      createdAt,
    };

    // Pass null as docId so Firestore uses POST with an auto-generated safe ID (create-only rule)
    const created = await createDocument("audit_leads", null, leadData);

    return NextResponse.json(
      {
        success: true,
        leadId: created?.id || null,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("[Audit Lead Error]", err);
    return NextResponse.json(
      { error: "We couldn't save your email right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}
