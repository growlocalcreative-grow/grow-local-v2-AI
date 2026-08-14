"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { useContactModal } from "@/lib/contact-modal-context";
import type { HeroContent } from "@/lib/content";

export function Hero({ data }: { data: HeroContent }) {
  const { open: onContactOpen } = useContactModal();

  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-24 md:pt-32 md:pb-40">
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-primary mb-8"
        >
          <MapPin className="h-4 w-4" />
          <span>{data.eyebrow}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl font-heading text-5xl md:text-7xl font-medium leading-[1.1] tracking-tight text-foreground mb-6"
        >
          {data.headline} <span className="italic text-primary">{data.headlineEmphasis}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 hero-subhead"
        >
          {data.subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg rounded-full" onClick={onContactOpen}>
            {data.ctaLabel}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
