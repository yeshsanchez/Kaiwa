import { useEffect, useState } from "react";
import { Download } from "lucide-react";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#devices", label: "Everywhere" },
  { href: "#ai", label: "Your AI" },
  { href: "#how", label: "How it works" },
];

export default function Nav() {
  // Transparent while sitting over the hero; a subtle frosted pill fades in once
  // the user scrolls, so links stay legible over the lighter content sections.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 32));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4">
      <nav
        className={`mt-3 flex w-[min(1080px,94vw)] items-center justify-between rounded-full py-2 pr-2 pl-4 transition-all duration-300 ${
          scrolled
            ? "border border-line/70 bg-paper/70 shadow-[0_12px_34px_-18px_rgba(190,55,90,0.45)] backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5">
          <img src="./icon.svg" alt="Kaiwa logo" className="h-8 w-8 rounded-[9px]" />
          <span className="text-[1.14rem] font-semibold tracking-tight text-sumi">
            Kaiwa <span className="jp font-medium text-deeprose">会話</span>
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden rounded-full px-3.5 py-2 text-[0.9rem] font-medium text-ink-soft transition-colors hover:bg-white/50 hover:text-deeprose md:inline-block"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#download"
            className="ml-1 inline-flex items-center gap-2 rounded-full bg-sumi px-5 py-2.5 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" strokeWidth={2.2} />
            Download
          </a>
        </div>
      </nav>
    </header>
  );
}
