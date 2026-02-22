import { useCallback, useRef } from 'react';
import type { TaxBreakdown } from '../../lib/taxEngine.ts';
import { formatIndianNumber, formatPercent, formatLPA } from '../../lib/format.ts';

interface ShareCardProps {
  breakdown: TaxBreakdown;
  regime: 'new' | 'old';
}

export function ShareCard({ breakdown, regime }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 630;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#0a0e1a');
    gradient.addColorStop(1, '#111827');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Accent line
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(0, 0, 1200, 4);

    // Title
    ctx.fillStyle = '#FF6B35';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText('India Budget Explorer', 60, 60);

    // Income
    ctx.fillStyle = '#f5f0eb';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText(
      `On an income of Rs ${formatIndianNumber(breakdown.grossIncome)} (${formatLPA(breakdown.grossIncome)})`,
      60,
      130
    );

    // Tax
    ctx.fillStyle = '#FF6B35';
    ctx.font = 'bold 64px JetBrains Mono, monospace';
    ctx.fillText(`Rs ${formatIndianNumber(breakdown.totalTax)}`, 60, 230);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '28px Inter, sans-serif';
    ctx.fillText(
      `in taxes under ${regime === 'new' ? 'New' : 'Old'} Regime (${formatPercent(
        breakdown.effectiveRate
      )} effective)`,
      60,
      280
    );

    // Footer
    ctx.fillStyle = '#6B7280';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText('See where your taxes go at budgetexplorer.in/calculator', 60, 580);

    // Download
    const link = document.createElement('a');
    link.download = 'my-tax-share.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [breakdown, regime]);

  return (
    <div className="mt-8">
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={generateImage}
        className="w-full py-3 px-6 rounded-xl font-semibold text-white cursor-pointer border-none transition-all"
        style={{ background: 'linear-gradient(135deg, #FF6B35, #ff8c5a)' }}
      >
        Download Share Card (1200x630)
      </button>
      <p className="text-xs text-[var(--color-text-muted)] text-center mt-2">
        Share on social media with your tax breakdown
      </p>
    </div>
  );
}
