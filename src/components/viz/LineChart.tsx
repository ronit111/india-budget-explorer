import { useMemo, useRef, useEffect, useState } from 'react';
import { scaleLinear, scalePoint } from 'd3-scale';
import { line as d3Line, curveMonotoneX } from 'd3-shape';
import type { TimeSeriesPoint } from '../../lib/data/schema.ts';
import { Tooltip, TooltipTitle, TooltipRow, useTooltip } from '../ui/Tooltip.tsx';

// ─── Types ───────────────────────────────────────────────────────────
export interface LineSeries {
  id: string;
  name: string;
  color: string;
  data: TimeSeriesPoint[];
  dashed?: boolean;
}

interface LineChartProps {
  series: LineSeries[];
  /** Horizontal band overlay (e.g. RBI target range) */
  band?: { lower: number; upper: number; color: string; label: string };
  /** Reference line (e.g. 0% baseline) */
  referenceLine?: number;
  width?: number;
  height?: number;
  isVisible: boolean;
  /** Format function for Y-axis values */
  formatValue?: (v: number) => string;
  /** Unit label for tooltip */
  unit?: string;
}

// ─── Constants ───────────────────────────────────────────────────────
const MARGIN = { top: 20, right: 24, bottom: 40, left: 48 };

export function LineChart({
  series,
  band,
  referenceLine,
  width = 700,
  height = 360,
  isVisible,
  formatValue = (v) => `${v}`,
  unit = '%',
}: LineChartProps) {
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const [pathLengths, setPathLengths] = useState<Map<string, number>>(new Map());
  const tooltip = useTooltip<{ year: string; values: { name: string; value: number; color: string }[] }>();

  const innerW = width - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  // Collect all unique years across all series (sorted chronologically)
  const years = useMemo(() => {
    const set = new Set<string>();
    for (const s of series) for (const d of s.data) set.add(d.year);
    return Array.from(set).sort();
  }, [series]);

  // Scales
  const xScale = useMemo(
    () => scalePoint<string>().domain(years).range([0, innerW]).padding(0.1),
    [years, innerW],
  );

  const yScale = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const s of series) {
      for (const d of s.data) {
        if (d.value < min) min = d.value;
        if (d.value > max) max = d.value;
      }
    }
    if (band) {
      min = Math.min(min, band.lower);
      max = Math.max(max, band.upper);
    }
    if (referenceLine !== undefined) {
      min = Math.min(min, referenceLine);
      max = Math.max(max, referenceLine);
    }
    const pad = (max - min) * 0.12;
    return scaleLinear()
      .domain([min - pad, max + pad])
      .range([innerH, 0])
      .nice();
  }, [series, band, referenceLine, innerH]);

  // D3 line generator
  const lineGen = useMemo(
    () =>
      d3Line<TimeSeriesPoint>()
        .x((d) => xScale(d.year) ?? 0)
        .y((d) => yScale(d.value))
        .curve(curveMonotoneX),
    [xScale, yScale],
  );

  // Measure path lengths for draw-in animation
  useEffect(() => {
    const lengths = new Map<string, number>();
    pathRefs.current.forEach((el, id) => {
      if (el) lengths.set(id, el.getTotalLength());
    });
    setPathLengths(lengths);
  }, [series, width, height]);

  // Y-axis ticks
  const yTicks = yScale.ticks(5);

  // Build a lookup: year -> [values across series]
  const yearLookup = useMemo(() => {
    const map = new Map<string, { name: string; value: number; color: string }[]>();
    for (const yr of years) {
      const vals: { name: string; value: number; color: string }[] = [];
      for (const s of series) {
        const pt = s.data.find((d) => d.year === yr);
        if (pt) vals.push({ name: s.name, value: pt.value, color: s.color });
      }
      map.set(yr, vals);
    }
    return map;
  }, [years, series]);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: 400 }}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          {/* Band overlay (e.g. RBI target range) */}
          {band && (
            <>
              <rect
                x={0}
                y={yScale(band.upper)}
                width={innerW}
                height={yScale(band.lower) - yScale(band.upper)}
                fill={band.color}
                opacity={isVisible ? 0.1 : 0}
                style={{ transition: 'opacity 0.8s ease 0.3s' }}
              />
              <text
                x={innerW + 4}
                y={yScale((band.upper + band.lower) / 2)}
                dy="0.35em"
                fontSize={9}
                fontFamily="var(--font-mono)"
                fill={band.color}
                opacity={isVisible ? 0.6 : 0}
                style={{ transition: 'opacity 0.8s ease 0.6s' }}
              >
                {band.label}
              </text>
            </>
          )}

          {/* Reference line (e.g. 0% baseline) */}
          {referenceLine !== undefined && (
            <line
              x1={0}
              x2={innerW}
              y1={yScale(referenceLine)}
              y2={yScale(referenceLine)}
              stroke="var(--text-muted)"
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={isVisible ? 0.4 : 0}
              style={{ transition: 'opacity 0.6s ease 0.2s' }}
            />
          )}

          {/* Gridlines */}
          {yTicks.map((tick) => (
            <line
              key={tick}
              x1={0}
              x2={innerW}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="var(--text-muted)"
              strokeWidth={0.5}
              opacity={isVisible ? 0.15 : 0}
              style={{ transition: 'opacity 0.5s ease' }}
            />
          ))}

          {/* Y-axis labels */}
          {yTicks.map((tick) => (
            <text
              key={tick}
              x={-8}
              y={yScale(tick)}
              dy="0.35em"
              textAnchor="end"
              fontSize={11}
              fontFamily="var(--font-mono)"
              fill="var(--text-muted)"
              opacity={isVisible ? 1 : 0}
              style={{ transition: 'opacity 0.5s ease' }}
            >
              {formatValue(tick)}
            </text>
          ))}

          {/* X-axis labels */}
          {years.map((yr, i) => {
            const x = xScale(yr) ?? 0;
            // Show every other label on small viewports
            const show = years.length <= 8 || i % 2 === 0 || i === years.length - 1;
            return show ? (
              <text
                key={yr}
                x={x}
                y={innerH + 24}
                textAnchor="middle"
                fontSize={10}
                fontFamily="var(--font-mono)"
                fill="var(--text-muted)"
                opacity={isVisible ? 1 : 0}
                style={{ transition: `opacity 0.4s ease ${0.05 * i}s` }}
              >
                {yr.length > 5 ? yr.slice(2) : yr}
              </text>
            ) : null;
          })}

          {/* Lines */}
          {series.map((s, si) => {
            const pathD = lineGen(s.data) || '';
            const pLen = pathLengths.get(s.id) || 1000;
            const delay = si * 0.15;

            return (
              <path
                key={s.id}
                ref={(el) => {
                  if (el) pathRefs.current.set(s.id, el);
                }}
                d={pathD}
                fill="none"
                stroke={s.color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={s.dashed ? '6 4' : `${pLen}`}
                strokeDashoffset={isVisible ? 0 : (s.dashed ? 0 : pLen)}
                style={
                  s.dashed
                    ? { opacity: isVisible ? 1 : 0, transition: `opacity 0.8s ease ${delay}s` }
                    : { transition: `stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` }
                }
              />
            );
          })}

          {/* Data points */}
          {series.map((s, si) =>
            s.data.map((d, di) => {
              const cx = xScale(d.year) ?? 0;
              const cy = yScale(d.value);
              const delay = si * 0.15 + 0.8 + di * 0.03;

              return (
                <circle
                  key={`${s.id}-${d.year}`}
                  cx={cx}
                  cy={cy}
                  r={3.5}
                  fill={s.color}
                  opacity={isVisible ? 1 : 0}
                  style={{ transition: `opacity 0.3s ease ${delay}s` }}
                />
              );
            }),
          )}

          {/* Invisible hover rects for tooltip */}
          {years.map((yr) => {
            const x = xScale(yr) ?? 0;
            const step = xScale.step();
            const values = yearLookup.get(yr) || [];

            return (
              <rect
                key={`hover-${yr}`}
                x={x - step / 2}
                y={0}
                width={step}
                height={innerH}
                fill="transparent"
                onMouseEnter={(e) => tooltip.show({ year: yr, values }, e)}
                onMouseMove={tooltip.move}
                onMouseLeave={tooltip.hide}
                style={{ cursor: 'crosshair' }}
              />
            );
          })}

          {/* Hover vertical line */}
          {tooltip.visible && tooltip.data && (
            <line
              x1={xScale(tooltip.data.year) ?? 0}
              x2={xScale(tooltip.data.year) ?? 0}
              y1={0}
              y2={innerH}
              stroke="var(--text-muted)"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.5}
              pointerEvents="none"
            />
          )}
        </g>
      </svg>

      <Tooltip
        content={
          tooltip.data && (
            <>
              <TooltipTitle>{tooltip.data.year}</TooltipTitle>
              {tooltip.data.values.map((v) => (
                <TooltipRow key={v.name} label={v.name} value={`${formatValue(v.value)}${unit ? ` ${unit}` : ''}`} />
              ))}
            </>
          )
        }
        visible={tooltip.visible}
        x={tooltip.position.x}
        y={tooltip.position.y}
      />

      {/* Legend */}
      {series.length > 1 && (
        <div className="flex flex-wrap gap-4 mt-3 px-2">
          {series.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-0.5 rounded-full"
                style={{ background: s.color, height: s.dashed ? 1 : 2 }}
              />
              <span className="text-caption">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
