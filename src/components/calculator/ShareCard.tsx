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

    // Background — matches --bg-void
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#06080f');
    gradient.addColorStop(1, '#0e1420');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Saffron accent line
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(0, 0, 1200, 4);

    // Title
    ctx.fillStyle = '#FF6B35';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText('India Budget Explorer', 60, 60);

    // Income
    ctx.fillStyle = '#f0ece6';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText(
      `On an income of Rs ${formatIndianNumber(breakdown.grossIncome)} (${formatLPA(breakdown.grossIncome)})`,
      60,
      130
    );

    // Tax — hero number
    ctx.fillStyle = '#FF6B35';
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

    // Footer
    ctx.fillStyle = '#5c6a7e';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText('See where your taxes go at indiabudgetexplorer.in/calculator', 60, 580);

    // Download
    const link = document.createElement('a');
    link.download = 'my-tax-share.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [breakdown, regime]);

  return (
    <div>
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={generateImage}
        className="w-full py-3 px-6 rounded-lg font-semibold text-white cursor-pointer border-none transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, var(--saffron), #ff8c5a)' }}
      >
        Download Share Card
      </button>
      <p className="text-caption text-center mt-2">1200 × 630 PNG for social media</p>
    </div>
  );
}
