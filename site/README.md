# Kaiwa — marketing landing page (React)

A standalone single-page marketing site for Kaiwa. **Completely separate from the
app** (`../server/` + `../web/`) — it is not served by or wired into it. Build it
to static files and host anywhere (GitHub Pages, Netlify, Vercel, an S3 bucket…).

This replaces the older hand-written `../landing/index.html`. That file is left in
place for reference; delete it once you're happy with this one.

## Stack

- **Vite + React 19 + TypeScript** (same toolchain as the Portfolio site)
- **Tailwind CSS v4** via `@tailwindcss/vite` — theme tokens live in `src/index.css`
  under `@theme` (`bg-rose`, `text-sumi`, `font-display`, … are generated from them)
- **shadcn/ui project structure** — `components.json`, the `@/` path alias, and
  `src/components/ui/` (see note below)
- **[@paper-design/shaders-react]** — the animated **pink** mesh-gradient hero
  background (`src/components/ui/shaders-hero-section.tsx`), recoloured to Kaiwa's
  icon palette (`#ee6c85 → #d94b63`)
- **GSAP + ScrollTrigger** (`@gsap/react`) — scroll reveals, mirroring the pattern
  used in the Portfolio (`src/hooks/useReveal.ts`)
- **framer-motion**, **lucide-react** icons

## Develop

```bash
cd site
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + static build → dist/
npm run preview    # serve the production build locally
```

## Structure

```
src/
  index.css                     # Tailwind import + Kaiwa @theme tokens + keyframes
  App.tsx                       # section order + ScrollTrigger.refresh on font load
  hooks/useReveal.ts            # GSAP scroll-reveal helper (data-reveal / -stagger / -media)
  lib/utils.ts                  # cn() — shadcn helper
  components/
    ui/shaders-hero-section.tsx # pink paper-shaders background (shadcn ui component)
    Nav.tsx  Hero.tsx  Devices.tsx  Features.tsx
    YourAI.tsx  HowItWorks.tsx  Finale.tsx  Footer.tsx
public/
  kaiwa1.png  kaiwa2.png  kaiwa3.png   # app mockups (hero + devices section)
  icon.svg                             # Kaiwa app logo
```

## About the shadcn structure

This project already follows the shadcn convention, so no `shadcn init` was needed.
If you ever want the CLI to add more components, it will work out of the box because:

- `components.json` points the **`ui` alias at `@/components/ui`** — shadcn's default.
  Keeping generated primitives in `components/ui/` (vs. mixing them into
  `components/`) is what lets the CLI find, add, and update them without clobbering
  your own hand-written components, and it's the path every shadcn doc/registry
  assumes. `shaders-hero-section.tsx` lives there for exactly that reason.
- The `@/*` alias is wired in **both** `tsconfig*.json` (for the editor/typecheck)
  and `vite.config.ts` (for the bundler).

Equivalent setup from scratch, had it not existed:

```bash
npm create vite@latest site -- --template react-ts
cd site && npm install
npm install tailwindcss @tailwindcss/vite   # Tailwind v4
# add the @/ alias to tsconfig + vite.config, then:
npx shadcn@latest init        # writes components.json, lib/utils.ts, base tokens
npm install @paper-design/shaders-react framer-motion gsap @gsap/react lucide-react
```

## Notes

- The hero shows an honest trust line (open-source / AGPL-3.0 / local) rather than
  invented app-store star ratings from the reference mockup.
- Download / source links point at `github.com/yeshsanchez/Kaiwa`.
- Motion respects `prefers-reduced-motion`: the shader stops animating and all
  reveal/intro states resolve to their final, fully-visible layout.

[@paper-design/shaders-react]: https://github.com/paper-design/shaders
