import { useReveal } from "@/hooks/useReveal";

type Row = { name: string; sub: string; tag: string; kind: "local" | "opt" };

const ROWS: Row[] = [
  { name: "Ollama", sub: "Free local model on your machine", tag: "Default", kind: "local" },
  { name: "whisper.cpp", sub: "Local speech-to-text", tag: "Local", kind: "local" },
  {
    name: "VOICEVOX & system voices",
    sub: "Local text-to-speech",
    tag: "Local",
    kind: "local",
  },
  {
    name: "Gemini · OpenAI · Anthropic",
    sub: "Bring your own API key",
    tag: "Optional",
    kind: "opt",
  },
];

export default function YourAI() {
  const scope = useReveal<HTMLElement>();

  return (
    <section id="ai" ref={scope} className="py-24 sm:py-28">
      <div className="mx-auto grid w-[min(1080px,90vw)] items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div data-reveal-stagger>
          <div className="mb-1 h-px w-11 bg-rose/70" />
          <div className="text-[0.74rem] font-medium uppercase tracking-[0.32em] text-sub">
            <span className="text-deeprose">選</span>&nbsp; Your AI, your rules
          </div>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4.2vw,2.9rem)] font-medium text-sumi">
            Private by default.{" "}
            <span className="text-deeprose">Powerful by choice.</span>
          </h2>
          <p className="mt-5 max-w-[48ch] text-[1.06rem] text-ink-soft">
            Out of the box Kaiwa runs a free local model on your own hardware —
            nothing is sent anywhere. Want more horsepower? Plug in your own cloud
            key and only that provider ever sees your text. You always hold the
            trade-off.
          </p>
          <a
            href="#download"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ee6c85,#d94b63)] px-6 py-3 font-medium text-white shadow-[0_12px_26px_-12px_rgba(217,75,99,0.6)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Start fully local
          </a>
        </div>

        <div
          data-reveal
          className="rounded-2xl border border-line bg-white px-8 py-2 shadow-[0_22px_46px_-30px_rgba(190,55,90,0.42)]"
        >
          {ROWS.map((r) => (
            <div
              key={r.name}
              className="flex items-center gap-4 border-t border-line-soft py-5 first:border-t-0"
            >
              <div>
                <div className="font-display text-[1.02rem] font-medium text-sumi">
                  {r.name}
                </div>
                <div className="mt-0.5 text-[0.82rem] text-sub">{r.sub}</div>
              </div>
              <span
                className={`ml-auto rounded-full px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.1em] ${
                  r.kind === "local"
                    ? "bg-rose-soft text-deeprose"
                    : "bg-plum-soft text-plum"
                }`}
              >
                {r.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
