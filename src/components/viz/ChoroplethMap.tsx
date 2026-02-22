import { useMemo, useState } from 'react';
import { scaleQuantize } from 'd3-scale';
import type { StateTransfer } from '../../lib/data/schema.ts';
import { formatRsCrore, formatIndianNumber } from '../../lib/format.ts';

interface ChoroplethMapProps {
  states: StateTransfer[];
  isVisible: boolean;
}

// Simplified India state paths (inline SVG approach)
// Using approximate boundaries for the major states
const STATE_PATHS: Record<string, string> = {
  JK: 'M185,30 L210,15 L235,25 L240,50 L225,65 L205,70 L185,55 Z',
  HP: 'M205,70 L225,65 L235,80 L220,95 L200,90 Z',
  PB: 'M180,75 L205,70 L200,90 L185,100 L170,90 Z',
  UK: 'M220,95 L240,85 L260,95 L250,110 L225,110 Z',
  HR: 'M170,90 L200,90 L200,115 L180,125 L165,110 Z',
  RJ: 'M100,110 L170,90 L180,125 L175,170 L145,195 L90,180 L80,140 Z',
  UP: 'M200,115 L250,110 L290,120 L300,150 L275,170 L240,175 L200,165 L180,125 Z',
  BH: 'M290,150 L330,145 L340,165 L310,175 L290,170 Z',
  WB: 'M330,145 L355,140 L365,170 L350,210 L330,220 L320,190 L310,175 L340,165 Z',
  JH: 'M290,170 L310,175 L320,190 L305,210 L280,200 L275,180 Z',
  OR: 'M280,200 L305,210 L330,220 L325,250 L300,265 L270,245 L265,215 Z',
  CG: 'M240,195 L275,180 L280,200 L265,215 L270,245 L250,250 L230,225 Z',
  MP: 'M145,145 L200,140 L240,175 L240,195 L230,225 L185,230 L140,210 L130,175 Z',
  GJ: 'M60,155 L100,140 L130,175 L140,210 L120,230 L80,230 L50,210 L40,180 Z',
  MH: 'M80,230 L140,210 L185,230 L200,260 L180,295 L140,310 L100,290 L75,265 Z',
  TS: 'M180,295 L200,260 L230,270 L245,295 L225,315 L195,310 Z',
  AP: 'M195,310 L225,315 L260,300 L280,330 L260,360 L220,350 L200,330 Z',
  KA: 'M100,290 L140,310 L180,295 L195,310 L200,330 L180,370 L140,380 L110,350 L95,320 Z',
  KL: 'M110,350 L140,380 L135,420 L120,440 L105,420 L100,380 Z',
  TN: 'M140,380 L180,370 L200,330 L220,350 L210,390 L180,420 L155,430 L135,420 Z',
  NE: 'M355,120 L400,100 L420,120 L415,150 L390,160 L370,155 L355,140 Z',
  AS: 'M340,130 L380,115 L400,125 L395,145 L365,150 L345,145 Z',
};

export function ChoroplethMap({ states, isVisible }: ChoroplethMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const colorScale = useMemo(() => {
    const perCapitas = states.map((s) => s.perCapita);
    return scaleQuantize<string>()
      .domain([Math.min(...perCapitas), Math.max(...perCapitas)])
      .range([
        '#0c2340',
        '#0f3460',
        '#1a4f80',
        '#256ba0',
        '#3B82F6',
        '#60a5fa',
        '#93c5fd',
      ]);
  }, [states]);

  const stateMap = useMemo(
    () => new Map(states.map((s) => [s.id, s])),
    [states]
  );

  const hoveredState = hovered ? stateMap.get(hovered) : null;

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <div className="relative" style={{ paddingBottom: '100%' }}>
        <svg
          viewBox="0 0 450 470"
          className="absolute inset-0 w-full h-full"
          aria-label="Choropleth map of India showing state transfers"
        >
          {Object.entries(STATE_PATHS).map(([stateId, path]) => {
            const stateData = stateMap.get(stateId);
            const fill = stateData
              ? colorScale(stateData.perCapita)
              : '#1f2937';

            return (
              <path
                key={stateId}
                d={path}
                fill={fill}
                stroke="var(--color-bg-deepest)"
                strokeWidth={1.5}
                opacity={isVisible ? (hovered && hovered !== stateId ? 0.4 : 1) : 0}
                style={{
                  transition: 'opacity 0.5s ease, fill 0.3s ease',
                  transitionDelay: isVisible ? `${Math.random() * 0.5}s` : '0s',
                  cursor: stateData ? 'pointer' : 'default',
                }}
                onMouseEnter={() => setHovered(stateId)}
                onMouseLeave={() => setHovered(null)}
              >
                {stateData && (
                  <title>
                    {stateData.name}: {formatRsCrore(stateData.transfer)} (
                    Rs {formatIndianNumber(stateData.perCapita)}/person)
                  </title>
                )}
              </path>
            );
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredState && (
        <div className="absolute top-4 right-4 bg-[var(--color-bg-raised)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 shadow-xl">
          <p className="font-semibold text-sm">{hoveredState.name}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Transfer: {formatRsCrore(hoveredState.transfer)}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Per capita: Rs {formatIndianNumber(hoveredState.perCapita)}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Share: {hoveredState.percentOfTotal}%
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-1 mt-4">
        <span className="text-xs text-[var(--color-text-muted)]">Low</span>
        {['#0c2340', '#0f3460', '#1a4f80', '#256ba0', '#3B82F6', '#60a5fa', '#93c5fd'].map(
          (c) => (
            <div
              key={c}
              className="w-6 h-3 rounded-sm"
              style={{ backgroundColor: c }}
            />
          )
        )}
        <span className="text-xs text-[var(--color-text-muted)]">High</span>
        <span className="text-xs text-[var(--color-text-muted)] ml-2">
          (per capita transfer)
        </span>
      </div>
    </div>
  );
}
