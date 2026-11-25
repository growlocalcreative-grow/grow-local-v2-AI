"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import { useContactModal } from "@/lib/contact-modal-context";
import { DEFAULT_BOOKING_URL, type HeroContent } from "@/lib/content";

export function Hero({ data, bookingUrl }: { data: HeroContent; bookingUrl?: string }) {
  const { open: onContactOpen } = useContactModal();
  const calendarHref = bookingUrl || DEFAULT_BOOKING_URL;

  return (
    <section
      className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40"
      style={{
        backgroundColor: data.backgroundColor || "var(--background)",
        color: data.textColor || "var(--foreground)",
      }}
    >
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-primary mb-8">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span>{data.eyebrow}</span>
        </div>

        <h1 className="mx-auto max-w-4xl font-heading text-5xl md:text-7xl font-medium leading-[1.1] tracking-tight text-foreground mb-6">
          {data.headline} <span className="italic text-primary">{data.headlineEmphasis}</span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 hero-subhead">
          {data.subhead}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={calendarHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              size: "lg",
              className: "w-full sm:w-auto px-8 py-6 text-lg rounded-full gap-2.5 shadow-md hover:bg-primary/90",
            })}
          >
            <Calendar className="h-5 w-5" aria-hidden="true" />
            <span>{data.ctaLabel}</span>
          </a>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onContactOpen}
            className="w-full sm:w-auto px-7 py-6 text-base rounded-full border-primary/25 hover:bg-primary/5"
          >
            Call or Text Now
          </Button>
        </div>
      </div>
    </section>
  );
}
