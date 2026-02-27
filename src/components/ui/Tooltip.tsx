import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: ReactNode;
  visible: boolean;
  x: number;
  y: number;
}

/**
 * Cursor-following tooltip shared by all visualizations.
 * Renders at fixed viewport position with backdrop blur.
 * Usage: position it using useMousePosition coordinates.
 */
export function Tooltip({ content, visible, x, y }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 12, y: -12 });

  useEffect(() => {
    if (!tooltipRef.current || !visible) return;
    const rect = tooltipRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    setOffset({
      x: x + rect.width + 24 > vw ? -rect.width - 12 : 12,
      y: y - rect.height - 12 < 0 ? 12 : -rect.height - 12,
    });
  }, [x, y, visible]);

  return (
    <AnimatePresence>
      {visible && content && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.12, ease: [0.25, 1, 0.5, 1] }}
          className="pointer-events-none fixed z-50"
          style={{
            left: x + offset.x,
            top: y + offset.y,
          }}
        >
          <div
            className="rounded-lg px-3 py-2 shadow-2xl"
            style={{
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: 'var(--border-subtle)',
              maxWidth: 280,
            }}
          >
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Tooltip content helpers for consistent formatting across visualizations.
 */
export function TooltipTitle({ children }: { children: ReactNode }) {
  return <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{children}</p>;
}

export function TooltipRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 mt-0.5">
      <span className="text-caption">{label}</span>
      <span className="font-mono text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  );
}

export function TooltipHint({ children }: { children: ReactNode }) {
  return <p className="text-caption mt-1 italic">{children}</p>;
}

/**
 * Hook for managing tooltip state in visualizations.
 */
export function useTooltip<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const scrollingRef = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback((item: T, e: React.MouseEvent) => {
    if (scrollingRef.current) return;
    setData(item);
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const move = useCallback((e: React.MouseEvent) => {
    if (scrollingRef.current) return;
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const hide = useCallback(() => {
    setData(null);
  }, []);

  // Auto-hide on scroll and prevent re-show while scrolling.
  // SVG hover rects fire onMouseEnter as they pass under the cursor
  // during scroll, so we debounce to avoid tooltip flicker.
  useEffect(() => {
    const dismiss = () => {
      setData(null);
      scrollingRef.current = true;
      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        scrollingRef.current = false;
      }, 150);
    };
    window.addEventListener('scroll', dismiss, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', dismiss, { capture: true });
      clearTimeout(scrollTimer.current);
    };
  }, []);

  return {
    data,
    position,
    visible: data !== null,
    show,
    move,
    hide,
  };
}
