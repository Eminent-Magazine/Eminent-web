import { useEffect } from "react";

/**
 * Adds `.is-visible` to any element carrying `data-reveal` when it enters the
 * viewport. Idempotent: safe to mount multiple times.
 */
export function useReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
