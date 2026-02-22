import { useRef, useMemo } from 'react';
import { useScroll, useTransform, type MotionValue } from 'framer-motion';

interface SplitTextRevealOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offset?: any;
  staggerMs?: number;
}

/**
 * Kasia Siwosz-style split text reveal: each word fades in as the user scrolls.
 * Returns an array of { word, opacity, y } objects for rendering.
 */
export function useSplitTextReveal(
  text: string,
  options: SplitTextRevealOptions = {}
) {
  const { offset } = options;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: offset ?? ["start end", "end start"],
  });

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const wordAnimations = useMemo(() => {
    return words.map((word, i) => {
      const start = i / (words.length + 2);
      const end = (i + 3) / (words.length + 2);
      return { word, start: Math.min(start, 0.9), end: Math.min(end, 1) };
    });
  }, [words]);

  return {
    containerRef,
    scrollYProgress,
    words: wordAnimations,
  };
}

/**
 * Hook to create individual word opacity from scroll progress.
 * Use inside a motion component for each word.
 */
export function useWordOpacity(
  scrollYProgress: MotionValue<number>,
  start: number,
  end: number
): { opacity: MotionValue<number>; y: MotionValue<number> } {
  const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
  const y = useTransform(scrollYProgress, [start, end], [8, 0]);
  return { opacity, y };
}
