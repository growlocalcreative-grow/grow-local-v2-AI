"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqContent } from "@/lib/content";

export function FAQ({ data }: { data: FaqContent }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-24 bg-background">
      {/* Structured data so AI answer engines and Google can lift Q&A pairs directly */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12 space-y-3">
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground">{data.heading}</h2>
          <p className="text-muted-foreground text-lg">{data.subheading}</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {data.items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-heading text-lg">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
