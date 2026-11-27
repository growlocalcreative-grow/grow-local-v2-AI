import dns from "node:dns/promises";
import type {
  AuditCheckItem,
  AuditScanFacts,
  BusinessTypeOption,
} from "@/lib/audit-types";

export class AuditValidationError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "AuditValidationError";
    this.status = status;
  }
}

const BLOCKED_HOSTNAME_SUFFIXES = [
  ".localhost",
  ".local",
  ".internal",
  ".arpa",
  ".lan",
  ".home",
  ".corp",
  ".intranet",
  ".localdomain",
];

function isIpv4Literal(host: string): boolean {
  const parts = host.split(".");
  if (parts.length !== 4) return false;
  return parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) >= 0 && Number(part) <= 255);
}

function isIpv6Literal(host: string): boolean {
  const cleaned = host.replace(/^\[|\]$/g, "");
  return cleaned.includes(":") && /^[0-9a-f:.]+$/i.test(cleaned);
}

function isPrivateOrReservedIpv4(ip: string): boolean {
  const parts = ip.split(".").map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true;
  }
  const [a, b] = parts;
  if (a === 0) return true; // 0.0.0.0/8
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 CGNAT
  if (a === 127) return true; // 127.0.0.0/8 loopback
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local & cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 0 && parts[2] === 0) return true; // 192.0.0.0/24
  if (a === 192 && b === 0 && parts[2] === 2) return true; // TEST-NET-1
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 198 && (b === 18 || b === 19)) return true; // 198.18.0.0/15
  if (a === 198 && b === 51 && parts[2] === 100) return true; // TEST-NET-2
  if (a === 203 && b === 0 && parts[2] === 113) return true; // TEST-NET-3
  if (a >= 224) return true; // Multicast & reserved
  return false;
}

function isPrivateOrReservedIpv6(ip: string): boolean {
  const lower = ip.toLowerCase().replace(/^\[|\]$/g, "");
  if (lower === "::1" || lower === "::") return true;
  if (lower.startsWith("fe80:") || lower.startsWith("fc") || lower.startsWith("fd")) return true;
  if (lower.startsWith("::ffff:")) {
    const mappedV4 = lower.slice(7);
    if (isIpv4Literal(mappedV4)) {
      return isPrivateOrReservedIpv4(mappedV4);
    }
    return true;
  }
  return false;
}

function isBlockedIpAddress(ip: string): boolean {
  if (isIpv4Literal(ip)) return isPrivateOrReservedIpv4(ip);
  if (isIpv6Literal(ip)) return isPrivateOrReservedIpv6(ip);
  return true;
}

async function resolvePublicAddresses(hostname: string): Promise<string[] | null> {
  try {
    const records = await dns.lookup(hostname, { all: true, verbatim: true });
    if (records && records.length > 0) {
      return records.map((r) => r.address);
    }
    return [];
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    const message = err instanceof Error ? err.message : "";
    // Cloudflare Workers nodejs_compat may not implement dns.lookup; fall back to DoH-backed resolve4/resolve6
    if (code === "ERR_NOT_IMPLEMENTED" || /not implemented/i.test(message)) {
      const [v4, v6] = await Promise.allSettled([
        dns.resolve4(hostname),
        dns.resolve6(hostname),
      ]);
      const ips: string[] = [];
      if (v4.status === "fulfilled") ips.push(...v4.value);
      if (v6.status === "fulfilled") ips.push(...v6.value);
      if (ips.length > 0) return ips;
      // If both resolve4 and resolve6 also report unimplemented, allow fetch on edge runtime
      const bothUnimplemented =
        (v4.status === "rejected" && /not implemented/i.test(String(v4.reason))) ||
        (v6.status === "rejected" && /not implemented/i.test(String(v6.reason)));
      return bothUnimplemented ? null : [];
    }
    throw err;
  }
}

/**
 * Normalizes and strictly validates a user-supplied URL to ensure only public
 * HTTP/HTTPS business domains can be inspected.
 */
