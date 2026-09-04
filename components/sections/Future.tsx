"use client";

import { motion } from "motion/react";
import { LayoutTemplate, Link2, Users, ArrowRight } from "lucide-react";
import type { FutureContent } from "@/lib/content";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "LayoutTemplate": return <LayoutTemplate className="h-6 w-6" />;
    case "Link2": return <Link2 className="h-6 w-6" />;
    case "Users": return <Users className="h-6 w-6" />;
    default: return <LayoutTemplate className="h-6 w-6" />;
  }
};

export function Future({ data }: { data: FutureContent }) {
  return (
    <section 
      id="upcoming" 
      className="py-24"
      style={{ 
        backgroundColor: data.backgroundColor || 'var(--cream-lighter)',
        color: data.textColor || 'var(--foreground)'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-medium mb-4">{data.heading}</h2>
          <p className="opacity-70 text-lg">{data.subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {data.items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <a
                href="mailto:growlocalcreative@gmail.com?subject=Joining%20the%20Beta%20for%20Tools&body=Hi%20Renee%2C%20I'm%20interested%20in%20using%20some%20simple%20tools%20to%20get%20my%20business%20online%20and%20organized."
                className="bg-white p-8 rounded-3xl border border-stone-100 flex flex-col items-start gap-4 group hover:border-secondary transition-all hover:shadow-md h-full text-stone-900"
              >
                <div className="h-12 w-12 shrink-0 rounded-full bg-secondary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  {getIcon(item.icon)}
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
