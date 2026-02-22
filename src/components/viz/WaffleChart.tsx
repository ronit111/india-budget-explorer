import { useMemo, useState, useCallback } from 'react';
import type { RevenueCategory } from '../../lib/data/schema.ts';
import { formatPercent, formatRsCrore } from '../../lib/format.ts';
import { Tooltip, TooltipTitle, TooltipRow, useTooltip } from '../ui/Tooltip.tsx';

interface WaffleChartProps {
  categories: RevenueCategory[];
  isVisible: boolean;
  highlightCategory?: string | null;
}

/**
 * IIB-inspired 3-color grouping: saffron (direct tax), gold (indirect tax),
 * cyan (borrowings), muted (non-tax).
 */
const CATEGORY_TO_COLOR: Record<string, string> = {
  'income-tax': 'var(--saffron)',
  'corporate-tax': 'var(--saffron)',
  'gst': 'var(--gold)',
  'customs': 'var(--gold)',
  'excise': 'var(--gold)',
  'borrowings': 'var(--cyan)',
  'non-tax-revenue': 'var(--text-muted)',
};

const CATEGORY_GROUP: Record<string, string> = {
  'income-tax': 'direct-tax',
  'corporate-tax': 'direct-tax',
  'gst': 'indirect-tax',
  'customs': 'indirect-tax',
  'excise': 'indirect-tax',
  'borrowings': 'borrowings',
  'non-tax-revenue': 'non-tax',
};

export function WaffleChart({ categories, isVisible, highlightCategory }: WaffleChartProps) {
  const GRID = 10;
  const TOTAL = GRID * GRID;
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const tooltip = useTooltip<RevenueCategory>();

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

  const cells = useMemo(() => {
    const arr: { catId: string; color: string; index: number; category: (typeof sorted)[0] }[] = [];
    let idx = 0;
    for (const cat of sorted) {
      for (let i = 0; i < cat.squares && idx < TOTAL; i++) {
        arr.push({
          catId: cat.id,
          color: CATEGORY_TO_COLOR[cat.id] || 'var(--text-muted)',
          index: idx,
          category: cat,
        });
        idx++;
      }
    }
    return arr;
  }, [sorted]);

  const activeCat = highlightCategory || hoveredCat;

  const handleMouseEnter = useCallback((catId: string, cat: RevenueCategory, e: React.MouseEvent) => {
    setHoveredCat(catId);
    tooltip.show(cat, e);
  }, [tooltip]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    tooltip.move(e);
  }, [tooltip]);

  const handleMouseLeave = useCallback(() => {
    setHoveredCat(null);
    tooltip.hide();
  }, [tooltip]);

  const cellSize = 100 / GRID;
  const gap = 0.5;

  return (
    <div className="w-full">
      <div className="relative w-full max-w-lg mx-auto" style={{ paddingBottom: '100%' }}>
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          aria-label="Waffle chart showing revenue breakdown"
        >
          {cells.map((cell) => {
            const row = Math.floor(cell.index / GRID);
            const col = cell.index % GRID;
            const isDimmed = activeCat && cell.catId !== activeCat;
            const isHighlighted = activeCat && cell.catId === activeCat;

            return (
              <rect
                key={cell.index}
                className={`waffle-cell ${isVisible ? 'waffle-cell-enter' : ''}`}
                x={col * cellSize + gap / 2}
                y={row * cellSize + gap / 2}
                width={cellSize - gap}
                height={cellSize - gap}
                rx={1.2}
                fill={cell.color}
                opacity={isVisible ? (isDimmed ? 0.15 : isHighlighted ? 1 : 0.85) : 0}
                style={{
                  animationDelay: isVisible ? `${cell.index * 8}ms` : '0ms',
                  transition: 'opacity 150ms ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => handleMouseEnter(cell.catId, cell.category, e)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </svg>
      </div>

      <Tooltip
        content={
          tooltip.data && (
            <>
              <TooltipTitle>{tooltip.data.name}</TooltipTitle>
              <TooltipRow label="Share" value={formatPercent(tooltip.data.percentOfTotal, 1)} />
              <TooltipRow label="Amount" value={formatRsCrore(tooltip.data.amount)} />
            </>
          )
        }
        visible={tooltip.visible}
        x={tooltip.position.x}
        y={tooltip.position.y}
      />
    </div>
  );
}

/** Compact legend integrated into the composition. */
export function WaffleLegend({
  categories,
  hoveredCat,
  onHover,
}: {
  categories: RevenueCategory[];
  hoveredCat: string | null;
  onHover: (id: string | null) => void;
}) {
  const groups = [
    { label: 'Direct Tax', color: 'var(--saffron)', ids: ['income-tax', 'corporate-tax'] },
    { label: 'Indirect Tax', color: 'var(--gold)', ids: ['gst', 'customs', 'excise'] },
    { label: 'Borrowings', color: 'var(--cyan)', ids: ['borrowings'] },
    { label: 'Non-Tax', color: 'var(--text-muted)', ids: ['non-tax-revenue'] },
  ];

  return (
    <div className="flex flex-wrap gap-4 mt-6">
      {groups.map((g) => {
        const total = categories
          .filter((c) => g.ids.includes(c.id))
          .reduce((sum, c) => sum + c.percentOfTotal, 0);
        return (
          <button
            key={g.label}
            className="flex items-center gap-2 text-sm cursor-pointer bg-transparent border-none p-0"
            onMouseEnter={() => onHover(g.ids[0])}
            onMouseLeave={() => onHover(null)}
            style={{
              color: hoveredCat && !g.ids.includes(hoveredCat)
                ? 'var(--text-muted)'
                : 'var(--text-secondary)',
              transition: 'color 150ms ease',
            }}
          >
            <span
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: g.color }}
            />
            <span>{g.label}</span>
            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              {formatPercent(total, 0)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
