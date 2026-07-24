import type { ReactNode } from "react";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { useReveal } from "@/hooks/use-reveal";

export function SiteLayout({ children }: { children: ReactNode }) {
  useReveal();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-border">
      <div className="container-editorial pt-40 pb-20 md:pt-52 md:pb-28">
        {eyebrow && <p className="eyebrow eyebrow-dot mb-6">{eyebrow}</p>}
        <h1 className="font-display text-6xl md:text-8xl leading-[0.95] text-foreground max-w-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-8 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
