import { useReveal } from "@/hooks/useReveal";

const STEPS = [
  {
    num: "一",
    title: "Download",
    body: "Grab the build for macOS or Windows and unzip it. One folder, no installer maze.",
  },
  {
    num: "二",
    title: "Run setup",
    body: "One script pulls the speech model and dictionary. Ollama supplies the free local brain.",
  },
  {
    num: "三",
    title: "Meet your hardware",
    body: "A quick wizard checks your machine and picks a model that will actually feel responsive.",
  },
  {
    num: "四",
    title: "Start talking",
    body: "Open your browser, or add it to your phone's home screen, and begin your first conversation.",
  },
];

export default function HowItWorks() {
  const scope = useReveal<HTMLElement>();

  return (
    <section id="how" ref={scope} className="py-24 sm:py-28">
      <div className="mx-auto w-[min(1080px,90vw)]">
        <div data-reveal className="mx-auto max-w-[620px] text-center">
          <div className="mx-auto mb-1 h-px w-11 bg-rose/70" />
          <div className="text-[0.74rem] font-medium uppercase tracking-[0.32em] text-sub">
            <span className="text-deeprose">道</span>&nbsp; From zero to talking
          </div>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4.2vw,2.9rem)] font-medium text-sumi">
            Running in about five minutes
          </h2>
        </div>

        <div
          data-reveal-stagger
          className="mt-14 grid grid-cols-1 gap-y-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0"
        >
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className={`px-0 lg:px-8 ${
                i > 0 ? "lg:border-l lg:border-line" : ""
              }`}
            >
              <div className="jp text-[1.15rem] font-medium tracking-widest text-deeprose">
                {s.num}
              </div>
              <h3 className="mt-3.5 font-display text-[1.14rem] font-semibold text-sumi">
                {s.title}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
