/**
 * Bidirectional Zustand ↔ URLSearchParams sync.
 *
 * URL wins on mount (enables deep linking).
 * Store wins after (avoids infinite loops).
 * Uses replace to avoid polluting browser history.
 */
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface UrlStateBinding {
  /** Read current value from Zustand store */
  get: () => string | null;
  /** Write value to Zustand store */
  set: (value: string) => void;
}

/**
 * Sync URL search params with Zustand store bindings.
 *
 * @example
 * useUrlState({
 *   category: { get: () => selectedCategory, set: setCategory },
 *   indicator: { get: () => selectedIndicatorId, set: setIndicatorId },
 * });
 */
export function useUrlState(bindings: Record<string, UrlStateBinding>): void {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialized = useRef(false);
  const isUpdatingUrl = useRef(false);

  // On mount: URL → Store (URL wins)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    for (const [param, binding] of Object.entries(bindings)) {
      const urlValue = searchParams.get(param);
      if (urlValue && urlValue !== binding.get()) {
        binding.set(urlValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — run once on mount

  // After mount: Store → URL (store wins)
  useEffect(() => {
    if (!initialized.current || isUpdatingUrl.current) return;

    const newParams = new URLSearchParams(searchParams);
    let changed = false;

    for (const [param, binding] of Object.entries(bindings)) {
      const storeValue = binding.get();
      const urlValue = searchParams.get(param);

      if (storeValue && storeValue !== urlValue) {
        newParams.set(param, storeValue);
        changed = true;
      } else if (!storeValue && urlValue) {
        newParams.delete(param);
        changed = true;
      }
    }

    if (changed) {
      isUpdatingUrl.current = true;
      setSearchParams(newParams, { replace: true });
      // Reset flag after React has processed the update
      requestAnimationFrame(() => {
        isUpdatingUrl.current = false;
      });
    }
  });
}
