import type { ReactNode } from "react";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { useReveal } from "@/hooks/use-reveal";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

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
  canGoBack,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  canGoBack?: boolean;
}) {
  const router = useRouter();
  return (
    <section className="border-b border-border">
      <div className="container-editorial pt-30 pb-20 md:pt-40 md:pb-28">
        <div className="flex flex-col gap-6">
          {canGoBack && (
            <button
              onClick={() => router.history.back()}
              className="cursor-pointer inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          {eyebrow && <p className="eyebrow eyebrow-dot mb-6">{eyebrow}</p>}
        </div>
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
