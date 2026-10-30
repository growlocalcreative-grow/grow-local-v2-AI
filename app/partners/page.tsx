import type { Metadata } from "next";
import Script from "next/script";
import { getPartnersContent, getSiteSettingsContent } from "@/lib/content";
import { PartnersClient } from "@/components/partners/PartnersClient";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsContent();
  return {
    title: `Our Work & Local Partners | Websites Built for Foothill Businesses | ${settings.agencyName}`,
    description:
      "Explore real websites, mobile menus, and digital tools built for Foothill contractors, smokehouses, business alliances, and community charities across Cool, Georgetown, and Auburn, CA.",
    alternates: {
      canonical: "https://growlocalcreative.com/partners",
    },
    openGraph: {
      title: `Our Work & Local Partners | ${settings.agencyName}`,
      description:
        "Real local websites built for Foothill contractors, smokehouses, and community groups. Fast, mobile-first, and designed to turn clicks into phone calls.",
      url: "https://growlocalcreative.com/partners",
      siteName: settings.agencyName,
      type: "website",
    },
  };
}

export default async function PartnersPage() {
  const [partners, settings] = await Promise.all([
    getPartnersContent(),
    getSiteSettingsContent(),
  ]);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Our Work & Local Partners | Grow Local Creative",
    description:
      "Showcase of local websites and digital tools built for Georgetown Divide and Foothill businesses, contractors, and nonprofits.",
    url: "https://growlocalcreative.com/partners",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: partners.projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.name,
          url: project.url,
          headline: project.tagline,
          description: project.description,
          creator: {
            "@type": "LocalBusiness",
            name: settings.agencyName,
            telephone: settings.phone,
            email: settings.email,
          },
        },
      })),
    },
  };

  return (
    <>
      <Script
        id="partners-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <main className="flex-grow">
        <PartnersClient content={partners} phone={settings.phone} />
      </main>
    </>
  );
}
