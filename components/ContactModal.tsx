"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, MessageSquare, Mail, Share2, X, Check } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false);

  const phoneNumber = "9168694142";
  const email = "growlocalcreative@gmail.com";
  
  const smsBody = "Hey Renee, I'm a local contractor and wasted time on estimates is killing me. Got time to chat?";
  const emailSubject = "Automation Help for My Business";
  const emailBody = "Hi Renee, I saw the Grow Local Creative site. I'd love to chat about setting up some simple pricing or lead tools for my trade business.";
  
  const shareText = "Check out Grow Local Creative—they build simple tools to help local contractors save time on bids and estimates: https://growlocalcreative.com";
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
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm overflow-hidden rounded-[2rem] border-stone-100 bg-[#F7F4ED] p-8 shadow-2xl pointer-events-auto"
            >
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-heading font-medium text-stone-900 mb-1">Get in Touch</h2>
                  <p className="text-stone-500 text-sm">Pick your preferred way to chat.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-stone-200/50 transition-colors text-stone-400 hover:text-stone-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-3">
                <a 
                  href={`tel:${phoneNumber}`}
                  className="flex w-full p-4 items-start gap-4 rounded-2xl border border-stone-200 bg-white hover:border-secondary transition-all group"
                >
                  <div className="flex flex-shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="text-base font-semibold text-stone-900 leading-tight">Call Me Now</div>
                    <div className="text-xs text-stone-500">Let's talk shop.</div>
                  </div>
                </a>

                <a 
                  href={`sms:${phoneNumber}?body=${encodeURIComponent(smsBody)}`}
                  className="flex w-full p-4 items-start gap-4 rounded-2xl border border-stone-200 bg-white hover:border-secondary transition-all group"
                >
                  <div className="flex flex-shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="text-base font-semibold text-stone-900 leading-tight">Send a Text</div>
                    <div className="text-xs text-stone-500">Best for quick questions.</div>
                  </div>
                </a>

                <a 
                  href={`mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                  className="flex w-full p-4 items-start gap-4 rounded-2xl border border-stone-200 bg-white hover:border-secondary transition-all group"
                >
                  <div className="flex flex-shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="text-base font-semibold text-stone-900 leading-tight">Email Me</div>
                    <div className="text-xs text-stone-500">For project ideas and details.</div>
                  </div>
                </a>

                <button 
                  onClick={handleShare}
                  className="flex w-full p-4 items-start gap-4 rounded-2xl border border-stone-200 bg-white hover:border-secondary transition-all group"
                >
                  <div className="flex flex-shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
                    {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                  </div>
                  <div className="flex flex-col text-left">
                    <div className="text-base font-semibold text-stone-900 leading-tight">
                      {copied ? "Link Copied!" : "Share with a Neighbor"}
                    </div>
                    <div className="text-xs text-stone-500">Pass this on to a local neighbor.</div>
                  </div>
                </button>
              </div>

              <p className="mt-8 text-center text-[13px] text-stone-500 leading-relaxed italic border-t border-stone-200 pt-6">
                "Drop me a line anytime and I'll get back to you as soon as I'm back from helping a neighbor on the Divide!"
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
