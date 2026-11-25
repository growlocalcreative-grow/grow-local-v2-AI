"use client";

import { ArrowRight, Gift } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import { OFFICIAL_EMAIL, type FreebiesContent } from "@/lib/content";

export function Freebies({ data }: { data: FreebiesContent }) {
  return (
    <section
      id="freebies"
      className="py-24 scroll-mt-20"
      style={{
        backgroundColor: data.backgroundColor || "var(--cream-lighter)",
        color: data.textColor || "var(--foreground)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 text-primary text-xs font-bold tracking-widest uppercase">
            <Gift className="h-3.5 w-3.5" aria-hidden="true" />
            {data.eyebrow}
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-medium leading-tight">{data.heading}</h2>
          <p className="opacity-85 text-lg max-w-2xl mx-auto leading-relaxed">{data.subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {data.items.map((card) => {
            const Icon = getIcon(card.icon);
            const normalizedHref = card.href.replace(
              /mailto:growlocalcreative@gmail\.com/gi,
              `mailto:${OFFICIAL_EMAIL}`
            );

            return (
              <div
                key={card.title}
                className="group relative bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200/80 shadow-sm hover:shadow-md transition-all hover:border-secondary/50 flex flex-col h-full"
              >
                <div className="h-14 w-14 rounded-2xl bg-secondary/20 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="font-heading text-2xl font-medium text-stone-900 mb-4">{card.title}</h3>
                <p className="text-stone-600 leading-relaxed mb-8 flex-grow">{card.description}</p>

                <a
                  href={normalizedHref}
                  className="inline-flex items-center justify-between w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors group/btn"
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
