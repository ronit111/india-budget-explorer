import { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { Tooltip, TooltipTitle, TooltipRow, useTooltip } from '../ui/Tooltip.tsx';

// ─── Types ───────────────────────────────────────────────────────────
export interface BarItem {
  id: string;
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
  secondaryColor?: string;
  /** Optional annotation (e.g. "Target", "Budget estimate") */
  annotation?: string;
}

interface HorizontalBarChartProps {
  items: BarItem[];
  /** Target/reference line (e.g. FRBM target) */
  target?: { value: number; label: string; color: string };
  width?: number;
  /** Height per bar */
  barHeight?: number;
  isVisible: boolean;
  formatValue?: (v: number) => string;
  unit?: string;
  /** Show secondary bars (grouped) */
  showSecondary?: boolean;
  secondaryLabel?: string;
  primaryLabel?: string;
  /** Left margin for labels (default 100) */
  labelWidth?: number;
}

// ─── Constants ───────────────────────────────────────────────────────
const DEFAULT_MARGIN = { top: 8, right: 60, bottom: 8 };
const BAR_GAP = 6;
const DEFAULT_COLOR = 'var(--saffron)';
const DEFAULT_SECONDARY_COLOR = 'var(--cyan)';

export function HorizontalBarChart({
  items,
  target,
  width = 600,
  barHeight = 28,
  isVisible,
  formatValue = (v) => `${v}`,
  unit = '%',
  showSecondary = false,
  secondaryLabel,
  primaryLabel,
  labelWidth = 100,
}: HorizontalBarChartProps) {
  const tooltip = useTooltip<BarItem>();

  const hasAnnotations = items.some((i) => i.annotation);
  const MARGIN = { ...DEFAULT_MARGIN, left: labelWidth, right: hasAnnotations ? 160 : DEFAULT_MARGIN.right };
  const innerW = width - MARGIN.left - MARGIN.right;
  const rowHeight = showSecondary ? barHeight * 2 + BAR_GAP + 12 : barHeight + 12;
  const totalH = MARGIN.top + items.length * rowHeight + MARGIN.bottom;

  const xScale = useMemo(() => {
    let max = 0;
    for (const item of items) {
      if (item.value > max) max = item.value;
      if (showSecondary && item.secondaryValue !== undefined && item.secondaryValue > max) {
        max = item.secondaryValue;
      }
    }
    if (target && target.value > max) max = target.value;
    return scaleLinear()
      .domain([0, max * 1.15])
      .range([0, innerW]);
  }, [items, target, innerW, showSecondary]);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${totalH}`} className="w-full" style={{ minWidth: 320, overflow: 'visible' }}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {/* Target reference line */}
          {target && (
            <>
              <line
                x1={xScale(target.value)}
                x2={xScale(target.value)}
                y1={-4}
                y2={items.length * rowHeight + 4}
                stroke={target.color}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                opacity={isVisible ? 0.6 : 0}
                style={{ transition: 'opacity 0.6s ease 0.5s' }}
              />
              <text
                x={xScale(target.value)}
                y={-8}
                textAnchor="middle"
                fontSize={9}
                fontFamily="var(--font-mono)"
                fill={target.color}
                opacity={isVisible ? 0.8 : 0}
                style={{ transition: 'opacity 0.6s ease 0.5s' }}
              >
                {target.label}
              </text>
            </>
          )}

          {items.map((item, i) => {
            const y = i * rowHeight;
            const barColor = item.color || DEFAULT_COLOR;
            const secColor = item.secondaryColor || DEFAULT_SECONDARY_COLOR;
            const barW = xScale(item.value);
            const secBarW = item.secondaryValue !== undefined ? xScale(item.secondaryValue) : 0;
            const delay = i * 0.08;

            return (
              <g key={item.id}>
                {/* Label */}
                <text
                  x={-8}
                  y={y + (showSecondary ? barHeight : barHeight / 2)}
                  dy="0.35em"
                  textAnchor="end"
                  fontSize={11}
                  fontFamily="var(--font-body)"
                  fill="var(--text-secondary)"
                  opacity={isVisible ? 1 : 0}
                  style={{ transition: `opacity 0.4s ease ${delay}s` }}
                >
                  {item.label}
                </text>

                {/* Primary bar */}
                <rect
                  x={0}
                  y={y}
                  width={isVisible ? barW : 0}
                  height={barHeight}
                  rx={3}
                  fill={barColor}
                  opacity={0.85}
                  style={{ transition: `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` }}
                  onMouseEnter={(e) => tooltip.show(item, e)}
                  onMouseMove={tooltip.move}
                  onMouseLeave={tooltip.hide}
                />

                {/* Primary value */}
                <text
                  x={isVisible ? barW + 8 : 8}
                  y={y + barHeight / 2}
                  dy="0.35em"
                  fontSize={12}
                  fontFamily="var(--font-mono)"
                  fontWeight={600}
                  fill="var(--text-primary)"
                  opacity={isVisible ? 1 : 0}
                  style={{ transition: `opacity 0.4s ease ${delay + 0.5}s, x 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` }}
                >
                  {formatValue(item.value)}{unit ? ` ${unit}` : ''}
                </text>

                {/* Annotation */}
                {item.annotation && (
                  <text
                    x={isVisible ? barW + 8 : 8}
                    y={y + barHeight / 2 + 14}
                    fontSize={9}
                    fontFamily="var(--font-mono)"
                    fill="var(--text-muted)"
                    opacity={isVisible ? 0.7 : 0}
                    style={{ transition: `opacity 0.4s ease ${delay + 0.6}s` }}
                  >
                    {item.annotation}
                  </text>
                )}

                {/* Secondary bar (grouped mode) */}
                {showSecondary && item.secondaryValue !== undefined && (
                  <>
                    <rect
                      x={0}
                      y={y + barHeight + BAR_GAP}
                      width={isVisible ? secBarW : 0}
                      height={barHeight}
                      rx={3}
                      fill={secColor}
                      opacity={0.6}
                      style={{ transition: `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay + 0.1}s` }}
                      onMouseEnter={(e) => tooltip.show(item, e)}
                      onMouseMove={tooltip.move}
                      onMouseLeave={tooltip.hide}
                    />
                    <text
                      x={isVisible ? secBarW + 8 : 8}
                      y={y + barHeight + BAR_GAP + barHeight / 2}
                      dy="0.35em"
                      fontSize={12}
                      fontFamily="var(--font-mono)"
                      fontWeight={500}
                      fill="var(--text-secondary)"
                      opacity={isVisible ? 0.8 : 0}
                      style={{ transition: `opacity 0.4s ease ${delay + 0.6}s` }}
                    >
                      {formatValue(item.secondaryValue)}{unit ? ` ${unit}` : ''}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <Tooltip
        content={
          tooltip.data && (
            <>
              <TooltipTitle>{tooltip.data.label}</TooltipTitle>
              <TooltipRow label={primaryLabel || 'Value'} value={`${formatValue(tooltip.data.value)} ${unit}`} />
              {showSecondary && tooltip.data.secondaryValue !== undefined && (
                <TooltipRow
                  label={secondaryLabel || 'Secondary'}
                  value={`${formatValue(tooltip.data.secondaryValue)} ${unit}`}
                />
              )}
              {tooltip.data.annotation && (
                <TooltipRow label="Note" value={tooltip.data.annotation} />
              )}
            </>
          )
        }
        visible={tooltip.visible}
        x={tooltip.position.x}
        y={tooltip.position.y}
      />

      {/* Legend for grouped mode */}
      {showSecondary && primaryLabel && secondaryLabel && (
        <div className="flex flex-wrap gap-4 mt-3 px-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm" style={{ background: items[0]?.color || DEFAULT_COLOR, opacity: 0.85 }} />
            <span className="text-caption">{primaryLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 rounded-sm" style={{ background: items[0]?.secondaryColor || DEFAULT_SECONDARY_COLOR, opacity: 0.6 }} />
            <span className="text-caption">{secondaryLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
}
