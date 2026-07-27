/**
 * skeleton.tsx
 * ------------------------------------------------------------------
 * Multipurpose shimmer skeleton system for React + TypeScript.
 * Framework-agnostic (works with TanStack Router's pendingComponent,
 * React Suspense fallback, or plain conditional rendering).
 *
 * Setup:
 * 1. Drop this file in e.g. src/components/ui/skeleton.tsx
 * 2. Add the CSS block at the bottom of this file to your global
 *    stylesheet (e.g. src/styles.css or app.css) — Tailwind's
 *    @layer utilities is the recommended place.
 * 3. If you don't already have a `cn` helper (clsx + tailwind-merge),
 *    the fallback below will work fine on its own.
 * ------------------------------------------------------------------
 */

import { cn } from "@/lib/utils";
import * as React from "react";

// --- cn helper -------------------------------------------------------
// Uses your project's existing cn (lib/utils) if present; otherwise
// falls back to a tiny local join. Replace this import with:
//   import { cn } from "@/lib/utils";
// if you already have shadcn's utils set up.
// function cn(...classes: Array<string | false | null | undefined>) {
//   return classes.filter(Boolean).join(" ");
// }

// --- Core primitive ----------------------------------------------------

type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";
type SkeletonAnimation = "shimmer" | "pulse" | "none";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  /** CSS width, e.g. "100%", "12rem", 240 */
  width?: string | number;
  /** CSS height, e.g. "1rem", "3rem", 48 */
  height?: string | number;
}

const variantClass: Record<SkeletonVariant, string> = {
  text: "rounded-md",
  circular: "rounded-full",
  rectangular: "rounded-none",
  rounded: "rounded-xl",
};

const animationClass: Record<SkeletonAnimation, string> = {
  shimmer: "skeleton-shimmer",
  pulse: "animate-pulse",
  none: "",
};

/**
 * Base building block. Every other skeleton in this file composes
 * this primitive — reach for it directly when you need a one-off
 * shape that isn't covered by the presets below.
 */
export function Skeleton({
  variant = "text",
  animation = "shimmer",
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "bg-muted relative overflow-hidden",
        variantClass[variant],
        animationClass[animation],
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}

// --- Composed presets ----------------------------------------------------

/** A block of skeleton text lines, with the last line shorter. */
export function SkeletonText({
  lines = 3,
  className,
  lineHeight = "0.875rem",
  lastLineWidth = "60%",
}: {
  lines?: number;
  className?: string;
  lineHeight?: string | number;
  lastLineWidth?: string | number;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
}

/** Circular avatar placeholder. */
export function SkeletonAvatar({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
}

/** Avatar + name/subtitle row — chat lists, comment threads, tables. */
export function SkeletonAvatarText({
  avatarSize = 40,
  className,
}: {
  avatarSize?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <SkeletonAvatar size={avatarSize} />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton height="0.875rem" width="40%" />
        <Skeleton height="0.75rem" width="65%" />
      </div>
    </div>
  );
}

/** Generic content card: image + title + body text. Good default for
 *  property/listing cards (e.g. Motiva Estate property tiles). */
export function SkeletonCard({
  className,
  imageHeight = 180,
}: {
  className?: string;
  imageHeight?: number | string;
}) {
  return (
    <div className={cn("rounded-xl border border-border p-3", className)}>
      <Skeleton variant="rounded" height={imageHeight} className="w-full" />
      <div className="mt-3 flex flex-col gap-2">
        <Skeleton height="1rem" width="70%" />
        <Skeleton height="0.8rem" width="45%" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton height="1.5rem" width="30%" variant="rounded" />
          <Skeleton height="1.5rem" width="20%" variant="rounded" />
        </div>
      </div>
    </div>
  );
}

/** Grid of SkeletonCards — property listing grids, product grids, etc. */
export function SkeletonCardGrid({
  count = 6,
  className,
  cardClassName,
}: {
  count?: number;
  className?: string;
  cardClassName?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} className={cardClassName} />
      ))}
    </div>
  );
}

/** A single row for list/feed layouts (avatar + text + trailing action). */
export function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 py-3 border-b border-border last:border-none",
        className
      )}
    >
      <SkeletonAvatarText />
      <Skeleton height="2rem" width="4.5rem" variant="rounded" />
    </div>
  );
}

/** Vertical list of SkeletonListItems. */
export function SkeletonList({
  items = 5,
  className,
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonListItem key={i} />
      ))}
    </div>
  );
}

/** Table skeleton — rows x columns of bars, with a header row. */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <div
        className="grid gap-4 pb-3 mb-2 border-b border-border"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height="0.75rem" width="50%" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="grid gap-4 py-3"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
        >
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} height="0.875rem" width={c === 0 ? "80%" : "60%"} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Full-page fallback: header bar + a couple of content blocks.
 *  Handy as a route-level `pendingComponent`. */
export function SkeletonPage({ className }: { className?: string }) {
  return (
    <div className={cn("w-full max-w-5xl mx-auto p-6 flex flex-col gap-6", className)}>
      <div className="flex items-center justify-between">
        <Skeleton height="1.5rem" width="12rem" />
        <Skeleton height="2rem" width="6rem" variant="rounded" />
      </div>
      <SkeletonCardGrid count={3} />
      <SkeletonTable rows={4} columns={3} />
    </div>
  );
}

/* ------------------------------------------------------------------
 * CSS — add this to your global stylesheet (e.g. src/styles.css).
 * Uses Tailwind's @layer so it merges correctly with utility classes.
 * Respects prefers-reduced-motion.
 * ------------------------------------------------------------------

@layer utilities {
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      hsl(var(--muted, 240 5% 88%)) 25%,
      hsl(var(--muted-foreground, 240 5% 78%) / 0.35) 37%,
      hsl(var(--muted, 240 5% 88%)) 63%
    );
    background-size: 400% 100%;
    animation: skeleton-shimmer 1.4s ease-in-out infinite;
  }

  @keyframes skeleton-shimmer {
    0% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton-shimmer {
      animation: none;
    }
  }
}

* ------------------------------------------------------------------
 * Usage with TanStack Router (as a route-level pending fallback)
 * ------------------------------------------------------------------

// src/routes/properties.tsx
import { createFileRoute } from "@tanstack/react-router";
import { SkeletonPage, SkeletonCardGrid } from "@/components/ui/skeleton";

export const Route = createFileRoute("/properties")({
  pendingComponent: () => <SkeletonCardGrid count={6} className="p-6" />,
  pendingMs: 200,        // only show skeleton if load takes > 200ms
  pendingMinMs: 300,     // once shown, keep it visible at least 300ms
  component: PropertiesPage,
});

// Or globally, in your router instance:
// const router = createRouter({
//   routeTree,
//   defaultPendingComponent: () => <SkeletonPage />,
//   defaultPendingMs: 200,
// });

// ------------------------------------------------------------------
// Usage with React Suspense
// ------------------------------------------------------------------
// <Suspense fallback={<SkeletonList items={6} />}>
//   <ClientList />
// </Suspense>

// ------------------------------------------------------------------
// Usage for a one-off custom shape
// ------------------------------------------------------------------
// <Skeleton variant="rounded" width="100%" height={240} />
// ------------------------------------------------------------------
*/