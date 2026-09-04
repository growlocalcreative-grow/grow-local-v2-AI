"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/firebase";
import type { SiteSettings } from "@/lib/content";

export function NewsletterModal({ settings }: { settings: SiteSettings }) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const newsletter = settings.newsletter || {
    isEnabled: false,
    title: "Join the Digest",
    description: "Stay updated with our latest tools.",
    cta: "Subscribe",
    successMessage: "Thanks for subscribing!"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      await subscribeToNewsletter(email);
      setStatus("success");
      localStorage.setItem("newsletter_subscribed", "true");
      // Close after 3 seconds on success
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-stone-100 transition-colors z-10"
            >
              <X className="h-5 w-5 text-stone-400" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Visual side */}
              <div className="hidden md:block bg-secondary/10 p-8 flex flex-col justify-center items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Mail className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-secondary">Community</p>
                  <p className="text-sm text-stone-600 italic">"Helping neighbors push the right buttons."</p>
                </div>
              </div>

              {/* Content side */}
              <div className="p-8 sm:p-10 flex flex-col justify-center">
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4 py-8"
                  >
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-heading font-medium text-stone-900">Success!</h3>
                    <p className="text-stone-600">{newsletter.successMessage}</p>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-heading font-medium text-stone-900 leading-tight">
                        {newsletter.title}
                      </h3>
                      <p className="text-stone-600 text-sm leading-relaxed">
                        {newsletter.description}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          className="rounded-xl border-stone-200 bg-stone-50 h-12"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={status === "loading"}
                        />
                        {status === "error" && (
                          <p className="text-xs text-red-500 pl-1">{errorMessage}</p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12 rounded-xl text-lg font-medium"
                        disabled={status === "loading"}
                      >
                        {status === "loading" ? "Joining..." : newsletter.cta}
                      </Button>
                    </form>

                    <div className="flex items-center gap-2 px-1">
                      <input
                        type="checkbox"
                        id="dontShowAgain"
                        className="h-4 w-4 rounded border-stone-300 text-primary focus:ring-primary cursor-pointer"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain(e.target.checked)}
                      />
                      <label htmlFor="dontShowAgain" className="text-xs text-stone-500 cursor-pointer select-none">
                        Don't show this to me again
                      </label>
                    </div>
                    
                    <p className="text-[10px] text-center text-stone-400">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
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
