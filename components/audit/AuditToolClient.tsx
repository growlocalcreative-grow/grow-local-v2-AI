"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Lock,
  Unlock,
  Calendar,
  Phone,
  ArrowRight,
  Printer,
  RotateCcw,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { TARGET_CITIES } from "@/lib/content";
import {
  BUSINESS_TYPE_LABELS,
  type AuditCheckItem,
  type AuditLeak,
  type AuditScanFacts,
  type AuditScanResponse,
  type BusinessTypeOption,
  type RecommendedSpecialtySlug,
} from "@/lib/audit-types";

const SPECIALTY_META: Record<
  RecommendedSpecialtySlug,
  { name: string; href: string; cta: string }
> = {
  "website-rescues": {
    name: "Website Rescues & Modernization",
    href: "/services/website-rescues",
    cta: "See How Website Rescues Work",
  },
  "google-business-optimization": {
    name: "Google Business & Map Optimization",
    href: "/services/google-business-optimization",
    cta: "See Google Maps Optimization",
  },
  "restaurant-food-truck-menus": {
    name: "Restaurant & Food Truck Menus",
    href: "/services/restaurant-food-truck-menus",
    cta: "See Mobile Menu Solutions",
  },
};

const SCAN_STEPS_WEBSITE = [
  "Connecting to your live homepage...",
  "Checking mobile layout, speed & tap-to-call links...",
  "Reviewing local town signals & Google business tags...",
  "Writing your plain-English Top 3 Leaks report...",
];

const SCAN_STEPS_NO_WEBSITE = [
  "Reviewing local search competition in your town...",
  "Mapping the highest-impact first steps for your business type...",
  "Writing your plain-English Local Launch Plan...",
];

function StatusBadge({ status }: { status: AuditCheckItem["status"] }) {
  if (status === "pass") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
        <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" aria-hidden="true" />
        Looks Good
      </span>
    );
  }
  if (status === "warn") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" aria-hidden="true" />
        Needs Attention
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800">
      <XCircle className="h-4 w-4 text-rose-700 shrink-0" aria-hidden="true" />
      Missing
    </span>
  );
}

function SeverityText({ severity }: { severity: AuditLeak["severity"] }) {
  if (severity === "high") {
    return <span className="text-xs font-bold uppercase tracking-wider text-rose-800">High Priority</span>;
  }
  if (severity === "medium") {
    return <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Medium Priority</span>;
  }
  return <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Quick Win</span>;
}

function LeakCard({ leak, index }: { leak: AuditLeak; index: number }) {
  return (
    <article className="bg-white rounded-2xl border border-stone-200 p-6 md:p-7 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
          Priority Leak #{index + 1}
        </span>
        <SeverityText severity={leak.severity} />
      </div>

      <h3 className="font-heading text-xl md:text-2xl font-medium text-stone-900 leading-snug">
        {leak.title}
      </h3>

      <div className="space-y-3 text-sm md:text-base leading-relaxed text-stone-700">
        <p>
          <strong className="font-semibold text-stone-900">What we found: </strong>
          {leak.whatWeFound}
        </p>
        <p>
          <strong className="font-semibold text-stone-900">Why it costs local customers: </strong>
          {leak.whyItCostsCustomers}
        </p>
        <div className="bg-[#F7F4ED] rounded-xl p-4 border border-stone-200/80">
          <p className="text-stone-800">
            <strong className="font-semibold text-primary">How to fix it: </strong>
            {leak.howToFix}
          </p>
        </div>
      </div>
    </article>
  );
}

function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

interface AuditToolClientProps {
  bookingUrl: string;
  phone: string;
  email: string;
}