export async function validatePublicUrl(rawInput: string): Promise<URL> {
  const trimmed = rawInput.trim();
  if (!trimmed || trimmed.length > 300) {
    throw new AuditValidationError("Please enter a valid website address (for example, yourbusiness.com).", 400);
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new AuditValidationError("That doesn't look like a valid website address. Try something like yourbusiness.com.", 400);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new AuditValidationError("Only standard http:// or https:// website addresses can be checked.", 400);
  }

  if (parsed.username || parsed.password) {
    throw new AuditValidationError("Please enter a public website address without login credentials.", 400);
  }

  if (parsed.port && parsed.port !== "80" && parsed.port !== "443") {
    throw new AuditValidationError("Please enter a standard public website address without custom port numbers.", 400);
  }

  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, "");
  if (
    !hostname ||
    hostname === "localhost" ||
    hostname === "metadata.google.internal" ||
    hostname.includes(":") ||
    isIpv4Literal(hostname) ||
    isIpv6Literal(hostname) ||
    !hostname.includes(".") ||
    !/\.[a-z]{2,24}$/i.test(hostname) ||
    BLOCKED_HOSTNAME_SUFFIXES.some((suffix) => hostname.endsWith(suffix))
  ) {
    throw new AuditValidationError(
      "Please enter a public business domain name (like yourbusiness.com) rather than a local or IP address.",
      400
    );
  }

  // Resolve DNS to guard against domains pointing at private/internal networks
  try {
    const addresses = await resolvePublicAddresses(hostname);
    if (addresses !== null) {
      if (addresses.length === 0) {
        throw new AuditValidationError(
          `We couldn't find a live website at ${hostname}. Double-check the spelling and try again.`,
          422
        );
      }
      for (const ip of addresses) {
        if (isBlockedIpAddress(ip)) {
          throw new AuditValidationError(
            "That web address points to a private network and cannot be audited.",
            400
          );
        }
      }
    }
  } catch (err) {
    if (err instanceof AuditValidationError) throw err;
    throw new AuditValidationError(
      `We couldn't reach ${hostname}. Please double-check the spelling or make sure the website is online.`,
      422
    );
  }

  return parsed;
}

const MAX_HTML_BYTES = 260_000;
const FETCH_TIMEOUT_MS = 7500;
const MAX_REDIRECTS = 3;

function decodeBasicEntities(input: string): string {
  return input
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(html: string): string {
  return decodeBasicEntities(html.replace(/<[^>]*>/g, " "));
}

function extractMetaContent(html: string, attrName: string, attrValue: string): string {
  const escaped = attrValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta\\b[^>]*\\b${attrName}\\s*=\\s*["']${escaped}["'][^>]*\\bcontent\\s*=\\s*["']([^"']*)["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<meta\\b[^>]*\\bcontent\\s*=\\s*["']([^"']*)["'][^>]*\\b${attrName}\\s*=\\s*["']${escaped}["'][^>]*>`,
      "i"
    ),
  ];
  for (const regex of patterns) {
    const match = html.match(regex);
    if (match?.[1]) return decodeBasicEntities(match[1]);
  }
  return "";
}

async function readBoundedText(res: Response, maxBytes: number): Promise<{ text: string; bytes: number }> {
  const reader = res.body?.getReader();
  if (!reader) {
    const text = (await res.text()).slice(0, maxBytes);
    return { text, bytes: new TextEncoder().encode(text).byteLength };
  }

  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      const remaining = maxBytes - total;
      if (remaining <= 0) {
        await reader.cancel();
        break;
      }
      if (value.byteLength > remaining) {
        chunks.push(value.subarray(0, remaining));
        total += remaining;
        await reader.cancel();
        break;
      }
      chunks.push(value);
      total += value.byteLength;
    }
  } catch {
    // Return what we captured so far if stream closes early
  }

  const combined = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const decoder = new TextDecoder("utf-8", { fatal: false });
  return { text: decoder.decode(combined), bytes: total };
}

