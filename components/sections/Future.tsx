"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import {
  DEFAULT_BOOKING_URL,
  DEFAULT_FUTURE,
  type FutureContent,
} from "@/lib/content";
import { getDocumentAction } from "@/app/admin/actions";

export function Future({
  data: initialData,
  bookingUrl,
}: {
  data?: FutureContent;
  bookingUrl?: string;
  email?: string;
}) {
  const [data, setData] = useState<FutureContent>(initialData || DEFAULT_FUTURE);
  const calendarHref = bookingUrl || DEFAULT_BOOKING_URL;

  useEffect(() => {
    if (!initialData) {
      getDocumentAction("content", "future").then((res) => {
        if (res.success && res.data) {
          setData((prev) => ({ ...prev, ...res.data }));
        }
      });
    }
  }, [initialData]);

  return (
    <section
      id="upcoming"
      className="py-24 scroll-mt-20"
      style={{
        backgroundColor: data.backgroundColor || "var(--cream-lighter)",
        color: data.textColor || "var(--foreground)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-medium mb-4">{data.heading}</h2>
          <p className="opacity-85 text-lg">{data.subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {data.items.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={item.title}>
                <a
                  href={calendarHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-8 rounded-3xl border border-stone-200/80 flex flex-col items-start gap-4 group hover:border-primary/40 transition-all hover:shadow-md h-full text-stone-900"
                >
                  <div className="h-12 w-12 shrink-0 rounded-full bg-secondary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-heading text-2xl font-medium leading-snug">{item.title}</h3>
                      <ArrowRight
                        className="h-5 w-5 text-stone-400 shrink-0 group-hover:text-primary group-hover:translate-x-1 transition-all"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-stone-600 leading-relaxed text-sm md:text-base">{item.description}</p>
                    <span className="inline-block text-sm font-semibold text-primary pt-2">
                      Book a Quick Chat →
                    </span>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