export function AuditToolClient({ bookingUrl, phone, email }: AuditToolClientProps) {
  const [mode, setMode] = useState<"website" | "no-website">("website");
  const [url, setUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessTypeOption>("contractor");
  const [town, setTown] = useState("Auburn, CA");
  const [websiteTrap, setWebsiteTrap] = useState("");

  const [scanning, setScanning] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [scanError, setScanError] = useState<string | null>(null);
  const [partialChecks, setPartialChecks] = useState<AuditCheckItem[] | null>(null);
  const [partialFacts, setPartialFacts] = useState<AuditScanFacts | null>(null);
  const [result, setResult] = useState<AuditScanResponse | null>(null);

  // Lead unlock form state
  const [unlocked, setUnlocked] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [companyFax, setCompanyFax] = useState("");
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  useEffect(() => {
    if (!scanning) {
      setStepIdx(0);
      return;
    }
    const steps = mode === "website" ? SCAN_STEPS_WEBSITE : SCAN_STEPS_NO_WEBSITE;
    const interval = setInterval(() => {
      setStepIdx((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, [scanning, mode]);

  async function handleRunAudit(e: React.FormEvent) {
    e.preventDefault();
    setScanError(null);
    setPartialChecks(null);
    setPartialFacts(null);
    setResult(null);
    setUnlocked(false);
    setLeadError(null);

    if (mode === "website" && !url.trim()) {
      setScanError("Please enter your website address (or choose 'I Don't Have a Website Yet').");
      return;
    }

    setScanning(true);
    try {
      const res = await fetch("/api/audit/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          url: mode === "website" ? url.trim() : "",
          businessName: businessName.trim(),
          businessType,
          town,
          websiteTrap,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setScanError(
          data?.error ||
            "We couldn't complete that audit right now. Please check the website address and try again."
        );
        if (Array.isArray(data?.checks)) {
          setPartialChecks(data.checks);
        }
        if (data?.scanFacts) {
          setPartialFacts(data.scanFacts);
        }
        return;
      }

      setResult(data as AuditScanResponse);
    } catch {
      setScanError(
        "We had trouble reaching our audit server. Please check your connection and try again."
      );
    } finally {
      setScanning(false);
    }
  }

  async function handleUnlockFullReport(e: React.FormEvent) {
    e.preventDefault();
    if (!result) return;
    setLeadError(null);

    const trimmedEmail = leadEmail.trim();
    if (!trimmedEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      setLeadError("Please enter a valid email address to unlock your full action plan.");
      return;
    }

    setSubmittingLead(true);
    try {
      const res = await fetch("/api/audit/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          name: leadName.trim(),
          phone: leadPhone.trim(),
          companyFax,
          hasWebsite: result.mode === "website",
          websiteUrl: result.scanFacts?.finalUrl || "",
          businessName: result.businessName || "",
          businessType: result.businessType,
          town: result.town,
          recommendedSpecialty: result.aiReport.recommendedSpecialty,
          topIssues: result.aiReport.topLeaks.map((l) => l.title).slice(0, 5),
          summary: result.aiReport.headlineSummary.slice(0, 800),
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setLeadError(data?.error || "We couldn't save your email right now. Please try again.");
        return;
      }

      setUnlocked(true);
    } catch {
      setLeadError("Network error while unlocking your report. Please try again.");
    } finally {
      setSubmittingLead(false);
    }
  }

  function handleReset() {
    setResult(null);
    setScanError(null);
    setPartialChecks(null);
    setPartialFacts(null);
    setUnlocked(false);
    setLeadError(null);
  }

  const activeSteps = mode === "website" ? SCAN_STEPS_WEBSITE : SCAN_STEPS_NO_WEBSITE;
  const cleanPhoneHref = `tel:${phone.replace(/[^0-9]/g, "")}`;

  return (
    <div className="space-y-10">
      {/* INPUT CARD */}
      {!result && (
        <div className="bg-white rounded-[2rem] border border-stone-200/90 shadow-sm p-6 sm:p-8 md:p-10">
          {/* Segmented Mode Toggle */}
          <div
            role="tablist"
            aria-label="Choose your current website status"
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#F7F4ED] border border-stone-200 mb-8"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "website"}
              onClick={() => {
                setMode("website");
                setScanError(null);
              }}
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                mode === "website"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              <Globe className="h-4 w-4" aria-hidden="true" />
              Audit My Existing Website
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "no-website"}
              onClick={() => {
                setMode("no-website");
                setScanError(null);
              }}
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                mode === "no-website"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              I Don&apos;t Have a Website Yet
            </button>
          </div>

          <form onSubmit={handleRunAudit} className="space-y-6" noValidate>
            {/* Honeypot anti-bot field */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="audit-website-trap">Leave this field empty</label>
              <input
                id="audit-website-trap"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={websiteTrap}
                onChange={(e) => setWebsiteTrap(e.target.value)}
              />
            </div>

            {mode === "website" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label
                    htmlFor="audit-url"
                    className="block text-sm font-semibold text-stone-800"
                  >
                    Your Website Address <span className="text-rose-700">*</span>
                  </label>
                  <input
                    id="audit-url"
                    type="url"
                    inputMode="url"
                    required
                    placeholder="yourbusiness.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={scanning}
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="audit-business-name"
                    className="block text-sm font-semibold text-stone-800"
                  >
                    Business Name <span className="text-stone-500 font-normal">(optional)</span>
                  </label>
                  <input
                    id="audit-business-name"
                    type="text"
                    placeholder="e.g. Sierra Foothill Plumbing"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    disabled={scanning}
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor="audit-business-name-only"
                  className="block text-sm font-semibold text-stone-800"
                >
                  Your Business Name <span className="text-stone-500 font-normal">(optional)</span>
                </label>
                <input
                  id="audit-business-name-only"
                  type="text"
                  placeholder="e.g. Divide Bakehouse or Foothill Tree Care"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={scanning}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label
                  htmlFor="audit-business-type"
                  className="block text-sm font-semibold text-stone-800"
                >
                  Type of Local Business
                </label>
                <select
                  id="audit-business-type"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as BusinessTypeOption)}
                  disabled={scanning}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-base text-stone-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {(Object.keys(BUSINESS_TYPE_LABELS) as BusinessTypeOption[]).map((key) => (
                    <option key={key} value={key}>
                      {BUSINESS_TYPE_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="audit-town"
                  className="block text-sm font-semibold text-stone-800"
                >
                  Primary Town / Service Area
                </label>
                <select
                  id="audit-town"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  disabled={scanning}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-base text-stone-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {TARGET_CITIES.map((city) => (
                    <option key={city} value={`${city}, CA`}>
                      {city}, CA
                    </option>
                  ))}
                  <option value="Other Foothills / Sacramento Town">
                    Other Foothills / Sacramento Town
                  </option>
                </select>
              </div>
            </div>

            {scanError && (
              <div
                role="alert"
                className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 leading-relaxed"
              >
                {scanError}
              </div>
            )}

            {scanning ? (
              <div
                aria-live="polite"
                className="rounded-2xl border border-stone-200 bg-[#F7F4ED] p-5 flex items-center gap-4"
              >
                <Loader2 className="h-6 w-6 animate-spin text-primary shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-stone-900 text-sm sm:text-base">
                    {activeSteps[stepIdx]}
                  </p>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Usually finishes in 5–12 seconds. Checking your real site, not a template.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                  {mode === "website" ? "Run My Free Site Audit" : "Get My Free Local Launch Plan"}
                </button>
                <p className="text-xs text-stone-600">
                  No email needed to run your check. See your #1 leak immediately.
                </p>
              </div>
            )}
          </form>

          {/* If live HTML checks succeeded even though AI narrative returned an error */}
          {partialChecks && partialChecks.length > 0 && (
            <div className="mt-8 pt-8 border-t border-stone-200 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-heading text-xl font-medium text-stone-900">
                  Live Homepage Checks Completed
                </h2>
                {partialFacts && (
                  <span className="text-xs text-stone-600">
                    {partialFacts.finalUrl} · {(partialFacts.responseMs / 1000).toFixed(2)}s response
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partialChecks.map((check) => (
                  <div
                    key={check.id}
                    className="rounded-xl border border-stone-200 bg-[#F7F4ED]/60 p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-stone-900">{check.label}</span>
                      <StatusBadge status={check.status} />
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">{check.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* RESULTS VIEW */}
      {result && (
        <div className="space-y-8">
          {/* Summary Header Card */}
          <section className="bg-white rounded-[2rem] border border-stone-200/90 shadow-sm p-6 sm:p-8 md:p-10 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-5">
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Your Local Readiness Snapshot
                </p>
                <h2 className="font-heading text-2xl sm:text-3xl font-medium text-stone-900">
                  {result.businessName
                    ? `Audit for ${result.businessName}`
                    : result.mode === "website" && result.scanFacts
                      ? `Live Audit for ${new URL(result.scanFacts.finalUrl).hostname}`
                      : `Local Launch Audit for ${result.town}`}
                </h2>
                <p className="text-sm text-stone-600 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>{BUSINESS_TYPE_LABELS[result.businessType]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{result.town}</span>
                  {result.scanFacts && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{(result.scanFacts.responseMs / 1000).toFixed(2)}s server response</span>
                      {isSafeHttpUrl(result.scanFacts.finalUrl) && (
                        <>
                          <span aria-hidden="true">·</span>
                          <a
                            href={result.scanFacts.finalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary underline underline-offset-4 hover:opacity-80"
                          >
                            {new URL(result.scanFacts.finalUrl).hostname}
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors print:hidden cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Audit Another Site
              </button>
            </div>

            <p className="text-lg text-stone-800 leading-relaxed">
              {result.aiReport.headlineSummary}
            </p>

            {/* Deterministic Live Checks Grid */}
            <div className="space-y-3 pt-2">
              <h3 className="font-heading text-lg font-medium text-stone-900">
                {result.mode === "website"
                  ? "What We Found on Your Live Homepage"
                  : "Your Starting Checklist"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.checks.map((check) => (
                  <div
                    key={check.id}
                    className="rounded-xl border border-stone-200 bg-[#F7F4ED]/65 p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-sm text-stone-900">{check.label}</span>
                      <StatusBadge status={check.status} />
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {check.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Leak #1 — Always Unlocked Immediately */}
          {result.aiReport.topLeaks[0] && (
            <section aria-labelledby="top-leak-heading" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 id="top-leak-heading" className="font-heading text-2xl font-medium text-stone-900">
                  Your #1 Biggest Opportunity
                </h2>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <Unlock className="h-3.5 w-3.5" aria-hidden="true" />
                  Unlocked
                </span>
              </div>
              <LeakCard leak={result.aiReport.topLeaks[0]} index={0} />
            </section>
          )}

          {/* Soft Email Gate for Leaks #2, #3 & Quick Wins */}
          {!unlocked ? (
            <section
              aria-labelledby="unlock-heading"
              className="bg-primary text-primary-foreground rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-sm space-y-6"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary">
                  <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                  2 More Leaks + 5-Minute Quick Wins Ready
                </div>
                <h2 id="unlock-heading" className="font-heading text-2xl sm:text-3xl font-medium leading-tight">
                  Unlock Your Complete 3-Leak Action Plan &amp; Printable Checklist
                </h2>
                <p className="text-primary-foreground/90 text-base leading-relaxed">
                  Enter your email to reveal Leaks #2 &amp; #3, your 3 five-minute DIY fixes, and a
                  printable copy right here on screen. No spam, no pushy sales calls—just honest local
                  help.
                </p>
              </div>

              {/* Teaser of locked leaks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {result.aiReport.topLeaks.slice(1, 3).map((leak, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 flex items-center gap-3"
                  >
                    <Lock className="h-4 w-4 text-secondary shrink-0" aria-hidden="true" />
                    <span className="truncate font-medium text-primary-foreground/95">
                      Leak #{idx + 2}: {leak.title}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleUnlockFullReport} className="space-y-4" noValidate>
                {/* Honeypot */}
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="lead-company-fax">Leave blank</label>
                  <input
                    id="lead-company-fax"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={companyFax}
                    onChange={(e) => setCompanyFax(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="lead-email"
                      className="block text-xs font-semibold uppercase tracking-wider text-primary-foreground/90"
                    >
                      Email Address <span className="text-secondary">*</span>
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      required
                      placeholder="you@yourbusiness.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      disabled={submittingLead}
                      className="w-full rounded-xl bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="lead-name"
                      className="block text-xs font-semibold uppercase tracking-wider text-primary-foreground/90"
                    >
                      Your Name (optional)
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      placeholder="First name"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      disabled={submittingLead}
                      className="w-full rounded-xl bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="lead-phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-primary-foreground/90"
                    >
                      Phone (optional)
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      placeholder="(916) 555-0123"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      disabled={submittingLead}
                      className="w-full rounded-xl bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>

                {leadError && (
                  <div
                    role="alert"
                    className="rounded-xl bg-rose-950/60 border border-rose-300/40 px-4 py-3 text-sm text-rose-100"
                  >
                    {leadError}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#F7F4ED] text-primary font-semibold hover:bg-white transition-colors disabled:opacity-70 cursor-pointer"
                  >
                    {submittingLead ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Unlocking Your Report...
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4" aria-hidden="true" />
                        Unlock Full Action Plan
                      </>
                    )}
                  </button>
                  <p className="text-xs text-primary-foreground/80">
                    Your details stay strictly with Renee at Grow Local Creative. Never sold or shared.
                  </p>
                </div>
              </form>
            </section>
          ) : (
            /* UNLOCKED FULL REPORT */
            <div className="space-y-8">
              {/* Remaining Leaks #2 & #3 */}
              {result.aiReport.topLeaks.slice(1).map((leak, idx) => (
                <LeakCard key={idx + 1} leak={leak} index={idx + 1} />
              ))}

              {/* 5-Minute DIY Quick Wins */}
              <section className="bg-white rounded-[2rem] border border-stone-200 p-6 sm:p-8 space-y-5">
                <h2 className="font-heading text-2xl font-medium text-stone-900">
                  3 Five-Minute Quick Wins You Can Do This Week
                </h2>
                <ul className="space-y-3">
                  {result.aiReport.quickWins.map((win, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-stone-700 text-base leading-relaxed"
                    >
                      <CheckCircle2
                        className="h-5 w-5 text-primary shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{win}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Recommended Specialty + Booking CTA */}
              {(() => {
                const specialty =
                  SPECIALTY_META[result.aiReport.recommendedSpecialty] ||
                  SPECIALTY_META["website-rescues"];
                return (
                  <section className="bg-primary text-primary-foreground rounded-[2rem] p-6 sm:p-8 md:p-10 space-y-6">
                    <div className="space-y-2 max-w-2xl">
                      <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                        Best-Fit Next Step · {specialty.name}
                      </p>
                      <h2 className="font-heading text-2xl sm:text-3xl font-medium leading-tight">
                        Want Renee to Fix These Leaks for You?
                      </h2>
                      <p className="text-primary-foreground/90 text-base leading-relaxed">
                        {result.aiReport.recommendedSpecialtyReason}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 print:hidden">
                      <a
                        href={bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#F7F4ED] text-primary font-semibold hover:bg-white transition-colors"
                      >
                        <Calendar className="h-5 w-5" aria-hidden="true" />
                        Book a Free 15-Min Chat
                      </a>

                      <Link
                        href={specialty.href}
                        className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-primary-foreground/30 text-primary-foreground font-medium hover:bg-white/10 transition-colors"
                      >
                        <span>{specialty.cta}</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-5 py-4 rounded-xl border border-primary-foreground/30 text-primary-foreground/90 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Printer className="h-4 w-4" aria-hidden="true" />
                        Print / Save PDF
                      </button>
                    </div>

                    <p className="text-sm text-primary-foreground/85 pt-2 border-t border-primary-foreground/15">
                      Prefer to call or text right now? Reach Renee at{" "}
                      <a href={cleanPhoneHref} className="underline font-semibold hover:text-secondary">
                        {phone}
                      </a>{" "}
                      or email{" "}
                      <a
                        href={`mailto:${email}`}
                        className="underline font-semibold hover:text-secondary"
                      >
                        {email}
                      </a>
                      .
                    </p>
                  </section>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
