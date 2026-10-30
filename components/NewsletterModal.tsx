"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, FileText, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeAction } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/content";

export function NewsletterModal({ settings }: { settings: SiteSettings }) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const newsletter = settings.newsletter || {
    isEnabled: false,
    title: "Grab the 5-Minute Google Maps Setup Checklist",
    description: "Get our step-by-step 1-page PDF checklist showing exactly how to optimize your Google Business profile so local Foothill neighbors find you first—plus occasional practical web tips.",
    cta: "Send Me the Free Checklist",
    successMessage: "You're all set! Check your inbox for your 5-Minute Google Maps Checklist."
  };

  useEffect(() => {
    if (!newsletter.isEnabled) return;

    // Don't show if already closed in this session, subscribed, or opted out permanently
    const hasClosedSession = sessionStorage.getItem("newsletter_session_closed");
    const hasOptedOut = localStorage.getItem("newsletter_opt_out");
    const hasSubscribed = localStorage.getItem("newsletter_subscribed");

    if (hasClosedSession || hasOptedOut || hasSubscribed) return;

    // Show after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [newsletter.isEnabled]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("newsletter_session_closed", "true");
    if (dontShowAgain) {
      localStorage.setItem("newsletter_opt_out", "true");
    }
  };

  const [autoDownloaded, setAutoDownloaded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const result = await subscribeAction(email);
      if (result.success) {
        setStatus("success");
        localStorage.setItem("newsletter_subscribed", "true");
        // Trigger direct download automatically
        try {
          const downloadLink = document.createElement("a");
          downloadLink.href = "/api/checklist/download";
          downloadLink.setAttribute("download", "Foothills-Google-Maps-Setup-Checklist.pdf");
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          setAutoDownloaded(true);
        } catch {
          // Fallback handled by the prominent download button in UI
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-stone-200"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors z-20"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-5">
              {/* Visual Preview Side (2 cols) */}
              <div className="hidden md:flex md:col-span-2 bg-[#2D3328] text-stone-100 p-8 flex-col justify-between relative overflow-hidden">
                <div className="space-y-5 relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-secondary/30 text-[#E7EBD8] border border-secondary/40">
                    <FileText className="w-3.5 h-3.5 text-[#C4D0A4]" />
                    <span>Free 1-Page PDF</span>
                  </div>

                  <div>
                    <h4 className="font-heading text-lg font-semibold text-white leading-snug">
                      5-Minute Google Maps Checklist
                    </h4>
                    <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                      Built for Cool, Auburn, Placerville &amp; Georgetown Divide businesses.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="flex items-start gap-2.5 text-xs text-stone-200">
                      <div className="h-4 w-4 rounded-full bg-secondary/30 flex items-center justify-center shrink-0 mt-0.5 text-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>Pinpoint verification &amp; rural service radius</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-stone-200">
                      <div className="h-4 w-4 rounded-full bg-secondary/30 flex items-center justify-center shrink-0 mt-0.5 text-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>Primary categories local searchers type</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-stone-200">
                      <div className="h-4 w-4 rounded-full bg-secondary/30 flex items-center justify-center shrink-0 mt-0.5 text-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>1-tap link formula for 5-star Google reviews</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 text-[11px] text-stone-400 flex items-center gap-2 relative z-10">
                  <Download className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span>Instant 1-page Google Maps Setup Checklist (PDF)</span>
                </div>
              </div>

              {/* Form Content Side (3 cols) */}
              <div className="p-7 sm:p-9 md:col-span-3 flex flex-col justify-center">
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4 py-4"
                  >
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700 mx-auto">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-heading font-bold text-stone-900">
                        Your Checklist is Ready!
                      </h3>
                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                        Your direct 1-page PDF download has been initiated. You can also re-download it or view the interactive version anytime below.
                      </p>
                    </div>

                    <div className="pt-2 space-y-2">
                      <a
                        href="/api/checklist/download"
                        download="Foothills-Google-Maps-Setup-Checklist.pdf"
                        className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-primary text-white text-sm font-semibold shadow hover:bg-primary/90 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download 1-Page PDF Again</span>
                      </a>
                      
                      <a
                        href="/checklist/google-maps"
                        className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-stone-600" />
                        <span>View Interactive / Printable Web Version</span>
                      </a>
                    </div>

                    <div className="pt-3 border-t border-stone-100">
                      <button
                        onClick={handleClose}
                        className="text-xs text-stone-500 hover:text-stone-800 underline transition-colors"
                      >
                        Close Window
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600">
                        <Sparkles className="w-3 h-3 text-secondary" />
                        <span>Instant Local Lead Magnet</span>
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-stone-900 leading-tight">
                        {newsletter.title}
                      </h3>
                      <p className="text-stone-600 text-sm leading-relaxed">
                        {newsletter.description}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                      <div className="space-y-1">
                        <Input
                          type="email"
                          placeholder="Enter your email address..."
                          className="rounded-xl border-stone-300 bg-stone-50 h-12 text-sm focus-visible:ring-primary"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={status === "loading"}
                        />
                        {status === "error" && (
                          <p className="text-xs text-red-600 pl-1">{errorMessage}</p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12 rounded-xl text-base font-semibold shadow-md gap-2"
                        disabled={status === "loading"}
                      >
                        {status === "loading" ? (
                          "Sending Checklist..."
                        ) : (
                          <>
                            <span>{newsletter.cta || "Send Me the Free Checklist"}</span>
                            <Download className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="space-y-2 pt-1 border-t border-stone-100">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="dontShowAgain"
                          className="h-4 w-4 rounded border-stone-300 text-primary focus:ring-primary cursor-pointer"
                          checked={dontShowAgain}
                          onChange={(e) => setDontShowAgain(e.target.checked)}
                        />
                        <label htmlFor="dontShowAgain" className="text-xs text-stone-500 cursor-pointer select-none">
                          Don't show this popup again
                        </label>
                      </div>
                      
                      <p className="text-[11px] text-stone-400">
                        Zero spam. Practical Foothill tips only. Unsubscribe at any time.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
