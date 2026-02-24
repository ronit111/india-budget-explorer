import { useCallback, useRef, useState } from 'react';
import type { TaxBreakdown } from '../../lib/taxEngine.ts';
import { formatIndianNumber, formatPercent, formatLPA } from '../../lib/format.ts';

interface ShareCardProps {
  breakdown: TaxBreakdown;
  regime: 'new' | 'old';
}

export function ShareCard({ breakdown, regime }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = useState(false);

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 630;

    // Background — matches --bg-void
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#06080f');
    gradient.addColorStop(1, '#0e1420');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Subtle accent line — warm gold, not saffron
    const accentGrad = ctx.createLinearGradient(0, 0, 1200, 0);
    accentGrad.addColorStop(0, '#FF6B35');
    accentGrad.addColorStop(1, '#FFC857');
    ctx.fillStyle = accentGrad;
    ctx.fillRect(0, 0, 1200, 3);

    // Title
    ctx.fillStyle = '#b0b8c4';
    ctx.font = '500 20px Inter, sans-serif';
    ctx.fillText('Indian Data Project', 60, 52);

    // Income
    ctx.fillStyle = '#f0ece6';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText(
      `On an income of Rs ${formatIndianNumber(breakdown.grossIncome)} (${formatLPA(breakdown.grossIncome)})`,
      60,
      130
    );

    // Tax — hero number with warm gold, not harsh orange
    ctx.fillStyle = '#FFC857';
    ctx.font = 'bold 64px JetBrains Mono, monospace';
    ctx.fillText(`Rs ${formatIndianNumber(breakdown.totalTax)}`, 60, 230);

    ctx.fillStyle = '#5c6a7e';
    ctx.font = '28px Inter, sans-serif';
    ctx.fillText(
      `in taxes under ${regime === 'new' ? 'New' : 'Old'} Regime (${formatPercent(
        breakdown.effectiveRate
      )} effective)`,
      60,
      280
    );

    // Deductions line (Old Regime only)
    if (breakdown.totalDeductions > 0) {
      ctx.fillStyle = '#FFC857';
      ctx.font = '24px Inter, sans-serif';
      ctx.fillText(
        `after Rs ${formatIndianNumber(breakdown.totalDeductions)} in deductions`,
        60,
        330
      );
    }

    // Footer
    ctx.fillStyle = '#5c6a7e';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText('indiandataproject.org/calculator', 60, 580);

    // Download
    const link = document.createElement('a');
    link.download = 'my-tax-share.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Show feedback
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 1500);
  }, [breakdown, regime]);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={generateImage}
        className="py-2 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 whitespace-nowrap hover:border-[var(--cyan)] hover:bg-[var(--cyan-dim)]"
        style={{
          background: downloaded ? 'var(--positive-dim)' : 'transparent',
          color: downloaded ? 'var(--positive)' : 'var(--text-secondary)',
          border: downloaded ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(255, 255, 255, 0.10)',
        }}
      >
        <span className="flex items-center gap-2">
          {downloaded ? (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Downloaded
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2v8m0 0L5 7m3 3l3-3M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Share Card
            </>
          )}
        </span>
      </button>
    </>
  );
}
