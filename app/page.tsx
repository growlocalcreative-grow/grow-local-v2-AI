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
  getFaqContent,
} from "@/lib/content";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Page content
export default async function HomePage() {
  const [hero, about, services, freebies, faq] = await Promise.all([
    getHeroContent(),
    getAboutContent(),
    getServicesContent(),
    getFreebiesContent(),
    getFaqContent(),
  ]);

  return (
    <main className="flex-grow">
      <Hero data={hero} />
      <About data={about} />
      <Services data={services} />
      <Future />
      <Freebies data={freebies} />
      <FAQ data={faq} />
    </main>
  );
}
