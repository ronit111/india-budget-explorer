import { useMemo, useState, useRef, useEffect } from 'react';
import {
  sankey as d3Sankey,
  sankeyLinkHorizontal,
  type SankeyGraph,
  type SankeyNode as D3SankeyNode,
  type SankeyLink as D3SankeyLink,
} from 'd3-sankey';
import type { SankeyData } from '../../lib/data/schema.ts';
import { formatRsCrore } from '../../lib/format.ts';

interface SankeyDiagramProps {
  data: SankeyData;
  width?: number;
  height?: number;
  isVisible: boolean;
}

interface NodeExtra {
  id: string;
  name: string;
  group: string;
}

type SNode = D3SankeyNode<NodeExtra, object>;
type SLink = D3SankeyLink<NodeExtra, object>;

const GROUP_COLORS: Record<string, string> = {
  revenue: '#3B82F6',
  center: '#FF6B35',
  expenditure: '#10B981',
};

export function SankeyDiagram({ data, width = 900, height = 600, isVisible }: SankeyDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pathLengths, setPathLengths] = useState<Map<number, number>>(new Map());
  const pathRefs = useRef<Map<number, SVGPathElement>>(new Map());

  const graph = useMemo(() => {
    const nodeIds = new Set(data.nodes.map((n) => n.id));

    const nodes: NodeExtra[] = data.nodes.map((n) => ({
      id: n.id,
      name: n.name,
      group: n.group,
    }));

    const links = data.links
      .filter((l) => nodeIds.has(l.source) && nodeIds.has(l.target))
      .map((l) => ({
        source: l.source,
        target: l.target,
        value: l.value,
      }));

    const layout = d3Sankey<NodeExtra, object>()
      .nodeId((d: SNode) => (d as unknown as NodeExtra).id)
      .nodeWidth(20)
      .nodePadding(12)
      .extent([
        [40, 20],
        [width - 40, height - 20],
      ]);

    return layout({
      nodes,
      links,
    } as SankeyGraph<NodeExtra, object>);
  }, [data, width, height]);

  const pathGen = sankeyLinkHorizontal();

  // Measure path lengths after render
  useEffect(() => {
    const lengths = new Map<number, number>();
    pathRefs.current.forEach((el, idx) => {
      if (el) lengths.set(idx, el.getTotalLength());
    });
    setPathLengths(lengths);
  }, [graph]);

  const isConnected = (nodeId: string) => {
    if (!hoveredNode) return true;
    if (nodeId === hoveredNode) return true;
    return graph.links.some((l) => {
      const src = (l.source as SNode) as unknown as NodeExtra;
      const tgt = (l.target as SNode) as unknown as NodeExtra;
      return (
        (src.id === hoveredNode && tgt.id === nodeId) ||
        (tgt.id === hoveredNode && src.id === nodeId)
      );
    });
  };

  const isLinkConnected = (link: SLink) => {
    if (!hoveredNode) return true;
    const src = (link.source as SNode) as unknown as NodeExtra;
    const tgt = (link.target as SNode) as unknown as NodeExtra;
    return src.id === hoveredNode || tgt.id === hoveredNode;
  };

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minWidth: 600 }}
      >
        {/* Links */}
        {graph.links.map((link, i) => {
          const pathD = pathGen(link as never) || '';
          const pLen = pathLengths.get(i) || 1000;
          const connected = isLinkConnected(link);

          return (
            <path
              key={i}
              ref={(el) => {
                if (el) pathRefs.current.set(i, el);
              }}
              d={pathD}
              fill="none"
              stroke={
                GROUP_COLORS[
                  ((link.source as SNode) as unknown as NodeExtra).group
                ] || '#6B7280'
              }
              strokeWidth={Math.max(1, (link as unknown as { width?: number }).width || 1)}
              strokeOpacity={connected ? 0.25 : 0.04}
              style={
                isVisible
                  ? {
                      strokeDasharray: pLen,
                      strokeDashoffset: 0,
                      transition: `stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s, stroke-opacity 0.3s ease`,
                    }
                  : {
                      strokeDasharray: pLen,
                      strokeDashoffset: pLen,
                    }
              }
            >
              <title>
                {((link.source as SNode) as unknown as NodeExtra).name} →{' '}
                {((link.target as SNode) as unknown as NodeExtra).name}:{' '}
                {formatRsCrore(link.value || 0)}
              </title>
            </path>
          );
        })}

        {/* Nodes */}
        {graph.nodes.map((node) => {
          const n = node as SNode;
          const extra = n as unknown as NodeExtra;
          const x0 = (n as unknown as { x0: number }).x0 || 0;
          const x1 = (n as unknown as { x1: number }).x1 || 0;
          const y0 = (n as unknown as { y0: number }).y0 || 0;
          const y1 = (n as unknown as { y1: number }).y1 || 0;
          const connected = isConnected(extra.id);

          return (
            <g
              key={extra.id}
              onMouseEnter={() => setHoveredNode(extra.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={x0}
                y={y0}
                width={x1 - x0}
                height={y1 - y0}
                fill={GROUP_COLORS[extra.group] || '#6B7280'}
                rx={3}
                opacity={isVisible ? (connected ? 1 : 0.2) : 0}
                style={{ transition: 'opacity 0.3s ease' }}
              />
              <text
                x={extra.group === 'revenue' ? x0 - 6 : x1 + 6}
                y={(y0 + y1) / 2}
                dy="0.35em"
                textAnchor={extra.group === 'revenue' ? 'end' : 'start'}
                fill={connected ? 'var(--color-text-secondary)' : 'var(--color-text-muted)'}
                fontSize={11}
                fontFamily="var(--font-body)"
                opacity={isVisible ? 1 : 0}
                style={{ transition: 'opacity 0.6s ease, fill 0.3s ease' }}
              >
                {extra.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
