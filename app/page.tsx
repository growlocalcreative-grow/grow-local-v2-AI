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
  getFutureContent,
  getFaqContent,
  getSiteSettingsContent,
} from "@/lib/content";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Page content
export default async function HomePage() {
  const [hero, about, services, freebies, future, faq, settings] = await Promise.all([
    getHeroContent(),
    getAboutContent(),
    getServicesContent(),
    getFreebiesContent(),
    getFutureContent(),
    getFaqContent(),
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
        return <Future key="future" data={future} />;
      case "freebies":
        return <Freebies key="freebies" data={freebies} />;
      case "faq":
        return <FAQ key="faq" data={faq} />;
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
