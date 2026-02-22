import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { RevenueCategory } from '../../lib/data/schema.ts';
import { formatPercent } from '../../lib/format.ts';

interface WaffleChartProps {
  categories: RevenueCategory[];
  isVisible: boolean;
}

const COLORS: Record<string, string> = {
  'income-tax': '#FF6B35',
  'gst': '#3B82F6',
  'corporate-tax': '#8B5CF6',
  'customs': '#F59E0B',
  'excise': '#10B981',
  'non-tax-revenue': '#EC4899',
  'borrowings': '#6B7280',
};

export function WaffleChart({ categories, isVisible }: WaffleChartProps) {
  const GRID = 10; // 10x10 = 100 squares
  const TOTAL = GRID * GRID;

  // Sort by percentage descending, compute square allocations
  const sorted = useMemo(() => {
    const s = [...categories].sort((a, b) => b.percentOfTotal - a.percentOfTotal);
    let remaining = TOTAL;
    return s.map((cat, i) => {
      const squares =
        i === s.length - 1
          ? remaining
          : Math.round((cat.percentOfTotal / 100) * TOTAL);
      remaining -= squares;
      return { ...cat, squares: Math.max(0, squares) };
    });
  }, [categories]);

  // Build grid cells
  const cells = useMemo(() => {
    const arr: { catId: string; color: string; index: number }[] = [];
    let idx = 0;
    for (const cat of sorted) {
      for (let i = 0; i < cat.squares && idx < TOTAL; i++) {
        arr.push({ catId: cat.id, color: COLORS[cat.id] || '#6B7280', index: idx });
        idx++;
      }
    }
    return arr;
  }, [sorted]);

  const cellSize = 100 / GRID;
  const gap = 0.4;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          aria-label="Waffle chart showing revenue breakdown"
        >
          {cells.map((cell) => {
            const row = Math.floor(cell.index / GRID);
            const col = cell.index % GRID;
            return (
              <motion.rect
                key={cell.index}
                x={col * cellSize + gap / 2}
                y={row * cellSize + gap / 2}
                width={cellSize - gap}
                height={cellSize - gap}
                rx={1}
                fill={cell.color}
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  isVisible
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0 }
                }
                transition={{
                  delay: cell.index * 0.008,
                  duration: 0.3,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        {sorted.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2 text-xs">
            <span
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: COLORS[cat.id] || '#6B7280' }}
            />
            <span className="text-[var(--color-text-secondary)] truncate">
              {cat.name}
            </span>
            <span className="font-mono text-[var(--color-text-muted)] ml-auto">
              {formatPercent(cat.percentOfTotal, 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
