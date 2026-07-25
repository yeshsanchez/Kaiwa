import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Download,
  Flame,
  BookOpenText,
  Phone,
  GraduationCap,
  Check,
  WifiOff,
  Sparkles,
} from "lucide-react";
import { ShaderBackground } from "@/components/ui/shaders-hero-section";

/* A frosted bento chip. The outer wrapper floats (CSS); the inner card is what
   the GSAP intro pops in — kept on separate elements so the two transforms
   never fight. */
function Chip({
  className,
  floatDelay = 0,
  rotate = 0,
  children,
}: {
  className?: string;
  floatDelay?: number;
  rotate?: number;
  children: ReactNode;
}) {
  return (
    <div
      className={`animate-float pointer-events-none absolute ${className ?? ""}`}
      style={{ animationDelay: `${floatDelay}s`, rotate: `${rotate}deg` }}
    >
      <div className="hero-chip flex items-center gap-3 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-[0_20px_44px_-24px_rgba(190,55,90,0.5)] backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}

function ChipIcon({ children }: { children: ReactNode }) {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-soft text-deeprose">
      {children}
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-rise", {
        y: 30,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.12,
      })
        .from(
          ".hero-phone",
          { y: 40, scale: 0.94, autoAlpha: 0, duration: 1.1, ease: "expo.out" },
          "-=0.4",
        )
        .from(
          ".hero-badge",
          { scale: 0.4, y: 20, autoAlpha: 0, duration: 0.7, ease: "back.out(1.8)" },
          "-=0.55",
        )
        .from(
          ".hero-chip",
          { scale: 0.6, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)" },
          "-=0.6",
        );
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root}>
      <ShaderBackground className="min-h-screen">
        <div className="mx-auto flex w-[min(1080px,90vw)] flex-col items-center pt-28 pb-32 text-center sm:pt-32">
          {/* headline */}
          <h1 className="hero-rise max-w-[16ch] font-display text-[clamp(2.2rem,5.9vw,4.3rem)] font-bold leading-[1.02] tracking-tight text-sumi">
            Your Private
            <br />
            <span className="text-deeprose">Japanese</span> Tutor
          </h1>

          {/* subhead — kept short so the phone gets the spotlight */}
          <p className="hero-rise mt-4 max-w-[38ch] text-[clamp(0.95rem,1.6vw,1.08rem)] font-normal text-ink-soft">
            Chat, call and roleplay in Japanese — private, offline, and entirely
            yours.
          </p>

          {/* CTA */}
          <div className="hero-rise mt-6">
            <a
              href="#download"
              className="inline-flex items-center gap-2.5 rounded-full bg-sumi px-8 py-4 text-[1.02rem] font-medium text-white shadow-[0_18px_40px_-18px_rgba(58,40,48,0.9)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <Download className="h-5 w-5" strokeWidth={2.2} />
              Download free
            </a>
          </div>

          {/* honest trust line in place of app-store ratings */}
          <div className="hero-rise mt-4 flex items-center gap-2 text-[0.83rem] text-sub">
            <Sparkles className="h-4 w-4 text-rose" strokeWidth={2} />
            <span>Free &amp; open source · AGPL-3.0 · 100% local</span>
          </div>

          {/* ---- phone + threaded lines + scattered chips ---- */}
          <div className="relative mx-auto mt-3 w-full max-w-5xl">
            {/* glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
              style={{ background: "radial-gradient(circle,#ffd0dc,transparent 70%)" }}
            />

            {/* threading lines — flow behind the phone and trace the horizontal
               path the chips are scattered along. Purely decorative. */}
            <svg
              aria-hidden="true"
              className="hero-threads pointer-events-none absolute inset-0 z-0 hidden h-full w-full overflow-visible lg:block"
              viewBox="0 0 1200 720"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="thread" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#e85d75" stopOpacity="0" />
                  <stop offset="0.18" stopColor="#e85d75" stopOpacity="0.34" />
                  <stop offset="0.5" stopColor="#ee6c85" stopOpacity="0.12" />
                  <stop offset="0.82" stopColor="#e85d75" stopOpacity="0.34" />
                  <stop offset="1" stopColor="#e85d75" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g stroke="url(#thread)" fill="none" strokeLinecap="round">
                <path d="M-40 96 C 260 44 470 132 600 168 S 1010 214 1240 118" strokeWidth="1.4" />
                <path d="M-40 186 C 210 128 430 204 600 240 S 1004 300 1240 214" strokeWidth="2" />
                <path d="M-40 312 C 224 268 434 332 600 360 S 1012 402 1240 344" strokeWidth="1.3" />
                <path d="M-40 432 C 214 402 442 460 600 482 S 1002 520 1240 470" strokeWidth="1.8" />
                <path d="M-40 560 C 232 540 452 590 600 602 S 1002 640 1240 606" strokeWidth="1.3" />
                <path d="M-40 660 C 244 650 462 688 600 700 S 1000 720 1240 690" strokeWidth="1.6" />
              </g>
            </svg>

            {/* the hero device */}
            <div className="hero-phone relative z-10 mx-auto w-[clamp(260px,66vw,382px)]">
              <img
                src="./kaiwa1.png"
                alt="Kaiwa — a free-chat conversation in Japanese with furigana and instant translation"
                className="w-full drop-shadow-[0_40px_80px_rgba(150,40,70,0.28)]"
                width={1080}
                height={1920}
              />

              {/* Kaiwa app icon — a companion badge overlapping the phone's
                 lower-right, where the reference mock places a smartwatch */}
              <img
                src="./icon.svg"
                alt="Kaiwa app icon"
                className="hero-badge absolute -bottom-3 -right-[13%] z-20 w-[43%] rotate-6 rounded-[22%] shadow-[0_30px_60px_-18px_rgba(180,45,80,0.55)] ring-1 ring-white/70"
              />
            </div>

            {/* chips — shown on wide screens where there's room around the phone */}
            <Chip className="left-[1%] top-[15%] hidden lg:block" floatDelay={0} rotate={-8}>
              <ChipIcon>
                <Flame className="h-4.5 w-4.5" strokeWidth={2} />
              </ChipIcon>
              <div className="text-left">
                <div className="text-[0.72rem] uppercase tracking-wide text-sub">
                  Day streak
                </div>
                <div className="font-display text-[1.05rem] font-medium text-sumi">
                  1 day 🔥
                </div>
              </div>
            </Chip>

            <Chip className="left-0 top-[45%] hidden lg:block" floatDelay={1.1} rotate={-3}>
              <ChipIcon>
                <BookOpenText className="h-4.5 w-4.5" strokeWidth={2} />
              </ChipIcon>
              <div className="text-left">
                <div className="text-[0.72rem] uppercase tracking-wide text-sub">
                  To review
                </div>
                <div className="font-display text-[1.05rem] font-medium text-sumi">
                  6 words
                </div>
              </div>
            </Chip>

            <Chip className="bottom-[16%] left-[8%] hidden lg:block" floatDelay={0.6} rotate={6}>
              <div className="text-left">
                <div className="mb-0.5 text-[0.68rem] uppercase tracking-wide text-sub">
                  Furigana
                </div>
                <div className="jp text-[1.15rem] leading-none text-sumi">
                  <ruby>
                    食<rt className="text-[0.55em] text-deeprose">た</rt>
                  </ruby>
                  べる
                </div>
              </div>
            </Chip>

            <Chip className="right-[1%] top-[11%] hidden lg:block" floatDelay={0.35} rotate={8}>
              <ChipIcon>
                <Phone className="h-4.5 w-4.5" strokeWidth={2} />
              </ChipIcon>
              <div className="text-left">
                <div className="font-display text-[1.02rem] font-medium text-sumi">
                  Voice Call
                </div>
                <div className="text-[0.74rem] text-sub">just talk, no typing</div>
              </div>
            </Chip>

            <Chip className="right-0 top-[46%] hidden lg:block" floatDelay={1.4} rotate={4}>
              <ChipIcon>
                <GraduationCap className="h-4.5 w-4.5" strokeWidth={2} />
              </ChipIcon>
              <div className="text-left">
                <div className="text-[0.72rem] uppercase tracking-wide text-sub">
                  JLPT level
                </div>
                <div className="font-display text-[1.05rem] font-medium text-sumi">
                  N5 → N1
                </div>
              </div>
            </Chip>

            <Chip className="bottom-[18%] right-[4%] hidden max-w-[15rem] lg:block" floatDelay={0.85} rotate={-6}>
              <ChipIcon>
                <Check className="h-4.5 w-4.5" strokeWidth={2.4} />
              </ChipIcon>
              <div className="text-left leading-snug">
                <div className="text-[0.72rem] uppercase tracking-wide text-sub">
                  Gentle correction
                </div>
                <div className="jp text-[0.95rem] text-sumi">
                  <b className="text-deeprose">走った</b>{" "}
                  <span className="text-sub line-through">走たです</span>
                </div>
              </div>
            </Chip>

            <Chip className="left-[25%] top-[1%] hidden xl:block" floatDelay={1.7} rotate={-5}>
              <ChipIcon>
                <WifiOff className="h-4.5 w-4.5" strokeWidth={2} />
              </ChipIcon>
              <div className="font-display text-[0.98rem] font-medium text-sumi">
                100% offline
              </div>
            </Chip>
          </div>
        </div>
      </ShaderBackground>
    </section>
  );
}
