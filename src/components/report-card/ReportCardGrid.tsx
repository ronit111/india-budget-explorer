import type { StateReportCard } from '../../lib/stateReportEngine.ts';
import { DomainPanel } from './DomainPanel.tsx';

interface ReportCardGridProps {
  report: StateReportCard;
}

export function ReportCardGrid({ report }: ReportCardGridProps) {
  // Count summary stats
  const allMetrics = report.panels.flatMap((p) => p.metrics).filter((m) => m.value != null);
  const top25 = allMetrics.filter((m) => m.quartile === 1).length;
  const bottom25 = allMetrics.filter((m) => m.quartile === 4).length;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center justify-center gap-6 mb-2">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="font-mono font-bold" style={{ color: '#10B981' }}>{top25}</span> metrics in top 25%
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="font-mono font-bold" style={{ color: '#EF4444' }}>{bottom25}</span> in bottom 25%
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{allMetrics.length}</span> total
        </span>
      </div>

      {/* Domain panels */}
      {report.panels.map((panel, i) => (
        <DomainPanel
          key={panel.domain}
          panel={panel}
          defaultOpen={i < 4} // First 4 panels open by default
        />
      ))}
    </div>
  );
}
