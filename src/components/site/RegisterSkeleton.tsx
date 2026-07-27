/**
 * register-skeleton.tsx
 * ------------------------------------------------------------------
 * Page-specific skeletons for /register, built to mirror the exact
 * structure of RegisterPage / PayFirstForm / ProfileForm.
 *
 * Depends on the base primitives from skeleton.tsx
 * (Skeleton, cn). Adjust the import path to match your project.
 * ------------------------------------------------------------------
 */

import { Skeleton } from "@/components/site/Skeleton";
import { SiteLayout } from "@/components/site/SiteLayout";

// --- Header ------------------------------------------------------------
// Mirrors <PageHeader eyebrow title subtitle />

function PageHeaderSkeleton() {
  return (
    <div className="container-editorial pt-20 pb-10">
      <Skeleton height="0.7rem" width="7rem" className="mb-4" />
      <Skeleton height="2.75rem" width="65%" className="mb-4" />
      <Skeleton height="1rem" width="45%" />
    </div>
  );
}

// --- Pay-first form skeleton ------------------------------------------
// Mirrors PayFirstForm: name, email, phone, fee row, button, footnote

function PayFirstFormSkeleton() {
  return (
    <div className="bg-card border border-border p-8 space-y-4">
      <Skeleton height="0.7rem" width="9rem" />
      <Skeleton height="3rem" width="100%" className="rounded-sm" />
      <Skeleton height="3rem" width="100%" className="rounded-sm" />
      <Skeleton height="3rem" width="100%" className="rounded-sm" />
      <div className="flex items-center justify-between border-t border-border pt-4">
        <Skeleton height="0.85rem" width="7rem" />
        <Skeleton height="1.75rem" width="6rem" />
      </div>
      <Skeleton height="3rem" width="100%" className="rounded-sm" />
      <Skeleton height="0.7rem" width="80%" className="mx-auto" />
    </div>
  );
}

// --- Profile form skeleton ----------------------------------------------
// Mirrors ProfileForm: eyebrow, 2x2 input grid, category, bio textarea,
// 2-col social grid, submit button

function ProfileFormSkeleton() {
  return (
    <div className="bg-card border border-border p-3 sm:p-4 md:p-8 space-y-4 mt-10">
      <Skeleton height="0.7rem" width="9rem" />

      <div className="grid grid-cols-2 gap-1 md:gap-3">
        <Skeleton height="3rem" width="100%" className="rounded-sm" />
        <Skeleton height="3rem" width="100%" className="rounded-sm" />
        <Skeleton height="3rem" width="100%" className="rounded-sm" />
        <Skeleton height="3rem" width="100%" className="rounded-sm" />
      </div>

      <Skeleton height="3rem" width="100%" className="rounded-sm" />

      <Skeleton height="7.5rem" width="100%" className="rounded-sm" />

      <div className="grid grid-cols-2 gap-1 md:gap-3">
        <Skeleton height="3rem" width="100%" className="rounded-sm" />
        <Skeleton height="3rem" width="100%" className="rounded-sm" />
      </div>

      <Skeleton height="3rem" width="100%" className="rounded-sm" />
    </div>
  );
}

// --- Full page skeleton --------------------------------------------------
// Used while settingsQ is loading (i.e. before we know whether to render
// PayFirstForm or ProfileForm). Defaults to the profile-form shape since
// it's the taller/more common layout — swap `variant` if you'd rather
// default to the pay-first shape for your flow.

export function RegisterPageSkeleton({
  variant = "profile",
}: {
  variant?: "profile" | "payFirst";
}) {
  return (
    <SiteLayout>
      <PageHeaderSkeleton />
      <div className="container-editorial pb-24 max-w-2xl">
        {variant === "payFirst" ? <PayFirstFormSkeleton /> : <ProfileFormSkeleton />}
      </div>
    </SiteLayout>
  );
}

export { PageHeaderSkeleton, PayFirstFormSkeleton, ProfileFormSkeleton };

/* ------------------------------------------------------------------
 * Wiring into register.tsx
 * ------------------------------------------------------------------
 *
 * 1) Swap the inline spinner for the matching-shape skeleton:
 *
 *   if (settingsQ.isLoading) {
 *     return <RegisterPageSkeleton />;
 *   }
 *
 * 2) Or, since this is TanStack Router, let the route handle it
 *    directly via pendingComponent (fires on route transition,
 *    before the component even mounts):
 *
 *   export const Route = createFileRoute("/register")({
 *     pendingComponent: () => <RegisterPageSkeleton />,
 *     pendingMs: 150,
 *     pendingMinMs: 250,
 *     head: () => ({ ... }),
 *     component: RegisterPage,
 *   });
 *
 *   Note: pendingComponent covers the route/loader transition, while
 *   the settingsQ.isLoading check covers the in-component query fetch.
 *   Since this route has no loader (data comes from useQuery inside
 *   the component), option (1) is the one that actually fires here —
 *   keep pendingComponent only if you later add a route `loader`.
 * ------------------------------------------------------------------
 */