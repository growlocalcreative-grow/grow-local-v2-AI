"use client";

import { motion } from "motion/react";
import { ArrowRight, Gift } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import type { FreebiesContent } from "@/lib/content";

export function Freebies({ data }: { data: FreebiesContent }) {
  return (
    <section id="freebies" className="py-24 bg-cream/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold tracking-widest uppercase">
            <Gift className="h-3.5 w-3.5" />
            {data.eyebrow}
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-stone-900 leading-tight">{data.heading}</h2>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed">{data.subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {data.items.map((card, index) => {
            const Icon = getIcon(card.icon);
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-md transition-all hover:border-secondary/30 flex flex-col h-full"
              >
                <div className="h-14 w-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="font-heading text-2xl font-medium text-stone-900 mb-4">{card.title}</h3>
                <p className="text-stone-500 leading-relaxed mb-8 flex-grow">{card.description}</p>

                <a
                  href={card.href}
                  className="inline-flex items-center justify-between w-full px-6 py-4 rounded-xl bg-stone-900 text-white font-medium hover:bg-secondary transition-colors group/btn"
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
