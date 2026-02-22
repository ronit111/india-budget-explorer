import { useState, useEffect, useRef, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
}

/**
 * Tracks mouse position relative to a container element.
 * Returns smooth coordinates for cursor-following tooltips.
 */
export function useMousePosition<T extends HTMLElement = HTMLDivElement>(): [
  React.RefObject<T | null>,
  MousePosition,
  boolean,
] {
  const ref = useRef<T | null>(null);
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0, clientX: 0, clientY: 0 });
  const [isInside, setIsInside] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      clientX: e.clientX,
      clientY: e.clientY,
    });
  }, []);

  const handleMouseEnter = useCallback(() => setIsInside(true), []);
  const handleMouseLeave = useCallback(() => setIsInside(false), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return [ref, position, isInside];
}
