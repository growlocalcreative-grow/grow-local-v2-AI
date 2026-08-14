"use client";

import { motion } from "motion/react";
import { LayoutTemplate, Link2, Users, ArrowRight } from "lucide-react";

const upcoming = [
  {
    title: "Branded Mini CMS",
    description: "The same simple content editor built for this site, given to your business too — update your own text and offers anytime, no code required.",
    icon: <LayoutTemplate className="h-6 w-6" />,
    slug: "branded-mini-cms",
  },
  {
    title: "Link-in-Bio Page",
    description: "One clean link you can put on a flyer, business card, or QR code, pointing people to everything: your site, socials, and a way to reach you.",
    icon: <Link2 className="h-6 w-6" />,
    slug: "link-in-bio",
  },
  {
    title: "Simple Contact Tracker",
    description: "A lightweight way to keep notes on customers, donors, or members — built for folks who are done wrestling with spreadsheets.",
    icon: <Users className="h-6 w-6" />,
    slug: "simple-contact-tracker",
  },
];

export function Future() {
  return (
    <section id="upcoming" className="py-24 bg-cream-lighter">
      <div className="container mx-auto px-4 text-stone-900">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-medium mb-4">What's Coming Next</h2>
          <p className="text-stone-600 text-lg">Building one neighbor at a time, for the real problems I keep seeing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {upcoming.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <a
                href="mailto:growlocalcreative@gmail.com?subject=Joining%20the%20Beta%20for%20Tools&body=Hi%20Renee%2C%20I'm%20a%20local%20business%20owner%20and%20I'm%20interested%20in%20testing%20out%20your%20upcoming%20tools."
                className="bg-white p-8 rounded-3xl border border-stone-100 flex flex-col items-start gap-4 group hover:border-secondary transition-all hover:shadow-md h-full"
              >
                <div className="h-12 w-12 shrink-0 rounded-full bg-secondary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  {item.icon}
                </div>
                <div className="space-y-2 flex-grow">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-heading text-2xl font-medium leading-none">{item.title}</h3>
                    <ArrowRight className="h-5 w-5 text-stone-300 shrink-0 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-stone-500 leading-relaxed text-sm md:text-base">{item.description}</p>
                  <span className="inline-block text-sm font-medium text-secondary pt-2">Join the Beta →</span>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
