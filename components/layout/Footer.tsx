import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Github,
  Link as LinkIcon,
  Calendar,
} from "lucide-react";
import { FooterNewsletter } from "@/components/FooterNewsletter";
import { DEFAULT_BOOKING_URL, OFFICIAL_EMAIL, type SiteSettings } from "@/lib/content";
import { SPECIALTY_SERVICES } from "@/lib/services-data";
import { CITY_LOCATIONS } from "@/lib/locations-data";

const iconMap: Record<string, any> = {
  Instagram: Instagram,
  Facebook: Facebook,
  Linkedin: Linkedin,
  Twitter: Twitter,
  Youtube: Youtube,
  Github: Github,
};

export function Footer({ settings }: { settings: SiteSettings }) {
  const currentYear = new Date().getFullYear();
  const email = settings.email || OFFICIAL_EMAIL;

  return (
    <footer className="bg-primary text-primary-foreground pt-14 pb-8">
      <div className="container mx-auto px-4">
        {/* Inline Lead Magnet Checklist Banner */}
        <FooterNewsletter newsletter={settings.newsletter} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-secondary/20 bg-white p-1 shrink-0">
                <img
                  src="/logo.png"
                  alt={`${settings.agencyName} - Sierra Foothills Web Design & Local SEO`}
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-heading text-2xl font-semibold tracking-tight">
                {settings.agencyName}
              </span>
            </div>
            <p className="text-primary-foreground/90 text-sm leading-relaxed">
              {settings.footerDescription}
            </p>
            <div className="flex gap-3 pt-1">
              {settings.socialLinks
                ?.filter((link) => link.isEnabled && link.url)
                .map((social, idx) => {
                  const Icon = iconMap[social.platform] || LinkIcon;
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 w-9 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all"
                      aria-label={`Follow ${settings.agencyName} on ${social.platform}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  );
                })}
            </div>
            <p className="text-xs text-primary-foreground/85">A Neighbor, Not a Corporation.</p>
          </div>

          {/* Core Specialties */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-medium">Core Specialties</h2>
            <ul className="space-y-2.5 text-sm">
              {SPECIALTY_SERVICES.map((svc) => (
                <li key={svc.slug}>
                  <Link
                    href={`/services/${svc.slug}`}
                    className="text-primary-foreground/90 hover:text-secondary transition-colors"
                  >
                    {svc.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-primary-foreground/90 hover:text-secondary transition-colors"
                >
                  All Services Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="text-primary-foreground/90 hover:text-secondary transition-colors"
                >
                  Our Work &amp; Local Partners
                </Link>
              </li>
              <li>
                <Link
                  href="/audit"
                  className="text-primary-foreground/90 hover:text-secondary transition-colors"
                >
                  Free Website &amp; Google Audit
                </Link>
              </li>
              <li>
                <Link
                  href="/checklist/google-maps"
                  className="text-primary-foreground/90 hover:text-secondary transition-colors"
                >
                  Free 5-Min Google Maps Checklist
                </Link>
              </li>
            </ul>
          </div>

          {/* Areas We Serve */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-medium">
              <Link href="/locations" className="hover:text-secondary transition-colors">
                Areas We Serve
              </Link>
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {CITY_LOCATIONS.map((loc) => (
                <li key={loc.slug}>
                  <Link
                    href={`/locations/${loc.slug}`}
                    className="text-primary-foreground/90 hover:text-secondary transition-colors"
                  >
                    {loc.city}, CA
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-medium">Get in Touch</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={settings.bookingUrl || DEFAULT_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-secondary transition-colors font-medium"
                >
                  <Calendar className="h-4 w-4 text-secondary shrink-0" aria-hidden="true" />
                  <span>Book a Free 15-Min Chat</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 hover:text-secondary transition-colors"
                >
                  <Mail className="h-4 w-4 text-secondary shrink-0" aria-hidden="true" />
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone.replace(/[^0-9]/g, "")}`}
                  className="flex items-center gap-3 hover:text-secondary transition-colors"
                >
                  <Phone className="h-4 w-4 text-secondary shrink-0" aria-hidden="true" />
                  <span>{settings.phone}</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-primary-foreground/90 leading-relaxed">
                  {settings.location} · Serving El Dorado, Placer, Nevada &amp; Sacramento Counties.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/15 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/85">
          <p>
            © {currentYear} {settings.agencyName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 items-center">
            <Link href="/services" className="hover:text-secondary">
              Services
            </Link>
            <Link href="/locations" className="hover:text-secondary">
              Service Areas
            </Link>
            <Link href="/partners" className="hover:text-secondary">
              Our Work
            </Link>
            <Link href="/privacy" className="hover:text-secondary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-secondary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