export async function scanWebsite(
  rawUrl: string,
  businessType: BusinessTypeOption,
  town: string
): Promise<{ facts: AuditScanFacts; checks: AuditCheckItem[] }> {
  let currentUrl = await validatePublicUrl(rawUrl);
  const start = Date.now();
  let response: Response | null = null;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      response = await fetch(currentUrl.toString(), {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": "GrowLocalCreativeAuditBot/1.0 (+https://growlocalcreative.com/audit)",
          Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5",
          "Accept-Language": "en-US,en;q=0.9",
        },
        cache: "no-store",
      });
    } catch (err: unknown) {
      clearTimeout(timer);
      const isTimeout = err instanceof Error && err.name === "AbortError";
      throw new AuditValidationError(
        isTimeout
          ? `Your website took longer than ${FETCH_TIMEOUT_MS / 1000} seconds to respond — which is also a major reason mobile visitors leave on Foothill cell connections.`
          : `We couldn't connect to ${currentUrl.hostname}. Double-check the address or make sure the site is live.`,
        422
      );
    } finally {
      clearTimeout(timer);
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) break;
      if (hop === MAX_REDIRECTS) {
        throw new AuditValidationError("That website redirected too many times before loading.", 422);
      }
      const nextRaw = new URL(location, currentUrl).toString();
      currentUrl = await validatePublicUrl(nextRaw);
      continue;
    }

    break;
  }

  if (!response) {
    throw new AuditValidationError("We couldn't retrieve a response from that website.", 422);
  }

  if (response.status >= 400) {
    throw new AuditValidationError(
      `That website returned an error (HTTP ${response.status}). Make sure the homepage URL is publicly accessible.`,
      422
    );
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType && !contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
    throw new AuditValidationError(
      "That link points to a file instead of a regular web page. Please enter your main homepage URL.",
      422
    );
  }

  const { text: html, bytes: htmlBytes } = await readBoundedText(response, MAX_HTML_BYTES);
  const responseMs = Math.max(1, Date.now() - start);

  // Extract deterministic facts
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const titleText = titleMatch ? stripTags(titleMatch[1]).slice(0, 140) : "";

  const metaDescription = extractMetaContent(html, "name", "description").slice(0, 240);
  const viewportMeta = extractMetaContent(html, "name", "viewport");
  const hasMobileViewport =
    viewportMeta.toLowerCase().includes("width=device-width") ||
    /name\s*=\s*["']viewport["']/i.test(html);

  const ogTitle = extractMetaContent(html, "property", "og:title");
  const hasOpenGraph = Boolean(ogTitle);

  const h1Match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const h1Text = h1Match ? stripTags(h1Match[1]).slice(0, 140) : "";

  const hasClickablePhone = /href\s*=\s*["']tel:/i.test(html);
  const hasBookingOrContactCta =
    /href\s*=\s*["']mailto:/i.test(html) ||
    /<form\b/i.test(html) ||
    /(calendar\.app\.google|calendly\.com|square\.site|toasttab\.com|opentable\.com|acuityscheduling\.com|jobber\.com|housecallpro\.com)/i.test(
      html
    ) ||
    /(book now|schedule|request a quote|free quote|free estimate|order online|contact us|get a quote)/i.test(
      html
    );

  const hasPdfMenuLink = /\.pdf(["'?#]|$)/i.test(html);

  const hasLocalBusinessSchema =
    /application\/ld\+json/i.test(html) &&
    /(LocalBusiness|Restaurant|FoodEstablishment|Bakery|CafeOrCoffeeShop|HomeAndConstructionBusiness|GeneralContractor|Plumber|Electrician|HVACBusiness|Store|AutoRepair|ProfessionalService)/i.test(
      html
    );

  const hasGoogleOrSocialLinks =
    /(google\.com\/maps|g\.page|maps\.app\.goo\.gl|goo\.gl\/maps|instagram\.com|facebook\.com|yelp\.com)/i.test(
      html
    );

  // Strip scripts, styles, SVGs for visible text checks
  const visibleText = stripTags(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
  );

  const words = visibleText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const cleanTown = town.replace(/,?\s*CA$/i, "").trim().toLowerCase();
  const mentionsTown =
    cleanTown.length > 0 && cleanTown !== "other foothills / sacramento town"
      ? visibleText.toLowerCase().includes(cleanTown) ||
        titleText.toLowerCase().includes(cleanTown) ||
        metaDescription.toLowerCase().includes(cleanTown)
      : /(el dorado|placer|nevada county|sacramento|foothills|auburn|roseville|placerville|folsom|cool)/i.test(
          visibleText
        );

  const usesHttps = currentUrl.protocol === "https:";

  const facts: AuditScanFacts = {
    finalUrl: currentUrl.toString(),
    usesHttps,
    statusCode: response.status,
    responseMs,
    htmlBytes,
    titleText,
    metaDescription,
    h1Text,
    hasMobileViewport,
    hasClickablePhone,
    hasBookingOrContactCta,
    hasPdfMenuLink,
    mentionsTown,
    hasLocalBusinessSchema,
    hasGoogleOrSocialLinks,
    hasOpenGraph,
    wordCount,
  };

  const checks: AuditCheckItem[] = [
    {
      id: "https",
      label: "Secure HTTPS Connection",
      status: usesHttps ? "pass" : "fail",
      detail: usesHttps
        ? "Your site loads over secure HTTPS, so browsers don't show a 'Not Secure' warning."
        : "Your site loaded without HTTPS, which can trigger scary browser security warnings.",
    },
    {
      id: "speed",
      label: "Homepage Server Speed",
      status: responseMs <= 1200 ? "pass" : responseMs <= 2500 ? "warn" : "fail",
      detail:
        responseMs <= 1200
          ? `Responded in ${(responseMs / 1000).toFixed(2)}s — nice and quick for local cell connections.`
          : responseMs <= 2500
            ? `Responded in ${(responseMs / 1000).toFixed(2)}s — a bit sluggish on spotty Foothill cell reception.`
            : `Took ${(responseMs / 1000).toFixed(2)}s just to send the first page — mobile visitors often bounce before it loads.`,
    },
    {
      id: "mobile",
      label: "Mobile Screen Setup",
      status: hasMobileViewport ? "pass" : "fail",
      detail: hasMobileViewport
        ? "Includes a mobile viewport tag so the layout scales to phone screens."
        : "Missing a mobile viewport tag — visitors on smartphones have to pinch and zoom.",
    },
    {
      id: "tap-to-call",
      label: "One-Tap Call & Contact Path",
      status: hasClickablePhone && hasBookingOrContactCta ? "pass" : hasClickablePhone || hasBookingOrContactCta ? "warn" : "fail",
      detail:
        hasClickablePhone && hasBookingOrContactCta
          ? "Found both a clickable tap-to-call phone link and a clear contact or booking path."
          : hasClickablePhone
            ? "Found a tap-to-call phone link, but no obvious quote, booking, or contact form."
            : hasBookingOrContactCta
              ? "Found a contact/booking path, but no clickable tap-to-call (tel:) phone button for smartphone visitors."
              : "Couldn't spot a clickable tap-to-call phone link or obvious quote/booking button in the page HTML.",
    },
    {
      id: "local-seo",
      label: `Local Search Signals (${town})`,
      status:
        titleText && h1Text && mentionsTown
          ? "pass"
          : titleText || h1Text
            ? "warn"
            : "fail",
      detail:
        titleText && h1Text && mentionsTown
          ? `Your homepage includes a page title, main headline, and mentions ${town}.`
          : !mentionsTown
            ? `Your homepage HTML doesn't clearly mention ${town} — making it harder for Google and AI search to connect you with nearby neighbors.`
            : `Missing a clear ${!h1Text ? "main <h1> headline" : "page title"} on the homepage.`,
    },
    {
      id: "schema",
      label: "Google & AI Business Tags (Schema)",
      status: hasLocalBusinessSchema ? "pass" : "warn",
      detail: hasLocalBusinessSchema
        ? "Detected structured LocalBusiness data that helps Google and AI tools read your business details."
        : "No LocalBusiness Schema.org tag detected — adding one helps Google Maps and AI search recommend you accurately.",
    },
  ];

  if (businessType === "restaurant-food-truck") {
    checks.push({
      id: "pdf-menu",
      label: "Mobile-Friendly Menu (No Clunky PDF)",
      status: hasPdfMenuLink ? "fail" : "pass",
      detail: hasPdfMenuLink
        ? "Detected a .pdf link on your homepage — hungry customers on phones hate pinching and zooming PDF menus, and Google struggles to index them."
        : "No clunky PDF links detected on the homepage.",
    });
  } else if (hasPdfMenuLink) {
    checks.push({
      id: "pdf-links",
      label: "Mobile-Friendly Info (PDF Links Found)",
      status: "warn",
      detail:
        "Detected one or more PDF links on your homepage — make sure key pricing or service info is also readable right on the page for phone visitors.",
    });
  }

  return { facts, checks };
}

export function buildNoWebsiteChecks(businessType: BusinessTypeOption, town: string): AuditCheckItem[] {
  const checks: AuditCheckItem[] = [
    {
      id: "no-site",
      label: "Dedicated Local Website",
      status: "fail",
      detail: `Right now, neighbors in ${town} searching Google don't have an official website of yours to verify your services, hours, or credibility.`,
    },
    {
      id: "gbp",
      label: "Google Business Profile & Maps Pin",
      status: "warn",
      detail:
        "Without a website linked to your Google Business Profile, you miss out on strong local ranking signals and look less established than competitors.",
    },
    {
      id: "tap-to-call",
      label: "24/7 Tap-to-Call & Quote Capture",
      status: "fail",
      detail:
        "Relying only on social media DMs or word of mouth means losing folks who search Google after hours and want an instant way to call or request a quote.",
    },
    {
      id: "ownership",
      label: "Platform Ownership",
      status: "warn",
      detail:
        "Social profiles like Facebook or Instagram can change algorithms or hide your posts — your own domain gives you a storefront you own 100%.",
    },
  ];

  if (businessType === "restaurant-food-truck") {
    checks.push({
      id: "mobile-menu",
      label: "Searchable Mobile Menu & Hours",
      status: "fail",
      detail:
        "Hungry customers searching on their phones want instant access to your menu, prices, and today's location without hunting through social posts.",
    });
  }

  return checks;
}
