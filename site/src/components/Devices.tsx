import { Monitor, Smartphone, RefreshCw, ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const POINTS = [
  {
    icon: Monitor,
    title: "Full desktop workspace",
    body: "Sidebar navigation, guided lessons and 36 roleplay scenarios with room to breathe on your Mac or PC.",
  },
  {
    icon: Smartphone,
    title: "Add it to your phone",
    body: "Installs from the browser as a home-screen app — voice calls and the mic work just like a native one.",
  },
  {
    icon: RefreshCw,
    title: "Your progress follows you",
    body: "Streaks, corrected mistakes and saved words all live in one local database, in sync across every screen.",
  },
];

export default function Devices() {
  const scope = useReveal<HTMLElement>();

  return (
    <section id="devices" ref={scope} className="py-24 sm:py-28">
      <div className="mx-auto grid w-[min(1080px,90vw)] items-center gap-16 lg:grid-cols-2">
        {/* paired device mockups — laptop with the phone overlapping, front-left */}
        <div
          data-reveal
          className="relative order-2 mx-auto w-full max-w-[560px] px-4 pt-6 pb-10 lg:order-1"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-6 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle,#ffdbe4,transparent 72%)" }}
          />
          <img
            src="./kaiwa3.png"
            alt="Kaiwa running as a desktop web app with sidebar, guided lessons and roleplay scenarios"
            className="relative w-full drop-shadow-[0_36px_70px_rgba(150,40,70,0.22)]"
            width={2000}
            height={1414}
          />
          <img
            src="./kaiwa2.png"
            alt="Kaiwa on a phone — the home screen with streak, review count and practice modes"
            className="absolute -bottom-2 left-0 z-10 w-[30%] drop-shadow-[0_30px_55px_rgba(150,40,70,0.32)]"
            width={1080}
            height={1920}
          />
        </div>

        {/* info */}
        <div data-reveal-stagger className="order-1 lg:order-2">
          <div className="mb-1 h-px w-11 bg-rose/70" />
          <div className="text-[0.74rem] font-medium uppercase tracking-[0.32em] text-sub">
            <span className="text-deeprose">画</span>&nbsp; Desk or pocket
          </div>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4.2vw,2.9rem)] font-medium text-sumi">
            One tutor, <span className="text-deeprose">every screen</span>
          </h2>
          <p className="mt-5 max-w-[46ch] text-[1.06rem] text-ink-soft">
            Kaiwa runs right in your browser — a full-width workspace at your desk,
            and a tap-to-install app in your pocket. Same conversations, same
            memory, wherever you practise.
          </p>

          <ul className="mt-9 space-y-6">
            {POINTS.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-rose-soft-2 bg-rose-soft text-deeprose">
                  <p.icon className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className="font-display text-[1.12rem] font-semibold text-sumi">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-[0.96rem] text-ink-soft">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="#how"
            className="mt-9 inline-flex items-center gap-2 font-medium text-deeprose transition-colors hover:text-rose"
          >
            See how it works
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </section>
  );
}
