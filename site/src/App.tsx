import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Devices from "@/components/Devices";
import Features from "@/components/Features";
import YourAI from "@/components/YourAI";
import HowItWorks from "@/components/HowItWorks";
import Finale from "@/components/Finale";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // Recompute ScrollTrigger positions once webfonts + images settle so the
  // reveal start points line up with the final layout.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Devices />
        <Features />
        <YourAI />
        <HowItWorks />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
