import { useCalculatorStore } from '../../store/calculatorStore.ts';
import { formatLPA, formatIndianNumber } from '../../lib/format.ts';

const PRESETS = [500000, 1000000, 1500000, 2500000, 5000000];

export function IncomeInput() {
  const { income, regime, setIncome, setRegime } = useCalculatorStore();

  return (
    <div className="space-y-6">
      {/* Income display */}
      <div className="text-center">
        <p className="text-sm text-[var(--color-text-muted)] mb-2">
          Your Annual Income
        </p>
        <p className="text-4xl md:text-5xl font-bold font-mono gradient-text-saffron">
          Rs {formatIndianNumber(income)}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {formatLPA(income)}
        </p>
      </div>

      {/* Slider */}
      <div className="px-2">
        <input
          type="range"
          min={0}
          max={10000000}
          step={50000}
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--color-saffron) ${
              (income / 10000000) * 100
            }%, var(--color-bg-raised) ${(income / 10000000) * 100}%)`,
          }}
          aria-label="Annual income"
        />
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1 font-mono">
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
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
              income === preset
                ? 'bg-[var(--color-saffron)] text-white border-[var(--color-saffron)]'
                : 'bg-[var(--color-bg-raised)] text-[var(--color-text-secondary)] border-[rgba(255,255,255,0.08)] hover:border-[var(--color-saffron)]'
            }`}
          >
            {formatLPA(preset)}
          </button>
        ))}
      </div>

      {/* Regime toggle */}
      <div className="flex items-center justify-center gap-4">
        <span
          className={`text-sm cursor-pointer transition-colors ${
            regime === 'old' ? 'text-[var(--color-saffron)] font-semibold' : 'text-[var(--color-text-muted)]'
          }`}
          onClick={() => setRegime('old')}
        >
          Old Regime
        </span>
        <button
          onClick={() => setRegime(regime === 'new' ? 'old' : 'new')}
          className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer border-none ${
            regime === 'new' ? 'bg-[var(--color-saffron)]' : 'bg-[var(--color-bg-hover)]'
          }`}
          aria-label={`Switch to ${regime === 'new' ? 'old' : 'new'} regime`}
        >
          <div
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
            style={{
              transform: regime === 'new' ? 'translateX(26px)' : 'translateX(2px)',
            }}
          />
        </button>
        <span
          className={`text-sm cursor-pointer transition-colors ${
            regime === 'new' ? 'text-[var(--color-saffron)] font-semibold' : 'text-[var(--color-text-muted)]'
          }`}
          onClick={() => setRegime('new')}
        >
          New Regime
        </span>
      </div>
    </div>
  );
}
