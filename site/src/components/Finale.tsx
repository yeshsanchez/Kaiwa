import { Download, Github } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const RELEASES = "https://github.com/yeshsanchez/Kaiwa/releases/latest";
const REPO = "https://github.com/yeshsanchez/Kaiwa";

export default function Finale() {
  const scope = useReveal<HTMLElement>();

  return (
    <section
      id="download"
      ref={scope}
      className="relative mt-5 overflow-hidden py-32 text-center text-white"
      style={{
        background: "linear-gradient(155deg,#ef6f88 0%,#d94b63 44%,#a6437f 100%)",
      }}
    >
      {/* ensō brush motif */}
      <div
        aria-hidden="true"
        className="animate-breathe pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{ width: "min(520px,80vw)", height: "min(520px,80vw)", color: "#ffd7e0" }}
      >
        <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
          <path
            d="M143 38 C176 60 188 104 168 140 C146 179 96 190 58 170 C18 149 8 98 32 60 C50 31 84 20 116 27"
            stroke="currentColor"
            strokeWidth="11"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div data-reveal-stagger className="relative mx-auto w-[min(1080px,90vw)]">
        <div className="text-[0.74rem] font-medium uppercase tracking-[0.32em] text-white/80">
          会話 · かいわ · conversation
        </div>
        <h2 className="mx-auto mt-4 max-w-[20ch] font-display text-[clamp(2.1rem,5vw,3.4rem)] font-medium leading-[1.3]">
          Your next conversation is{" "}
          <span className="text-[#ffe0e8]">already on your machine</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[52ch] text-[1.12rem] text-white/85">
          No sign-up, no meter running, no one listening in. Download Kaiwa and
          begin speaking Japanese today — the tutor that is, at last, quietly and
          entirely yours.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href={RELEASES}
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-[1.02rem] font-medium text-deeprose shadow-[0_14px_30px_-12px_rgba(120,20,50,0.45)] transition-colors hover:bg-[#fff5f7]"
          >
            <Download className="h-5 w-5" strokeWidth={2.2} />
            Download for macOS / Windows
          </a>
          <a
            href={REPO}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/40 px-8 py-4 text-[1.02rem] font-medium text-white transition-colors hover:border-white hover:bg-white/10"
          >
            <Github className="h-5 w-5" strokeWidth={2} />
            View source on GitHub
          </a>
        </div>

        <p className="mt-7 text-[0.85rem] tracking-wide text-white/70">
          Free &amp; open source · AGPL-3.0
        </p>
      </div>
    </section>
  );
}
