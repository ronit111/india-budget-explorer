import { useCalculatorStore } from '../../store/calculatorStore.ts';
import { SegmentedControl } from '../ui/SegmentedControl.tsx';
import { formatLPA, formatIndianNumber } from '../../lib/format.ts';

const PRESETS = [500000, 1000000, 1500000, 2500000, 5000000];

const REGIME_OPTIONS: { value: 'new' | 'old'; label: string }[] = [
  { value: 'new', label: 'New Regime' },
  { value: 'old', label: 'Old Regime' },
];

export function IncomeInput() {
  const { income, regime, setIncome, setRegime } = useCalculatorStore();
  const pct = (income / 10000000) * 100;

  return (
    <div className="space-y-8">
      {/* Hero income display */}
      <div className="text-center py-4">
        <p className="text-caption uppercase tracking-wider mb-3">Your Annual Income</p>
        <p
          className="font-mono font-extrabold leading-none"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--text-primary)' }}
        >
          <span className="text-annotation" style={{ fontSize: '0.45em', verticalAlign: 'baseline' }}>
            Rs{' '}
          </span>
          {formatIndianNumber(income)}
        </p>
        <p className="text-annotation mt-2">{formatLPA(income)}</p>
      </div>

      {/* Custom slider */}
      <div className="px-1">
        <input
          type="range"
          min={0}
          max={10000000}
          step={50000}
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="income-slider"
          style={
            {
              '--fill-pct': `${pct}%`,
            } as React.CSSProperties
          }
          aria-label="Annual income"
        />
        <div className="flex justify-between text-caption font-mono mt-2">
          <span>Rs 0</span>
          <span>Rs 1 Cr</span>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap justify-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => setIncome(preset)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            style={{
              background: income === preset ? 'var(--bg-hover)' : 'var(--bg-raised)',
              color: income === preset ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: income === preset ? '1px solid var(--cyan)' : 'var(--border-subtle)',
            }}
          >
            {formatLPA(preset)}
          </button>
        ))}
      </div>

      {/* Regime selector */}
      <div className="flex justify-center">
        <SegmentedControl options={REGIME_OPTIONS} value={regime} onChange={setRegime} />
      </div>
    </div>
  );
}
