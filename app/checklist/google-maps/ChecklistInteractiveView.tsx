"use client";

import { useState } from "react";
import { Download, Printer, Copy, Check, Sparkles, MapPin, Star, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";

export function ChecklistInteractiveView() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copiedReviewScript, setCopiedReviewScript] = useState(false);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyScript = () => {
    const script =
      "Hey [Name], thanks for trusting us today! If you have 30 seconds, a quick Google review helps our small Foothills family business immensely: [PASTE_YOUR_GOOGLE_REVIEW_LINK_HERE]";
    navigator.clipboard.writeText(script);
    setCopiedReviewScript(true);
    setTimeout(() => setCopiedReviewScript(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const steps = [
    {
      stepNumber: "STEP 1",
      title: "Fix the Rural Foothill Address Dilemma",
      subtitle: "Avoid instant Google suspensions from P.O. Boxes and protect your home privacy.",
      items: [
        {
          id: "step1-1",
          bold: "Never list a P.O. Box or UPS store:",
          text: "Google uses automated address verification. Listings using P.O. boxes on Hwy 49 get suspended. Use your physical base of operations.",
        },
        {
          id: "step1-2",
          bold: "Hide your residential street address:",
          text: "If you are a mobile trade (electrician, roofer, landscaper, mobile detailer), check 'I deliver goods and services to customers at their location' and toggle your street address to Hidden.",
        },
        {
          id: "step1-3",
          bold: "Explicitly designate local Foothill service areas:",
          text: "Add targeted towns: Cool (95614), Georgetown (95634), Auburn (95603/95604), Greenwood, Pilot Hill, Coloma, Lotus, Placerville (95667), Meadow Vista, Foresthill. Google ranks you where you explicitly say you work.",
        },
      ],
    },
    {
      stepNumber: "STEP 2",
      title: "Lock In High-Intent Primary & Secondary Categories",
      subtitle: "Over 60% of Google's ranking algorithm relies on category precision.",
      items: [
        {
          id: "step2-1",
          bold: "Primary Category is make-or-break:",
          text: "Don't use vague terms like 'Service Provider' or 'Consultant'. Choose the exact trade searchers type (e.g., 'Electrician', 'Barbecue restaurant', 'Tree service').",
        },
        {
          id: "step2-2",
          bold: "Add 3-5 precise secondary categories:",
          text: "Example: For a bakery/cafe: Primary: 'Bakery' · Secondary: 'Coffee shop', 'Caterer', 'Breakfast restaurant'. Don't stuff unrelated categories.",
        },
        {
          id: "step2-3",
          bold: "Inspect your top local rival:",
          text: "Open Google Maps, search your trade in Auburn or Placerville, and look at the gray tag under the top 3 results. Match their primary category.",
        },
      ],
    },
    {
      stepNumber: "STEP 3",
      title: "Upload Real Local Photos (Google Demotes Stock Photos)",
      subtitle: "Locals hire real humans they can trust with their keys and their property.",
      items: [
        {
          id: "step3-1",
          bold: "Zero stock photos:",
          text: "Google computer vision detects stock imagery and lowers profile rank. Real iPhone/Android photos receive 3x higher inquiries.",
        },
        {
          id: "step3-2",
          bold: "The Essential 5 Photos:",
          text: "1) Branded truck/van or storefront sign on Hwy 49, 2) You and your crew smiling, 3) 2-3 recent clean before-and-after jobs or fresh food items.",
        },
        {
          id: "step3-3",
          bold: "Natural Foothills GPS geotagging:",
          text: "Take photos with your phone camera location enabled. Google reads the Foothills metadata automatically, confirming you operate locally.",
        },
      ],
    },
    {
      stepNumber: "STEP 4",
      title: "Create Your Direct 1-Tap Google Review Shortlink",
      subtitle: "Make it effortless for happy customers to leave 5-star feedback in under 30 seconds.",
      items: [
        {
          id: "step4-1",
          bold: "Eliminate all friction:",
          text: "Never say 'Look us up on Google'. Open your Google Business dashboard -> click 'Ask for reviews' -> copy your unique shortlink (g.page/r/...).",
        },
        {
          id: "step4-2",
          bold: "The 30-Second Text Script:",
          text: "Send this text immediately after wrapping up a job while the customer is thrilled:",
          hasScript: true,
        },
        {
          id: "step4-3",
          bold: "Local keyword bonus:",
          text: "When a customer writes 'Best electrician in Cool' or 'Great Auburn BBQ', Google indexes those keywords directly into your local rank.",
        },
      ],
    },
    {
      stepNumber: "STEP 5",
      title: "The 60-Second Friday 'Google Update' Ranking Trick",
      subtitle: "Active listings crush inactive competitors who haven't touched their profile in 6 months.",
      items: [
        {
          id: "step5-1",
          bold: "Algorithm preference for active profiles:",
          text: "Google ranks profiles with recent activity over dormant listings. You only need 60 seconds once a week.",
        },
        {
          id: "step5-2",
          bold: "The 2-Sentence Local Formula:",
          text: "Every Friday, click 'Add update' -> post 1 photo of what you worked on this week + 2 sentences: 'Wrapping up a custom metal roof installation out in Georgetown before the weekend rain!'",
        },
        {
          id: "step5-3",
          bold: "100% Free SEO:",
          text: "This consistently feeds Google fresh geotagged local keywords without spending a single dollar on Google Ads.",
        },
      ],
    },
  ];

  return (
    <div className="p-6 sm:p-10 lg:p-12 text-stone-900 font-sans">
      {/* Document Header */}
      <div className="bg-[#2D3328] text-white p-6 sm:p-8 rounded-2xl relative overflow-hidden mb-8">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary/30 text-[#E7EBD8] border border-secondary/40">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Grow Local Creative • Foothill Action Guide</span>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-medium transition-colors"
                title="Print this cheatsheet"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <a
                href="/api/checklist/download"
                download="Foothills-Google-Maps-Setup-Checklist.pdf"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-primary text-xs font-semibold hover:bg-secondary/90 transition-colors"
                title="Download direct 1-page PDF file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Direct PDF</span>
              </a>
            </div>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            5-Minute Google Maps Setup Checklist
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            The practical, zero-fluff playbook for Cool, Auburn, Placerville, and Georgetown Divide businesses to outrank competitors on Google Maps.
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between text-xs text-stone-400 gap-2">
          <span>Printable 1-Page Cheatsheet · Instant Local Action</span>
          <span>Updated for 2026 · Sierra Foothills Focus</span>
        </div>
      </div>

      {/* Checklist Steps */}
      <div className="space-y-6">
        {steps.map((step) => (
          <div
            key={step.stepNumber}
            className="rounded-2xl border border-stone-200 bg-stone-50/50 p-5 sm:p-6 transition-all hover:border-stone-300 hover:shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#2D3328] text-white text-[11px] font-bold tracking-wider uppercase">
                {step.stepNumber}
              </span>
              <h2 className="font-heading text-base sm:text-lg font-bold text-stone-900">
                {step.title}
              </h2>
            </div>
            <p className="text-xs text-stone-500 mb-4 pl-1">{step.subtitle}</p>

            <div className="space-y-3 pl-1">
              {step.items.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="flex items-start gap-3 text-sm text-stone-700 cursor-pointer select-none group"
                  >
                    <button
                      type="button"
                      aria-label="Toggle task"
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? "bg-secondary border-secondary text-primary"
                          : "border-stone-300 bg-white group-hover:border-secondary"
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="flex-1 space-y-1.5">
                      <p className={`text-xs sm:text-sm leading-relaxed ${isChecked ? "line-through text-stone-400" : ""}`}>
                        <strong className="text-stone-900 font-semibold">{item.bold}</strong> {item.text}
                      </p>

                      {item.hasScript && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="mt-2 rounded-xl bg-white border border-stone-200 p-3 sm:p-4 text-xs font-mono text-stone-800 space-y-2 relative"
                        >
                          <p className="leading-relaxed">
                            &ldquo;Hey [Name], thanks for trusting us today! If you have 30 seconds, a quick Google review helps our small Foothills family business immensely: [PASTE_YOUR_LINK]&rdquo;
                          </p>
                          <div className="flex justify-end print:hidden">
                            <button
                              onClick={copyScript}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-sans text-xs font-medium transition-colors"
                            >
                              {copiedReviewScript ? (
                                <>
                                  <Check className="w-3 h-3 text-green-600" />
                                  <span className="text-green-600">Copied to Clipboard!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-stone-500" />
                                  <span>Copy Text Script</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Callout & Local Partner Offer */}
      <div className="mt-8 rounded-2xl bg-[#E8EEE0] border border-[#C4D0A4] p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2D3328]">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Grow Local Creative · Cool, CA</span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2D3328]">
              Want us to audit or optimize your Google Profile and website for you?
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              We build fast, clean websites and handle Google Maps rankings for local contractors, restaurants, and shops across Cool, Auburn, Placerville, and Georgetown.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <a
              href="tel:5303346276"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D3328] text-white text-xs font-semibold shadow hover:bg-stone-800 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-secondary" />
              <span>Call / Text (530) 334-6276</span>
            </a>
            <a
              href="mailto:hello@growlocalcreative.com"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-stone-900 border border-stone-300 text-xs font-medium hover:bg-stone-50 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-stone-600" />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
