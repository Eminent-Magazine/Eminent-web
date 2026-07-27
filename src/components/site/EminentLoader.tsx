import { useEffect, useState } from 'react';
import styles from '@/components/site/EminentLoader.module.css';
//EminentLoader.module.css';

const WORD = 'EMINENT';

export interface EminentLoaderProps {
  /**
   * "overlay" — fixed, full-viewport, covers the app (use for app boot / route transitions).
   * "inline"  — sits in normal flow (use inside a container, e.g. TanStack Router's pendingComponent).
   * @default 'overlay'
   */
  variant?: 'overlay' | 'inline';
  /** Small line under the wordmark. Set to null to hide it. */
  tagline?: string | null;
  /** Footer credential line. Set to null to hide it. */
  caption?: string | null;
  /**
   * When true, the loader fades out and unmounts itself after `fadeOutDelayMs`.
   * Useful for a one-shot boot screen; leave false for route-pending loaders
   * that TanStack Router mounts/unmounts for you.
   */
  autoFadeOut?: boolean;
  fadeOutDelayMs?: number;
  /** Called after the fade-out transition finishes (only relevant with autoFadeOut). */
  onFadeOutComplete?: () => void;
  className?: string;
}

export function EminentLoader({
  variant = 'overlay',
  tagline = 'Magazine',
  caption = 'Est. 2011 · Anambra, Nigeria',
  autoFadeOut = false,
  fadeOutDelayMs = 600,
  onFadeOutComplete,
  className,
}: EminentLoaderProps) {
  const [fadingOut, setFadingOut] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!autoFadeOut) return;

    const fadeTimer = setTimeout(() => setFadingOut(true), fadeOutDelayMs);
    return () => clearTimeout(fadeTimer);
  }, [autoFadeOut, fadeOutDelayMs]);

  useEffect(() => {
    if (!fadingOut) return;

    // Matches the CSS transition duration on .overlay
    const unmountTimer = setTimeout(() => {
      setMounted(false);
      onFadeOutComplete?.();
    }, 500);
    return () => clearTimeout(unmountTimer);
  }, [fadingOut, onFadeOutComplete]);

  if (!mounted) return null;

  const wrapperClass =
    variant === 'overlay'
      ? [styles.overlay, fadingOut && styles.fadeOut, className].filter(Boolean).join(' ')
      : [styles.inline, className].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass} role="status" aria-live="polite" aria-label="Loading Eminent Magazine">
      <div className={styles.loader}>
        <div className={styles.wordmark} aria-hidden="true">
          {WORD.split('').map((letter, i) => (
            <span key={`${letter}-${i}`}>{letter}</span>
          ))}
        </div>
        <span className="sr-only" style={visuallyHidden}>
          Loading
        </span>
        {tagline && <div className={styles.tagline}>{tagline}</div>}
        <div className={styles.rule} />
        {caption && <div className={styles.est}>{caption}</div>}
      </div>
    </div>
  );
}

const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export default EminentLoader;