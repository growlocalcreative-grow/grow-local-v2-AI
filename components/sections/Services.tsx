"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import { getServiceLandingHref } from "@/lib/services-data";
import type { ServicesContent } from "@/lib/content";

export function Services({ data }: { data: ServicesContent }) {
  return (
    <section
      id="services"
      className="py-24 scroll-mt-20"
      style={{
        backgroundColor: data.backgroundColor || "var(--primary)",
        color: data.textColor || "var(--primary-foreground)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <h2 className="font-heading text-4xl md:text-6xl font-medium mb-6">{data.heading}</h2>
            <p className="opacity-85 text-xl leading-relaxed">{data.subheading}</p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity whitespace-nowrap shrink-0"
          >
            <span>Explore all specialties</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {data.items.map((service) => {
            const Icon = getIcon(service.icon);
            const detailHref = getServiceLandingHref(service.title);

            return (
              <div key={service.title} className="group">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-heading text-2xl font-medium">
                        {detailHref ? (
                          <Link href={detailHref} className="hover:underline underline-offset-4">
                            {service.title}
                          </Link>
                        ) : (
                          service.title
                        )}
                      </h3>
                      {service.badge && (
                        <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                          · {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="opacity-85 leading-relaxed text-base md:text-lg">
                      {service.description}
                    </p>
                    {detailHref && (
                      <Link
                        href={detailHref}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4 pt-1 hover:opacity-80 transition-opacity"
                      >
                        <span>Learn more</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
