"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

interface ShaderBackgroundProps {
  children: ReactNode;
  className?: string;
}

/**
 * Kaiwa pink mesh-gradient hero backdrop.
 *
 * Adapted from a @paper-design/shaders demo and recoloured to Kaiwa's icon
 * palette (#ee6c85 → #d94b63). Kept light and airy — warm white drifting into
 * rose — so the deep-plum headline text stays legible on top (the same
 * light-hero approach as the health-coach reference, just pink instead of sky).
 *
 * Motion is switched off (speed 0 stops the shader's rAF loop) when the user
 * prefers reduced motion or when the hero has scrolled out of view; the library
 * additionally pauses whenever the tab is hidden.
 */
export function ShaderBackground({ children, className = "" }: ShaderBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [reduce] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (reduce || !ref.current) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [reduce]);

  const paused = reduce || !inView;

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${className}`}>
      {/* SVG filter used to give the frosted bento chips a subtle glassy edge */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="kaiwa-glass" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.008" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" />
          </filter>
        </defs>
      </svg>

      {/* base pink mesh */}
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={["#fff8f9", "#fde4ec", "#ffc9d8", "#f4a5bb", "#e85d75"]}
        speed={paused ? 0 : 0.3}
        distortion={0.8}
        swirl={0.1}
        grainOverlay={0.04}
        scale={1.2}
      />
      {/* second, slower layer of deeper rose adds painterly depth */}
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-45 mix-blend-soft-light"
        colors={["#ffffff", "#ee6c85", "#ffd9e2", "#d94b63"]}
        speed={paused ? 0 : 0.18}
        distortion={0.6}
        swirl={0.25}
        scale={1.35}
      />

      {/* legibility + vignette: bright centre keeps the headline crisp; a soft
          rose vignette darkens the outer edges for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 78% at 50% 15%, rgba(255,255,255,0.72), rgba(255,255,255,0.10) 46%, transparent 66%)," +
            "radial-gradient(125% 100% at 50% 46%, transparent 58%, rgba(200,60,92,0.12) 100%)",
        }}
      />

      {/* dedicated bottom fade strip — always melts the hero into the paper of
          the next section, independent of the content height, so there's no
          visible seam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-52"
        style={{
          background:
            "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-paper) 70%, transparent) 55%, var(--color-paper) 94%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
