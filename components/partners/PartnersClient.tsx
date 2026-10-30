"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  ArrowRight, 
  Globe, 
  Hammer, 
  Utensils, 
  Heart, 
  Users, 
  Zap, 
  ShieldCheck, 
  Clock,
  Compass,
  Laptop
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactModal } from "@/lib/contact-modal-context";
import type { PartnersPageContent, PartnerProject } from "@/lib/content";

interface PartnersClientProps {
  content: PartnersPageContent;
  phone: string;
}

export function PartnersClient({ content, phone }: PartnersClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { open: onContactOpen } = useContactModal();

  const filterProjects = (projects: PartnerProject[]) => {
    if (activeFilter === "all") return projects;
    if (activeFilter === "live") return projects.filter(p => p.status === "live");
    if (activeFilter === "in-progress") return projects.filter(p => p.status === "in-progress");
    if (activeFilter === "trades") return projects.filter(p => p.id === "fixitcool");
    if (activeFilter === "community-food") return projects.filter(p => p.id !== "fixitcool");
    return projects;
  };

  const filteredProjects = filterProjects(content.projects);

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-border/40 bg-gradient-to-b from-secondary/10 via-background to-background">
        <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-secondary/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span>{content.eyebrow}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground mb-6"
          >
            {content.headline}{" "}
            <span className="italic text-primary">{content.headlineEmphasis}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-3xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10"
          >
            {content.subhead}
          </motion.p>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-sm max-w-3xl mx-auto mb-10"
          >
            <div className="text-center p-2">
              <div className="font-heading text-2xl font-bold text-primary">100%</div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">Foothill Tested</div>
            </div>
            <div className="text-center p-2 border-l border-border/40">
              <div className="font-heading text-2xl font-bold text-primary">&lt; 0.8s</div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">Rural Speed Ready</div>
            </div>
            <div className="text-center p-2 border-l md:border-l border-border/40">
              <div className="font-heading text-2xl font-bold text-primary">Zero</div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">Hostage Contracts</div>
            </div>
            <div className="text-center p-2 border-l border-border/40">
              <div className="font-heading text-2xl font-bold text-primary">1-Tap</div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">Direct Calling</div>
            </div>
          </motion.div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "All Projects (5)" },
              { id: "live", label: "Live Websites (3)" },
              { id: "in-progress", label: "In The Workshop (2)" },
              { id: "trades", label: "Contractors & Trades" },
              { id: "community-food", label: "Community & Eateries" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "bg-secondary/30 text-foreground/80 hover:bg-secondary/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Showcase Grid */}
      <section className="py-16 md:py-24 container mx-auto px-4 max-w-6xl">
        <div className="space-y-16">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Left: Interactive Browser Mockup / Visual Card */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-muted/60 via-background to-muted/40 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/60">
                    <div>
                      {/* Browser Window Chrome */}
                      <div className="rounded-2xl border border-border/70 bg-background shadow-md overflow-hidden">
                        {/* Traffic light bar */}
                        <div className="bg-muted/80 px-3 py-2 flex items-center justify-between border-b border-border/60 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-400 inline-block" />
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" />
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-background/80 border border-border/40 text-[11px] text-muted-foreground font-mono truncate max-w-[200px]">
                            <Globe className="h-3 w-3 text-primary shrink-0" />
                            <span className="truncate">{project.displayUrl}</span>
                          </div>
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            title="Open site in new tab"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>

                        {/* Interactive UI Mockup Canvas */}
                        <div className={`p-6 bg-gradient-to-br ${project.gradient} text-white relative min-h-[220px] flex flex-col justify-between overflow-hidden group-hover:scale-[1.01] transition-transform`}>
                          <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
                            {project.id === "fixitcool" && <Hammer className="h-32 w-32" />}
                            {project.id === "alt-business" && <Users className="h-32 w-32" />}
                            {project.id === "divide-womens-club" && <Heart className="h-32 w-32" />}
                            {project.id === "pigsure-bbq" && <Utensils className="h-32 w-32" />}
                            {project.id === "cool-charity" && <Compass className="h-32 w-32" />}
                          </div>

                          <div className="relative z-10">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white mb-3">
                              {project.status === "live" ? (
                                <>
                                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                  Live in Production
                                </>
                              ) : (
                                <>
                                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                                  In The Workshop
                                </>
                              )}
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-heading">
                              {project.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mt-1">
                              {project.tagline}
                            </p>
                          </div>

                          {/* Mockup Preview Feature Pills */}
                          <div className="relative z-10 pt-4 flex flex-wrap gap-1.5 border-t border-white/15">
                            {project.metrics.map((metric, mIdx) => (
                              <div key={mIdx} className="bg-black/30 backdrop-blur-md rounded-lg px-2.5 py-1 text-[11px] text-white/90">
                                <span className="text-white/60 text-[10px] block">{metric.label}</span>
                                <span className="font-semibold">{metric.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Direct Launch Button */}
                    <div className="pt-6">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3 px-4 text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm group/btn"
                      >
                        <span>Visit {project.name}</span>
                        <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>

                  {/* Right: Detailed Story & Why It Converts */}
                  <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      {/* Header tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-secondary/30 text-xs font-semibold text-primary">
                          {project.category}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {project.displayUrl}
                        </span>
                      </div>

                      {/* Hook & Title */}
                      <h2 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
                        {project.name}:{" "}
                        <span className="text-primary italic font-normal text-xl sm:text-2xl block sm:inline">
                          {project.tagline}
                        </span>
                      </h2>

                      {/* The Story & Conversion Logic */}
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                        {project.description}
                      </p>

                      {/* Problem & Solution Callout */}
                      <div className="p-4 rounded-2xl bg-secondary/15 border border-secondary/30 mb-6">
                        <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                          The Local Challenge We Solved
                        </div>
                        <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                          {project.problemSolved}
                        </p>
                      </div>

                      {/* Key High-Performance Features */}
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                          Built-In Growth Features
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {project.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/90">
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Action bar */}
                    <div className="pt-8 mt-6 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <div className="text-xs text-muted-foreground">
                        Looking for a similar setup for your business?
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onContactOpen}
                        className="rounded-xl border-primary/30 hover:bg-primary hover:text-primary-foreground gap-2 font-medium"
                      >
                        <Zap className="h-3.5 w-3.5 text-primary" />
                        <span>I Want a Solution Like This</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Community Narrative & Philosophy Banner */}
      <section className="py-16 md:py-20 bg-secondary/20 border-y border-border/50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary mb-6">
            <Heart className="h-4 w-4" />
            <span>NEIGHBOR-TO-NEIGHBOR INTEGRITY</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-medium tracking-tight text-foreground mb-6">
            {content.bannerTitle}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
            {content.bannerDescription}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
              <Zap className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-heading text-lg font-semibold mb-2">Sierra Speed Certified</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We test on spotty mountain cell connections. No massive 10MB images or clunky bloatware freezing up customers&apos; screens.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
              <Phone className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-heading text-lg font-semibold mb-2">Direct Phone &amp; Orders</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Whether it&apos;s a homeowner with an emergency roof leak or a hungry family looking for barbecue, we make contacting you effortless.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-heading text-lg font-semibold mb-2">You Own 100% of It</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Zero proprietary platforms holding your business hostage. Transparent code, easy handoffs, and honest support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* High-Converting CTA Section */}
      <section className="py-20 md:py-28 container mx-auto px-4 max-w-4xl text-center">
        <div className="rounded-3xl bg-primary text-primary-foreground p-8 sm:p-12 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -z-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-secondary mb-6">
              <Clock className="h-3.5 w-3.5" /> 15-Minute No-Pressure Chat
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-6">
              {content.ctaTitle}
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed mb-10">
              {content.ctaDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={onContactOpen}
                className="w-full sm:w-auto px-8 py-6 text-base font-semibold rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md gap-2"
              >
                <span>{content.ctaButtonText}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <a
                href={`tel:${phone.replace(/[^0-9]/g, "")}`}
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base font-medium transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4" />
                <span>Call {phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
