import {
  MessageCircle,
  Phone,
  Drama,
  Wand2,
  Languages,
  BookMarked,
  Repeat2,
  BrainCircuit,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

type Feature = { icon: LucideIcon; title: string; body: string };

const FEATURES: Feature[] = [
  {
    icon: MessageCircle,
    title: "Free chat",
    body: "Natural conversation tuned to your JLPT level, N5 through N1. It meets you where you are and gently stretches you.",
  },
  {
    icon: Phone,
    title: "Voice calls",
    body: "Just talk. Real-time spoken back-and-forth with automatic mic hand-off — no typing, no buttons to fumble.",
  },
  {
    icon: Drama,
    title: "36 roleplay scenes",
    body: "Ramen shop, job interview, izakaya, ryokan, kōban… or write your own scene and cast Kaiwa in any role.",
  },
  {
    icon: Wand2,
    title: "Gentle corrections",
    body: "Every message is checked in the background. Mistakes are explained in English — and good advanced kanji is praised, not “fixed”.",
  },
  {
    icon: Languages,
    title: "Furigana & romaji",
    body: "Toggle readings, romaji and translation per conversation. Tap any word for an instant offline dictionary meaning.",
  },
  {
    icon: BookMarked,
    title: "490k-word dictionary",
    body: "The full JMdict, searchable in Japanese or English — completely offline, instant, and never confabulated.",
  },
  {
    icon: Repeat2,
    title: "Spaced repetition",
    body: "Anki-style SRS built in. Words you stumble on return exactly when you're about to forget them.",
  },
  {
    icon: BrainCircuit,
    title: "It remembers you",
    body: "Recent mistakes and vocabulary feed back into the tutor's memory, so lessons compound instead of resetting.",
  },
  {
    icon: LineChart,
    title: "Progress & reports",
    body: "Streaks, minutes practised, mistake patterns, and per-session reports you can save as PDF.",
  },
];

export default function Features() {
  const scope = useReveal<HTMLElement>();

  return (
    <section id="features" ref={scope} className="py-24 sm:py-28">
      <div className="mx-auto w-[min(1080px,90vw)]">
        <div data-reveal className="mx-auto max-w-[620px] text-center">
          <div className="mx-auto mb-1 h-px w-11 bg-rose/70" />
          <div className="text-[0.74rem] font-medium uppercase tracking-[0.32em] text-sub">
            <span className="text-deeprose">会</span>&nbsp; Everything in one quiet app
          </div>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4.2vw,2.9rem)] font-medium text-sumi">
            A whole language partner,{" "}
            <span className="text-deeprose">not just a chatbot</span>
          </h2>
          <p className="mt-4 text-[1.08rem] text-ink-soft">
            Practise the way you actually will in Japan — then let Kaiwa quietly
            remember every slip and turn it into review.
          </p>
        </div>

        <div
          data-reveal-stagger
          className="mt-14 grid grid-cols-1 border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group border-r border-b border-line px-8 py-9 transition-colors duration-300 hover:bg-paper-2"
            >
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl border border-rose-soft-2 bg-rose-soft text-deeprose transition-colors duration-300 group-hover:bg-white">
                <f.icon className="h-6 w-6" strokeWidth={1.85} />
              </div>
              <h3 className="font-display text-[1.18rem] font-semibold text-sumi">
                {f.title}
              </h3>
              <p className="mt-2.5 text-[0.96rem] leading-relaxed text-ink-soft">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
