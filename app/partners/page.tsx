import type { Metadata } from "next";
import { DEFAULT_BOOKING_URL, getPartnersContent, getSiteSettingsContent } from "@/lib/content";
import { PartnersClient } from "@/components/partners/PartnersClient";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsContent();
  const title = "Our Work & Local Partners";
  const description =
    "Explore real websites, mobile menus, and digital tools built for contractors, smokehouses, artisan makers, business alliances, and community charities across Cool, Auburn, Roseville, Folsom, Placerville, and the Sierra Foothills.";

  return {
    title,
    description,
    alternates: {
      canonical: "https://growlocalcreative.com/partners",
    },
    openGraph: {
      title: `${title} | ${settings.agencyName}`,
      description,
      url: "https://growlocalcreative.com/partners",
      siteName: settings.agencyName,
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 800,
          alt: `${settings.agencyName} local portfolio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${settings.agencyName}`,
      description,
      images: ["/logo.png"],
    },
  };
}

export default async function PartnersPage() {
  const [partners, settings] = await Promise.all([
    getPartnersContent(),
    getSiteSettingsContent(),
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Our Work & Local Partners | ${settings.agencyName}`,
    description:
      "Showcase of local websites, mobile menus, and digital tools built for Sierra Foothills and Greater Sacramento businesses, contractors, and nonprofits.",
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
            "@id": "https://growlocalcreative.com/#localbusiness",
          },
        },
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://growlocalcreative.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Our Work & Local Partners",
        item: "https://growlocalcreative.com/partners",
      },
    ],
  };

  return (
    <>
      <script
        id="partners-collection-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        id="partners-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="flex-grow">
        <PartnersClient
          content={partners}
          phone={settings.phone}
          bookingUrl={settings.bookingUrl || DEFAULT_BOOKING_URL}
        />
      </main>
    </>
  );
}
