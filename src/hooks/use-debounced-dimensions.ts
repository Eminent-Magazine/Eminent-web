// src/components/hooks/use-debounced-dimensions.ts
import { useState, useEffect, useCallback, RefObject } from "react";

interface Dimensions {
  width: number;
  height: number;
}

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function useDimensions(
  ref: RefObject<HTMLElement | null>,
  debounceMs: number = 100
): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  const updateDimensions = useCallback(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, [ref]);

  useEffect(() => {
    const debouncedUpdate = debounce(updateDimensions, debounceMs);

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      debouncedUpdate();
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    window.addEventListener("resize", debouncedUpdate);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedUpdate);
    };
  }, [ref, updateDimensions, debounceMs]);

  return dimensions;
}