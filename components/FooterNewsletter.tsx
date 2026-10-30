"use client";

import { useState } from "react";
import { CheckCircle2, Download, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeAction } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/content";

interface FooterNewsletterProps {
  newsletter?: SiteSettings["newsletter"];
}

export function FooterNewsletter({ newsletter }: FooterNewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const title = newsletter?.title || "Grab the 5-Minute Google Maps Setup Checklist";
  const description =
    newsletter?.description ||
    "Get our step-by-step 1-page PDF checklist showing exactly how to optimize your Google Business profile so local Foothill neighbors find you first.";
  const cta = newsletter?.cta || "Send Me the Free Checklist";
  const successMessage =
    newsletter?.successMessage ||
    "You're all set! Check your inbox for your 5-Minute Google Maps Checklist.";

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
        setEmail("");
        try {
          localStorage.setItem("newsletter_subscribed", "true");
          const downloadLink = document.createElement("a");
          downloadLink.href = "/api/checklist/download";
          downloadLink.setAttribute("download", "Foothills-Google-Maps-Setup-Checklist.pdf");
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        } catch {
          // ignore storage error
        }
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mb-14 rounded-3xl bg-primary-foreground/[0.07] border border-primary-foreground/15 p-6 sm:p-8 lg:p-10 shadow-lg relative overflow-hidden">
      {/* Decorative Sierra aura */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left pitch */}
        <div className="lg:col-span-7 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-secondary/20 text-[#E7EBD8] border border-secondary/30">
            <FileText className="w-3.5 h-3.5 text-secondary" />
            <span>Free Local Business Lead Magnet</span>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary-foreground tracking-tight leading-tight">
            {title}
          </h3>

          <p className="text-primary-foreground/80 text-sm sm:text-base leading-relaxed max-w-xl">
            {description}
          </p>
        </div>

        {/* Right form / success state */}
        <div className="lg:col-span-5">
          {status === "success" ? (
            <div className="rounded-2xl bg-secondary/20 border border-secondary/40 p-6 text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary mx-auto mb-1">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h4 className="font-heading text-xl font-semibold text-primary-foreground">
                Checklist Download Ready!
              </h4>
              <p className="text-sm text-primary-foreground/90 leading-relaxed">
                Your direct 1-page PDF download has been initiated. You can also re-download it or view the printable cheatsheet below.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href="/api/checklist/download"
                  download="Foothills-Google-Maps-Setup-Checklist.pdf"
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-xs shadow hover:bg-secondary/90 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Again</span>
                </a>
                <a
                  href="/checklist/google-maps"
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary-foreground/15 hover:bg-primary-foreground/25 text-white font-medium text-xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Printable Web Guide</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="h-12 rounded-xl bg-white text-stone-900 placeholder:text-stone-500 border-none focus-visible:ring-2 focus-visible:ring-secondary text-sm"
                />
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-12 px-6 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold shrink-0 gap-2 shadow-md transition-transform active:scale-95"
                >
                  {status === "loading" ? (
                    "Sending..."
                  ) : (
                    <>
                      <span className="whitespace-nowrap">{cta}</span>
                      <Download className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>

              {status === "error" && (
                <p className="text-xs text-rose-300 pl-1 font-medium">{errorMessage}</p>
              )}

              <p className="text-xs text-primary-foreground/60 pl-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span>Instant 1-page PDF · No spam · Practical Foothills advice only</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
