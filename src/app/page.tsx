import { Apply } from "@/components/Apply";
import { Dawn } from "@/components/Dawn";
import { DraftSection } from "@/components/DraftSection";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { HandoffSection } from "@/components/HandoffSection";
import { Hero } from "@/components/Hero";
import { ListSection } from "@/components/ListSection";
import { Nav } from "@/components/Nav";
import { Orbit } from "@/components/Orbit";
import { Pricing } from "@/components/Pricing";
import { Rules } from "@/components/Rules";

export default function Home() {
  return (
    <>
      <a
        href="#list"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-ice-50 focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to the product
      </a>
      <Nav />
      <main>
        <Hero />
        <Dawn />
        <ListSection />
        <DraftSection />
        <HandoffSection />
        <Orbit />
        <Rules />
        <Pricing />
        <Faq />
        <Apply />
      </main>
      <Footer />
    </>
  );
}
