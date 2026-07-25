import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Music2 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ivory border-t border-ivory/10">
      <div className="container-editorial pt-24 pb-10">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="inline-flex">
              <img src={"/favicon-32.png"} alt="Eminent Logo" className="w-6 h-6 object-cover rounded-full" loading="lazy" />
              <h3 className="font-display text-5xl md:text-6xl leading-[0.95] text-ivory">
                Eminent<br />
                <span className="italic text-gold">Magazine.</span>
              </h3>
            </div>
            <p className="mt-6 text-sm text-ivory/60 max-w-sm leading-relaxed">
              A multi-category publication covering fashion, lifestyle,
              entertainment, photography, modelling, media and PR.
            </p>
            <div className="flex gap-2 mt-8">
              {[
                { icon: Instagram, href: "https://instagram.com/eminentmagazine", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Youtube, href: "#", label: "YouTube" },
                { icon: Music2, href: "#", label: "TikTok" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener"
                  className="w-11 h-11 grid place-items-center border border-ivory/20 hover:border-gold hover:text-gold rounded-full transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow eyebrow-dot mb-6">Explore</p>
            <ul className="space-y-3 text-sm text-ivory/80">
              {[
                ["/", "Stories"],
                ["/magazine", "Categories"],
                ["/about", "About"],
                ["/services", "Advertise"],
                ["/contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="eyebrow eyebrow-dot mb-6">Contact</p>
            <ul className="space-y-3 text-sm text-ivory/80">
              <li>
                <span className="block text-[10px] uppercase tracking-[0.28em] text-ivory/40 mb-1">
                  Editorial
                </span>
                <a href="mailto:hello@eminentmagazine.com" className="hover:text-gold">
                  hello@eminentmagazine.com
                </a>
              </li>
              <li>
                <span className="block text-[10px] uppercase tracking-[0.28em] text-ivory/40 mb-1">
                  PR & Advertising
                </span>
                <a href="mailto:press@eminentmagazine.com" className="hover:text-gold">
                  press@eminentmagazine.com
                </a>
              </li>
              <li>
                <span className="block text-[10px] uppercase tracking-[0.28em] text-ivory/40 mb-1">
                  Phone
                </span>
                <a href="tel:+2348000000000" className="hover:text-gold">
                  +234 800 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-16 mb-6" />
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between text-[11px] text-ivory/40 uppercase tracking-[0.28em]">
          <p>© {new Date().getFullYear()} Eminent International Media World Limited</p>
          <div className="flex gap-6">
            <Link to="/register" className="hover:text-gold">Contestant Portal</Link>
            <Link to="/admin" className="hover:text-gold">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
