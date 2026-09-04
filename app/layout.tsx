import type { Metadata } from "next";
import Script from "next/script";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ScrollToTop } from "@/components/ScrollToTop";
import { getSiteSettingsContent, getFaqContent, getServicesContent } from "@/lib/content";
import "./globals.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsContent();
  return {
    metadataBase: new URL("https://growlocalcreative.com"),
    title: {
      default: `${settings.agencyName} | Web Design for Georgetown Divide`,
      template: `%s | ${settings.agencyName}`,
    },
    description:
      "Simple, phone-friendly websites for small businesses, nonprofits, and makers across the Georgetown Divide, Northern Foothill Sierras, and El Dorado & Placer Counties. No jargon, no big-agency price tag.",
    keywords: [
      "Web Design Georgetown Divide",
      "Small Business Website Cool CA",
      "Nonprofit Web Design El Dorado County",
      "Local SEO Cool CA",
      "Foothill Sierra Web Development",
      "Simple Websites for Makers",
      "Grow Local Creative",
      "Georgetown CA Website Builder"
    ],
    openGraph: {
      title: `${settings.agencyName} | Simple Websites for Local Businesses`,
      description:
        "A neighbor, not a corporation. Simple, phone-friendly websites for small businesses, nonprofits, churches, and makers around Cool, CA.",
      url: "https://growlocalcreative.com",
      siteName: settings.agencyName,
      locale: "en_US",
      type: "website",
    },
    icons: {
      icon: "/Grow Local Creative_Green.ico",
    },
    verification: {
      google: "7s9Nx1UeeBbX0Emq0X4v4U1Y6f-Z4-40L14",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, faqData, servicesData] = await Promise.all([
    getSiteSettingsContent(),
    getFaqContent(),
    getServicesContent()
  ]);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.agencyName,
    "url": "https://growlocalcreative.com",
    "logo": "https://growlocalcreative.com/logo.png",
    "email": settings.email,
    "telephone": settings.phone,
    "sameAs": settings.socialLinks.filter(l => l.isEnabled).map(l => l.url)
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://growlocalcreative.com/#organization",
    "name": settings.agencyName,
    "description":
      "Simple, phone-friendly websites and web tools for small businesses, nonprofits, churches, and makers across the Georgetown Divide and Northern Foothill Sierras.",
    "url": "https://growlocalcreative.com",
    "email": settings.email,
    "telephone": settings.phone,
    "logo": "https://growlocalcreative.com/logo.png",
    "image": "https://growlocalcreative.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cool",
      "addressRegion": "CA",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 38.8924,
      "longitude": -121.0163
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
      "telephone": settings.phone,
      "contactType": "customer service",
      "email": settings.email,
      "availableLanguage": "English"
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Web Design and SEO for Local Businesses",
    "provider": {
      "@type": "ProfessionalService",
      "name": settings.agencyName
    },
    "areaServed": {
      "@type": "State",
      "name": "California"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Web Services",
      "itemListElement": servicesData.items.map((s, i) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": s.title,
          "description": s.description
        },
        "position": i + 1
      }))
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
      "cssSelector": [".font-heading", ".hero-subhead", ".section-heading"]
    },
    "url": "https://growlocalcreative.com"
  };

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${settings.primaryColor};
            --primary-foreground: ${settings.primaryForeground};
            --secondary: ${settings.secondaryColor};
            --secondary-foreground: ${settings.secondaryForeground};
            --background: ${settings.backgroundColor};
            --foreground: ${settings.foregroundColor};
            --card: ${settings.cardColor};
            --border: ${settings.borderColor};
            --ring: ${settings.primaryColor};
          }
        `}} />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          id="organization-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          id="local-business-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          id="faq-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          id="services-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
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
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  );
}
