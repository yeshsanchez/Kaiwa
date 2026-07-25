const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#ai", label: "Your AI" },
  { href: "#download", label: "Download" },
  { href: "https://github.com/yeshsanchez/Kaiwa", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="bg-sumi py-10 pb-11 text-[0.87rem] text-white/60">
      <div className="mx-auto flex w-[min(1080px,90vw)] flex-wrap items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3 text-white">
          <img src="./icon.svg" alt="" className="h-6 w-6 rounded-md" />
          <span className="font-display text-[1.02rem] font-semibold">
            Kaiwa <span className="jp font-normal text-coral">会話</span>
          </span>
        </a>
        <div className="flex gap-6">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="transition-colors hover:text-white">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
