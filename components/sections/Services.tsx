"use client";

import { motion } from "motion/react";
import { getIcon } from "@/lib/icon-map";
import type { ServicesContent } from "@/lib/content";

export function Services({ data }: { data: ServicesContent }) {
  return (
    <section id="services" className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-16">
          <h2 className="font-heading text-4xl md:text-6xl font-medium mb-6">{data.heading}</h2>
          <p className="text-primary-foreground/70 text-xl leading-relaxed">{data.subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {data.items.map((service, index) => {
            const Icon = getIcon(service.icon);
            const serviceJsonLd = {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": service.title,
              "description": service.description,
              "provider": {
                "@id": "https://growlocalcreative.com/#organization"
              },
              "areaServed": [
                { "@type": "AdministrativeArea", "name": "El Dorado County, CA" },
                { "@type": "AdministrativeArea", "name": "Placer County, CA" }
              ]
            };
            
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
                />
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-heading text-2xl font-medium">{service.title}</h3>
                      {service.badge && (
                        <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-primary-foreground/60 leading-relaxed text-base md:text-lg">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
