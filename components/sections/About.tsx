"use client";

import { motion } from "motion/react";
import type { AboutContent } from "@/lib/content";

export function About({ data }: { data: AboutContent }) {
  return (
    <section id="about" className="py-24 bg-[#FAF9F5]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
              <img
                src="/spruce-leaves.jpg"
                alt="Spruce leaves in the Foothills"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = "https://picsum.photos/seed/pinetrees/800/1000";
                }}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-secondary flex items-center justify-center text-center p-4 shadow-xl rotate-12">
              <span className="font-heading text-sm font-bold text-secondary-foreground leading-tight">
                {data.badgeText}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground">
                {data.heading}
              </h2>
              <div className="h-1 w-20 bg-primary rounded-full" />
            </div>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              {data.paragraphs.map((paragraph, index) => (
                <p key={index} className={index === 2 ? "font-medium text-foreground" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
