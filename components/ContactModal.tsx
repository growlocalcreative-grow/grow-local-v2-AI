"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, MessageSquare, Mail, Share2, X, Check, Calendar } from "lucide-react";
import { DEFAULT_BOOKING_URL, type SiteSettings } from "@/lib/content";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SiteSettings;
}

export function ContactModal({ isOpen, onClose, settings }: ContactModalProps) {
  const [copied, setCopied] = useState(false);

  const phoneNumber = settings?.phone.replace(/[^0-9]/g, '') || "9168694142";
  const email = settings?.email || "growlocalcreative@gmail.com";
  const bookingUrl = settings?.bookingUrl || DEFAULT_BOOKING_URL;
  
  const smsBody = "Hey Renee, I'm interested in some simple tools to get my business online. Got time to chat?";
  const emailSubject = "Getting My Local Business Online";
  const emailBody = "Hi Renee, I saw the Grow Local Creative site. I'd love to chat about some simple tools to help get my local business online and simplify things.";
  
  const shareText = `Check out ${settings?.agencyName || 'Grow Local Creative'}—they build simple tools to help local businesses get online and stay connected with neighbors: https://growlocalcreative.com`;
  const shareUrl = "https://growlocalcreative.com";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Grow Local Creative",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-primary/20 backdrop-blur-sm"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-[calc(100%-0.5rem)] max-w-[340px] sm:max-w-sm max-h-[85dvh] overflow-y-auto rounded-3xl sm:rounded-[2rem] border border-stone-200/80 bg-[#F7F4ED] p-5 sm:p-7 shadow-2xl pointer-events-auto"
            >
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-medium text-stone-900 mb-0.5 sm:mb-1">Get in Touch</h2>
                  <p className="text-stone-500 text-xs sm:text-sm">Pick your preferred way to chat.</p>
                </div>
                <button 
                  onClick={onClose}
                  aria-label="Close contact options"
                  className="rounded-full p-1.5 sm:p-2 hover:bg-stone-200/50 transition-colors text-stone-400 hover:text-stone-600 -mr-1 -mt-1"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="space-y-2 sm:space-y-2.5">
                <a 
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full p-3 sm:p-3.5 items-center gap-3 sm:gap-3.5 rounded-xl sm:rounded-2xl border-2 border-primary/20 bg-primary text-primary-foreground hover:bg-primary/95 transition-all group shadow-sm"
                >
                  <div className="flex flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/15 text-white transition-colors">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="text-sm sm:text-base font-semibold leading-tight">Book a Free 15-Min Chat</div>
                    <div className="text-[11px] sm:text-xs text-primary-foreground/80">Pick a time straight on my Google Calendar.</div>
                  </div>
                </a>

                <a 
                  href={`tel:${phoneNumber}`}
                  className="flex w-full p-3 sm:p-3.5 items-center gap-3 sm:gap-3.5 rounded-xl sm:rounded-2xl border border-stone-200 bg-white hover:border-secondary transition-all group"
                >
                  <div className="flex flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-secondary/10 text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="text-sm sm:text-base font-semibold text-stone-900 leading-tight">Call Me Now</div>
                    <div className="text-[11px] sm:text-xs text-stone-500">Let&apos;s talk shop.</div>
                  </div>
                </a>

                <a 
                  href={`sms:${phoneNumber}?body=${encodeURIComponent(smsBody)}`}
                  className="flex w-full p-3 sm:p-3.5 items-center gap-3 sm:gap-3.5 rounded-xl sm:rounded-2xl border border-stone-200 bg-white hover:border-secondary transition-all group"
                >
                  <div className="flex flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-secondary/10 text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="text-sm sm:text-base font-semibold text-stone-900 leading-tight">Send a Text</div>
                    <div className="text-[11px] sm:text-xs text-stone-500">Best for quick questions.</div>
                  </div>
                </a>

                <a 
                  href={`mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                  className="flex w-full p-3 sm:p-3.5 items-center gap-3 sm:gap-3.5 rounded-xl sm:rounded-2xl border border-stone-200 bg-white hover:border-secondary transition-all group"
                >
                  <div className="flex flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-secondary/10 text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="text-sm sm:text-base font-semibold text-stone-900 leading-tight">Email Me</div>
                    <div className="text-[11px] sm:text-xs text-stone-500">For project ideas and details.</div>
                  </div>
                </a>

                <button 
                  onClick={handleShare}
                  className="flex w-full p-3 sm:p-3.5 items-center gap-3 sm:gap-3.5 rounded-xl sm:rounded-2xl border border-stone-200 bg-white hover:border-secondary transition-all group"
                >
                  <div className="flex flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-secondary/10 text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
                    {copied ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="text-sm sm:text-base font-semibold text-stone-900 leading-tight">
                      {copied ? "Link Copied!" : "Share with a Neighbor"}
                    </div>
                    <div className="text-[11px] sm:text-xs text-stone-500">Pass this on to a local neighbor.</div>
                  </div>
                </button>
              </div>

              <p className="mt-4 sm:mt-6 text-center text-xs sm:text-[13px] text-stone-500 leading-relaxed italic border-t border-stone-200 pt-3.5 sm:pt-5">
                &quot;Drop me a line anytime and I&apos;ll get back to you as soon as I&apos;m back from helping a neighbor on the Divide!&quot;
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
