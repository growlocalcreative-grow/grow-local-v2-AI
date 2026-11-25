import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OFFICIAL_EMAIL, getSiteSettingsContent } from "@/lib/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Plain-language privacy policy for Grow Local Creative explaining what information we collect, how we use it, and how to unsubscribe or request deletion.",
  alternates: {
    canonical: "https://growlocalcreative.com/privacy",
  },
};

export default async function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: November 2026 · {settings.agencyName} (Cool, CA)
        </p>

        <div className="space-y-8 text-base leading-relaxed text-foreground/85">
          <section className="space-y-3">
            <h2 className="font-heading text-2xl font-medium text-foreground">
              1. Plain-Language Promise
            </h2>
            <p>
              We are a local web studio in Cool, California — not a data broker. We never sell, rent,
              or trade your personal information or email address to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-2xl font-medium text-foreground">
              2. What Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Email signups:</strong> If you request our free 5-Minute Google Maps Setup
                Checklist, we store the email address you submit so we can share practical local web
                and Google Maps tips.
              </li>
              <li>
                <strong>Direct inquiries &amp; bookings:</strong> When you book a 15-minute chat via
                Google Calendar, call, text, or email us, we receive the contact details and project
                notes you choose to share.
              </li>
              <li>
                <strong>Basic website analytics:</strong> We use Google Analytics to understand
                overall page visits and improve site speed and usefulness.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-2xl font-medium text-foreground">
              3. How to Unsubscribe or Request Deletion
            </h2>
            <p>
              You can ask us to remove your email or contact record at any time — no hoops or
              automated runaround. Just reach out directly:
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
