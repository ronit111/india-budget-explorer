import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalculatorStore } from '../../store/calculatorStore.ts';
import { formatIndianNumber } from '../../lib/format.ts';
import type { OldRegimeDeductions } from '../../lib/data/schema.ts';

interface DeductionSection {
  key: keyof OldRegimeDeductions;
  section: string;
  name: string;
  description: string;
  cap: number | null;
}

const SECTIONS: DeductionSection[] = [
  {
    key: 'section80C',
    section: '80C',
    name: 'Section 80C',
    description: 'PPF, ELSS, EPF, LIC, tuition fees',
    cap: 150000,
  },
  {
    key: 'section80D_self',
    section: '80D',
    name: 'Section 80D — Self & Family',
    description: 'Health insurance premiums',
    cap: 25000,
  },
  {
    key: 'section80D_parents',
    section: '80D',
    name: 'Section 80D — Parents',
    description: 'Health insurance for parents',
    cap: 25000,
  },
  {
    key: 'section80CCD1B',
    section: '80CCD(1B)',
    name: 'Section 80CCD(1B)',
    description: 'NPS additional contribution',
    cap: 50000,
  },
  {
    key: 'section24b',
    section: '24(b)',
    name: 'Section 24(b)',
    description: 'Home loan interest deduction',
    cap: 200000,
  },
  {
    key: 'hra',
    section: 'HRA',
    name: 'HRA Exemption',
    description: 'House Rent Allowance (enter your known exemption)',
    cap: null,
  },
  {
    key: 'section80TTA',
    section: '80TTA',
    name: 'Section 80TTA',
    description: 'Savings account interest',
    cap: 10000,
  },
];

const PRESET_LABELS: { key: 'basic' | 'home_loan' | 'max'; label: string }[] = [
  { key: 'basic', label: 'Salaried basics' },
  { key: 'home_loan', label: 'With home loan' },
  { key: 'max', label: 'Max deductions' },
];

export function DeductionsPanel() {
  const { deductions, setDeduction, applyPreset, resetDeductions } = useCalculatorStore();
  const [expandedKey, setExpandedKey] = useState<keyof OldRegimeDeductions | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const totalDeductions = SECTIONS.reduce((sum, s) => {
    const claimed = deductions[s.key];
    const allowed = s.cap !== null ? Math.min(claimed, s.cap) : claimed;
    return sum + (allowed > 0 ? allowed : 0);
  }, 0);

  const handlePreset = (preset: 'basic' | 'home_loan' | 'max') => {
    applyPreset(preset);
    setActivePreset(preset);
    setExpandedKey(null);
  };

  const handleReset = () => {
    resetDeductions();
    setActivePreset(null);
    setExpandedKey(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2
          className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
          Deductions (Old Regime)
        </h2>
        <div className="flex items-center gap-3">
          {totalDeductions > 0 && (
            <span className="font-mono text-sm font-bold" style={{ color: 'var(--gold)' }}>
              Rs {formatIndianNumber(totalDeductions)}
            </span>
          )}
          {totalDeductions > 0 && (
            <button
              onClick={handleReset}
              className="text-xs cursor-pointer transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESET_LABELS.map((preset) => (
          <button
            key={preset.key}
            onClick={() => handlePreset(preset.key)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer"
            style={{
              background: activePreset === preset.key ? 'var(--bg-hover)' : 'var(--bg-surface)',
              color: activePreset === preset.key ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: activePreset === preset.key ? '1px solid var(--gold)' : 'var(--border-subtle)',
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Accordion sections */}
      <div className="space-y-1">
        {SECTIONS.map((section) => {
          const value = deductions[section.key];
          const isExpanded = expandedKey === section.key;
          const isCapped = section.cap !== null && value > section.cap;
          const displayValue = section.cap !== null ? Math.min(value, section.cap) : value;

          return (
            <div key={section.key}>
              {/* Collapsed header */}
              <button
                onClick={() => setExpandedKey(isExpanded ? null : section.key)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-150"
                style={{
                  background: isExpanded ? 'var(--bg-surface)' : 'transparent',
                  borderLeft: isExpanded ? '2px solid var(--gold)' : '2px solid transparent',
                }}
              >
                <div className="flex items-center gap-3 text-left">
                  <span
                    className="text-xs transition-transform duration-200"
                    style={{
                      color: 'var(--text-muted)',
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}
                  >
                    &#9654;
                  </span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {section.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {section.description}
                    </p>
                  </div>
                </div>
                <span
                  className="font-mono text-sm whitespace-nowrap"
                  style={{ color: displayValue > 0 ? 'var(--gold)' : 'var(--text-muted)' }}
                >
                  {displayValue > 0 ? `Rs ${formatIndianNumber(displayValue)}` : '—'}
                </span>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 ml-8">
                      <DeductionInput
                        value={value}
                        cap={section.cap}
                        onChange={(v) => {
                          setDeduction(section.key, v);
                          setActivePreset(null);
                        }}
                      />
                      {isCapped && (
                        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                          Capped at Rs {formatIndianNumber(section.cap!)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DeductionInput({
  value,
  cap,
  onChange,
}: {
  value: number;
  cap: number | null;
  onChange: (value: number) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    onChange(raw === '' ? 0 : parseInt(raw, 10));
  };

  const capPct = cap !== null && cap > 0 ? Math.min((value / cap) * 100, 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            Rs
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={value === 0 ? '' : formatIndianNumber(value)}
            onChange={handleChange}
            placeholder="0"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg font-mono text-sm outline-none transition-colors"
            style={{
              background: 'var(--bg-void)',
              color: 'var(--text-primary)',
              border: 'var(--border-subtle)',
            }}
          />
        </div>
        {cap !== null && (
          <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
            / Rs {formatIndianNumber(cap)}
          </span>
        )}
      </div>

      {/* Cap progress bar */}
      {cap !== null && (
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--bg-hover)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: capPct >= 100 ? 'var(--gold)' : 'var(--saffron-light, var(--gold))' }}
            initial={{ width: 0 }}
            animate={{ width: `${capPct}%` }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      )}
    </div>
  );
}
