import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Cormorant_Garamond, Outfit } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ScrollToTop } from "@/components/ScrollToTop";
import {
  getSiteSettingsContent,
  TARGET_CITIES,
  TARGET_COUNTIES,
} from "@/lib/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

// SEO-friendly caching: revalidate every hour instead of every request
export const revalidate = 3600;

export async function generateViewport(): Promise<Viewport> {
  try {
    const settings = await getSiteSettingsContent();
    return {
      themeColor: settings.primaryColor,
    };
  } catch {
    return {
      themeColor: "#3D4337",
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettingsContent();
    const defaultTitle = `${settings.agencyName} | Website Rescues, Google Maps SEO & Mobile Menus`;
    const defaultDescription =
      "Website rescues & modernization, Google Business & Map optimization, and fast mobile restaurant & food truck menus for local businesses across Cool, Auburn, Roseville, Folsom, Placerville, Grass Valley & the Sierra Foothills.";

    return {
      metadataBase: new URL("https://growlocalcreative.com"),
      title: {
        default: defaultTitle,
        template: `%s | ${settings.agencyName}`,
      },
      description: defaultDescription,
      keywords: [
        "Website Rescues and Modernization",
        "Google Business Profile Optimization",
        "Restaurant and Food Truck Mobile Menus",
        "Web Design Cool CA",
        "Web Design Auburn CA",
        "Web Design Roseville CA",
        "Web Design Placerville CA",
        "Web Design Folsom CA",
        "Web Design Grass Valley CA",
        "Local SEO El Dorado County",
        "Local SEO Placer County",
        "Grow Local Creative",
      ],
      openGraph: {
        title: defaultTitle,
        description: defaultDescription,
        url: "https://growlocalcreative.com",
        siteName: settings.agencyName,
        locale: "en_US",
        type: "website",
        images: [
          {
            url: "/logo.png",
            width: 800,
            height: 800,
            alt: `${settings.agencyName} logo`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: defaultTitle,
        description: defaultDescription,
        images: ["/logo.png"],
      },
      icons: {
        icon: "/Grow Local Creative_Green.ico",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      verification: {
        google: "7s9Nx1UeeBbX0Emq0X4v4U1Y6f-Z4-40L14",
      },
    };
  } catch {
    return {
      metadataBase: new URL("https://growlocalcreative.com"),
      title: "Grow Local Creative | Website Rescues, Google Maps SEO & Mobile Menus",
      description:
        "Website rescues, Google Business & Map optimization, and mobile restaurant menus for Sierra Foothills and Greater Sacramento businesses.",
    };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settings;

  try {
    settings = await getSiteSettingsContent();
  } catch (error) {
    console.error("Failed to load layout content", error);
    return (
      <html lang="en" className={`${inter.variable} ${cormorant.variable} ${outfit.variable}`}>
        <body className="antialiased">{children}</body>
      </html>
    );
  }

  const sameAsLinks = (settings.socialLinks || [])
    .filter((l) => l && l.isEnabled && l.url)
    .map((l) => l.url);

  const areaServed = [
    ...TARGET_COUNTIES.map((name) => ({ "@type": "AdministrativeArea", name })),
    ...TARGET_CITIES.map((city) => ({ "@type": "City", name: `${city}, CA` })),
    { "@type": "Place", name: "Georgetown Divide, CA" },
    { "@type": "Place", name: "Sierra Foothills, CA" },
  ];

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://growlocalcreative.com/#organization",
    name: settings.agencyName,
    url: "https://growlocalcreative.com",
    logo: "https://growlocalcreative.com/logo.png",
    email: settings.email,
    telephone: settings.phone,
    founder: {
      "@type": "Person",
      name: "Renee",
    },
    sameAs: sameAsLinks,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://growlocalcreative.com/#website",
    name: settings.agencyName,
    url: "https://growlocalcreative.com",
    description:
      "Website rescues & modernization, Google Business & Map optimization, and mobile restaurant & food truck menus across the Sierra Foothills and Greater Sacramento.",
    publisher: {
      "@id": "https://growlocalcreative.com/#organization",
    },
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": "https://growlocalcreative.com/#localbusiness",
    name: settings.agencyName,
    description:
      "Local web design and Google Maps optimization studio in Cool, CA specializing in Website Rescues & Modernization, Google Business & Map Optimization, and fast mobile-first Restaurant & Food Truck Menus for businesses across El Dorado, Placer, Nevada, and Sacramento Counties.",
    url: "https://growlocalcreative.com",
    email: settings.email,
    telephone: settings.phone,
    logo: "https://growlocalcreative.com/logo.png",
    image: "https://growlocalcreative.com/logo.png",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cool",
      addressRegion: "CA",
      postalCode: "95614",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 38.8924,
      longitude: -121.0163,
    },
    areaServed,
    knowsAbout: [
      "Website Rescues & Modernization",
      "Google Business & Map Optimization",
      "Restaurant & Food Truck Mobile Menus",
      "Local SEO",
      "Small Business Web Design",
      "Contractor Websites",
    ],
    openingHours: "Mo-Fr 09:00-17:00",
    priceRange: "$$",
    sameAs: sameAsLinks,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone,
      contactType: "customer service",
      email: settings.email,
      availableLanguage: "English",
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${outfit.variable}`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
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
        `,
          }}
        />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          id="organization-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          id="website-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          id="local-business-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
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
