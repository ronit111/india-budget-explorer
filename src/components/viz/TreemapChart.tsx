import { useMemo, useState, useCallback } from 'react';
import * as d3 from 'd3-hierarchy';
import { motion, AnimatePresence } from 'framer-motion';
import type { TreemapNode } from '../../lib/data/schema.ts';
import { formatRsCrore, formatPercent } from '../../lib/format.ts';

interface TreemapChartProps {
  root: TreemapNode;
  width?: number;
  height?: number;
  isVisible: boolean;
}

const COLORS = [
  '#FF6B35', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B',
  '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4',
  '#EF4444', '#84CC16',
];

export function TreemapChart({ root, width = 800, height = 500, isVisible }: TreemapChartProps) {
  const [drillNode, setDrillNode] = useState<TreemapNode | null>(null);
  const activeRoot = drillNode || root;

  const layout = useMemo(() => {
    const hierarchy = d3
      .hierarchy(activeRoot)
      .sum((d) => (d.children ? 0 : d.value || 0))
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    d3
      .treemap<TreemapNode>()
      .size([width, height])
      .paddingInner(2)
      .paddingOuter(4)
      .round(true)(hierarchy);

    return hierarchy.leaves();
  }, [activeRoot, width, height]);

  const handleClick = useCallback(
    (node: TreemapNode) => {
      if (drillNode) {
        setDrillNode(null);
      } else if (node.children && node.children.length > 0) {
        setDrillNode(node);
      }
    },
    [drillNode]
  );

  return (
    <div className="w-full">
      {drillNode && (
        <button
          onClick={() => setDrillNode(null)}
          className="mb-3 px-3 py-1.5 text-xs font-medium text-[var(--color-saffron)] bg-[rgba(255,107,53,0.1)] rounded-lg hover:bg-[rgba(255,107,53,0.2)] transition-colors cursor-pointer border-none"
        >
          &larr; Back to overview
        </button>
      )}

      <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: `${width}/${height}` }}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <AnimatePresence mode="wait">
            {layout.map((leaf, i) => {
              const x0 = (leaf as unknown as { x0: number }).x0;
              const y0 = (leaf as unknown as { y0: number }).y0;
              const x1 = (leaf as unknown as { x1: number }).x1;
              const y1 = (leaf as unknown as { y1: number }).y1;
              const w = x1 - x0;
              const h = y1 - y0;
              const parent = leaf.parent?.data;
              const colorIdx = root.children
                ? root.children.findIndex(
                    (c) => c.id === (drillNode ? drillNode.id : parent?.id || leaf.data.id)
                  )
                : i;
              const color = COLORS[colorIdx >= 0 ? colorIdx % COLORS.length : i % COLORS.length];
              const showLabel = w > 60 && h > 30;
              const showValue = w > 80 && h > 50;

              return (
                <motion.g
                  key={leaf.data.id}
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.4 }}
                >
                  <rect
                    className="treemap-rect"
                    x={x0}
                    y={y0}
                    width={w}
                    height={h}
                    fill={color}
                    rx={4}
                    onClick={() => handleClick(leaf.data.children ? leaf.data : parent || leaf.data)}
                  >
                    <title>
                      {leaf.data.name}: {formatRsCrore(leaf.value || 0)}
                    </title>
                  </rect>
                  {showLabel && (
                    <text
                      x={x0 + 6}
                      y={y0 + 18}
                      fill="white"
                      fontSize={w > 120 ? 12 : 10}
                      fontWeight={600}
                      fontFamily="var(--font-body)"
                      style={{ pointerEvents: 'none' }}
                    >
                      {leaf.data.name.length > Math.floor(w / 7)
                        ? leaf.data.name.slice(0, Math.floor(w / 7)) + '...'
                        : leaf.data.name}
                    </text>
                  )}
                  {showValue && (
                    <text
                      x={x0 + 6}
                      y={y0 + 34}
                      fill="rgba(255,255,255,0.7)"
                      fontSize={10}
                      fontFamily="var(--font-mono)"
                      style={{ pointerEvents: 'none' }}
                    >
                      {leaf.data.percentOfTotal
                        ? formatPercent(leaf.data.percentOfTotal)
                        : formatRsCrore(leaf.value || 0)}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>
        </svg>
      </div>
    </div>
  );
}
