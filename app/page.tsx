import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Future } from "@/components/sections/Future";
import { Freebies } from "@/components/sections/Freebies";
import { FAQ } from "@/components/sections/FAQ";
import {
  getHeroContent,
  getAboutContent,
  getServicesContent,
  getFreebiesContent,
  getSiteSettingsContent,
} from "@/lib/content";

// Page content revalidation (1 hour)
export const revalidate = 3600;

// Page content
export default async function HomePage() {
  const [hero, about, services, freebies, settings] = await Promise.all([
    getHeroContent(),
    getAboutContent(),
    getServicesContent(),
    getFreebiesContent(),
    getSiteSettingsContent(),
  ]);

  const order = settings.sectionOrder || ["hero", "about", "services", "future", "freebies", "faq"];
  const visibleOrder = order.filter(id => !(settings.hiddenSections || []).includes(id));

  const renderSection = (id: string) => {
    switch (id) {
      case "hero":
        return <Hero key="hero" data={hero} />;
      case "about":
        return <About key="about" data={about} />;
      case "services":
        return <Services key="services" data={services} />;
      case "future":
        // Future now fetches its own data on client
        return <Future key="future" />;
      case "freebies":
        return <Freebies key="freebies" data={freebies} />;
      case "faq":
        // FAQ now fetches its own data on client
        return <FAQ key="faq" />;
      default:
        return null;
    }
  };

  return (
    <main className="flex-grow">
      {visibleOrder.map(renderSection)}
    </main>
  );
}
