import type { Metadata } from "next";
import Script from "next/script";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://growlocalcreative.com"),
  title: {
    default: "Grow Local Creative | Simple Websites for Local Businesses in Cool, CA",
    template: "%s | Grow Local Creative",
  },
  description:
    "Simple, phone-friendly websites for small businesses, nonprofits, churches, and makers across the Georgetown Divide, Northern Foothill Sierras, and El Dorado & Placer Counties. No jargon, no big-agency price tag.",
  openGraph: {
    title: "Grow Local Creative | Simple Websites for Local Businesses",
    description:
      "A neighbor, not a corporation. Simple, phone-friendly websites for small businesses, nonprofits, churches, and makers around Cool, CA.",
    url: "https://growlocalcreative.com",
    siteName: "Grow Local Creative",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/Grow Local Creative_Green.ico",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://growlocalcreative.com/#organization",
  "name": "Grow Local Creative",
  "description":
    "Simple, phone-friendly websites and web tools for small businesses, nonprofits, churches, and makers across the Georgetown Divide and Northern Foothill Sierras.",
  "url": "https://growlocalcreative.com",
  "email": "growlocalcreative@gmail.com",
  "telephone": "+1-916-869-4142",
  "logo": "https://growlocalcreative.com/logo.png",
  "image": "https://growlocalcreative.com/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Cool",
    "addressRegion": "CA",
    "addressCountry": "US"
  },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "El Dorado County, CA" },
    { "@type": "AdministrativeArea", "name": "Placer County, CA" },
    { "@type": "Place", "name": "Georgetown Divide" },
    { "@type": "Place", "name": "Northern Foothill Sierras" },
    { "@type": "Place", "name": "Cool, CA" },
    { "@type": "Place", "name": "Pilot Hill, CA" },
    { "@type": "Place", "name": "Georgetown, CA" },
    { "@type": "Place", "name": "Garden Valley, CA" },
    { "@type": "Place", "name": "Greenwood, CA" }
  ],
  "knowsAbout": [
    "Web Design",
    "Local SEO",
    "Google Business Profile",
    "AI-Assisted Web Development",
    "Nonprofit Websites"
  ],
  "openingHours": "Mo-Fr 09:00-17:00",
  "priceRange": "$",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-916-869-4142",
    "contactType": "customer service",
    "email": "growlocalcreative@gmail.com",
    "availableLanguage": "English"
  }
};

const navigationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "SiteNavigationElement",
      "position": 1,
      "name": "About",
      "url": "https://growlocalcreative.com/#about"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 2,
      "name": "Services",
      "url": "https://growlocalcreative.com/#services"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 3,
      "name": "Free Tools",
      "url": "https://growlocalcreative.com/#freebies"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 4,
      "name": "FAQ",
      "url": "https://growlocalcreative.com/#faq"
    }
  ]
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://growlocalcreative.com"
    }
  ]
};

const speakableJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".font-heading", ".hero-subhead"]
  },
  "url": "https://growlocalcreative.com"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          id="local-business-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          id="navigation-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationJsonLd) }}
        />
        <script
          type="application/ld+json"
          id="breadcrumb-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          id="speakable-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JY9EM9G6JM"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JY9EM9G6JM');
          `}
        </Script>
        <ScrollToTop />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
