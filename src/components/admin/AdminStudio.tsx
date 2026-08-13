import { ExternalLink } from "lucide-react";

export const STUDIO_URL = "https://eminent-magazine.sanity.studio/";

export function AdminStudio() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-4 border-b border-ink/10">
        <div>
          <p className="font-display text-xl sm:text-2xl">Content Studio</p>
          <p className="text-xs text-muted-foreground">
            Write stories, categories and homepage events.
          </p>
        </div>
        <a
          href={STUDIO_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 h-10 px-4 text-xs tracking-[0.2em] uppercase border border-ink/20 hover:border-gold hover:text-gold transition-colors"
        >
          Open <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      <iframe
        src={STUDIO_URL}
        title="Eminent Content Studio"
        className="flex-1 w-full border-0"
      />
    </div>
  );
}


// import { ClientOnly } from "@tanstack/react-router";
// import { lazy, Suspense } from "react";

// const StudioRoot = lazy(() => import("@/components/admin/StudioRoot"));

// function Loading() {
//   return (
//     <div className="p-10 text-sm text-muted-foreground">Loading studio…</div>
//   );
// }

// export function AdminStudio() {
//   return (
//     <ClientOnly fallback={<Loading />}>
//       <Suspense fallback={<Loading />}>
//         <StudioRoot />
//       </Suspense>
//     </ClientOnly>
//   );
// }
