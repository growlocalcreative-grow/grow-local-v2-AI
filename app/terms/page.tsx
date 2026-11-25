import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OFFICIAL_EMAIL, getSiteSettingsContent } from "@/lib/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Plain-language terms of service for Grow Local Creative covering website content, project agreements, and client ownership.",
  alternates: {
    canonical: "https://growlocalcreative.com/terms",
  },
};

export default async function TermsPage() {
  const settings = await getSiteSettingsContent();
  const email = settings.email || OFFICIAL_EMAIL;
  const phone = settings.phone || "916-869-4142";

  return (
    <main className="flex-grow bg-background text-foreground py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <h1 className="font-heading text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: November 2026 · {settings.agencyName} (Cool, CA)
        </p>

        <div className="space-y-8 text-base leading-relaxed text-foreground/85">
          <section className="space-y-3">
            <h2 className="font-heading text-2xl font-medium text-foreground">
              1. Use of This Website &amp; Free Resources
            </h2>
            <p>
              The guides, checklists, and articles published on growlocalcreative.com — including
              our 5-Minute Google Maps Setup Checklist — are provided for general informational use
              by local business owners. While we keep everything practical and current, search
              platform algorithms (such as Google Search and Google Maps) change regularly and no
              specific ranking outcome is guaranteed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-2xl font-medium text-foreground">
              2. Project Scope &amp; Client Ownership
            </h2>
            <p>
              Specific website builds, rescues, Google Business Profile setups, and menu projects
              are governed by the written flat-rate scope agreed upon before work begins. Upon final
              payment, clients retain full ownership of their domain names, business profiles, and
              custom website deliverables — with no long-term lock-in contracts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-2xl font-medium text-foreground">
              3. Questions or Concerns
            </h2>
            <p>
              If you have any questions about these terms or a project scope, contact Renee directly:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Email:{" "}
                <a href={`mailto:${email}`} className="text-primary underline hover:text-primary/80">
                  {email}
                </a>
              </li>
              <li>
                Phone / Text:{" "}
                <a
                  href={`tel:${phone.replace(/[^0-9]/g, "")}`}
                  className="text-primary underline hover:text-primary/80"
                >
                  {phone}
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
