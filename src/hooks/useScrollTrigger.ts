import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollTriggerOptions {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
}

/**
 * Multi-threshold intersection observer for scroll-triggered animations.
 * Returns [ref, isVisible, progress] where progress is 0-1 for multi-threshold.
 */
export function useScrollTrigger<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollTriggerOptions = {}
): [React.RefObject<T | null>, boolean, number] {
  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px', once = true } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const hasTriggered = useRef(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) return;

      if (once) {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          setIsVisible(true);
          setProgress(1);
        }
      } else {
        setIsVisible(entry.isIntersecting);
        setProgress(entry.intersectionRatio);
      }
    },
    [once]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, handleIntersect]);

  return [ref, isVisible, progress];
}
