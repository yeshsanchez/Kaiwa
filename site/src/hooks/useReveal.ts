import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Section scroll-reveal, modelled on the Portfolio's ScrollTrigger pattern.
 *
 * Inside the returned scope:
 *  - `[data-reveal]`          → element fades + rises as it enters the viewport.
 *  - `[data-reveal-stagger]`  → its direct children stagger in together when the
 *                               container reaches the trigger point.
 *  - `[data-reveal-media]`    → wipes up via clip-path (device shots, panels).
 *
 * Everything is made instantly visible when the user prefers reduced motion.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const scope = useRef<T>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const singles = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const groups = gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]");
      const media = gsap.utils.toArray<HTMLElement>("[data-reveal-media]");

      if (reduce) {
        gsap.set([...singles, ...media], { autoAlpha: 1, y: 0, clipPath: "none" });
        groups.forEach((g) =>
          gsap.set(Array.from(g.children), { autoAlpha: 1, y: 0 }),
        );
        return;
      }

      singles.forEach((el) => {
        gsap.from(el, {
          y: 34,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        });
      });

      groups.forEach((g) => {
        gsap.from(Array.from(g.children), {
          y: 40,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: g, start: "top 82%" },
        });
      });

      media.forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.05,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 84%" },
        });
      });
    },
    { scope },
  );

  return scope;
}
