import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/", label: "Stories" },
  { to: "/vote", label: "Vote" },
  { to: "/register", label: "Register" },
  { to: "/magazine", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Advertise" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled && !open
            ? "bg-background/85 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container-editorial flex h-20 items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
            <span className="font-display text-2xl md:text-3xl text-ivory">Eminent</span>
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-semibold">
              Magazine
            </span>
          </Link>

          <button
            className="inline-flex items-center gap-3 text-ivory group"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="hidden sm:inline text-[11px] uppercase tracking-[0.32em] font-semibold group-hover:text-gold transition-colors">
              {open ? "Close" : "Menu"}
            </span>
            <span className="w-10 h-10 grid place-items-center border border-ivory/25 rounded-full group-hover:border-gold transition-colors">
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-40 bg-ink transition-all duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container-editorial h-full flex flex-col justify-center">
          <p className="eyebrow eyebrow-dot mb-10">Navigate</p>
          <nav className="flex flex-col gap-4 md:gap-6">
            {NAV.map((item, i) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-6 text-ivory hover:text-gold transition-colors"
                style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
              >
                <span className="text-[10px] text-gold/60 tabular-nums tracking-widest">
                  0{i + 1}
                </span>
                <span className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-16 flex flex-wrap items-center gap-8 text-xs text-ivory/60 uppercase tracking-[0.28em]">
            <a href="mailto:hello@eminentmagazine.com" className="hover:text-gold">hello@eminentmagazine.com</a>
            <a href="mailto:press@eminentmagazine.com" className="hover:text-gold">press@eminentmagazine.com</a>
          </div>
        </div>
      </div>
    </>
  );
}
