import { ALL_STATE_CODES } from '../../lib/stateMapping.ts';
import { usePersonalizationStore } from '../../store/personalizationStore.ts';

// Partition into States (28) and UTs (8), sorted alphabetically
const UT_CODES = new Set(['AN', 'CH', 'DN', 'DL', 'JK', 'LA', 'LD', 'PY']);

const entries = Object.entries(ALL_STATE_CODES).sort((a, b) => a[1].localeCompare(b[1]));
const states = entries.filter(([code]) => !UT_CODES.has(code));
const uts = entries.filter(([code]) => UT_CODES.has(code));

interface StateSelectorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  /** Controlled value — overrides personalization store */
  value?: string | null;
  /** Controlled onChange — overrides personalization store */
  onChange?: (stateId: string | null) => void;
}

export function StateSelector({ className = '', size = 'md', showLabel = true, value, onChange }: StateSelectorProps) {
  const store = usePersonalizationStore();
  const selectedStateId = value !== undefined ? value : store.selectedStateId;
  const setState = onChange ?? store.setState;

  const sizeClasses = {
    sm: 'text-sm px-2 py-1.5',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2.5',
  };

  return (
    <div className={className}>
      {showLabel && (
        <label
          htmlFor="state-selector"
          className="block text-xs font-medium uppercase tracking-wider mb-1.5"
          style={{ color: 'var(--text-muted)' }}
        >
          Your State / UT
        </label>
      )}
      <select
        id="state-selector"
        value={selectedStateId ?? ''}
        onChange={(e) => setState(e.target.value || null)}
        className={`w-full rounded-lg font-medium cursor-pointer transition-colors ${sizeClasses[size]}`}
        style={{
          background: 'var(--bg-raised)',
          border: 'var(--border-subtle)',
          color: selectedStateId ? 'var(--text-primary)' : 'var(--text-muted)',
          outline: 'none',
        }}
      >
        <option value="">Select your state</option>
        <optgroup label="States">
          {states.map(([code, name]) => (
            <option key={code} value={code}>
              {name} ({code})
            </option>
          ))}
        </optgroup>
        <optgroup label="Union Territories">
          {uts.map(([code, name]) => (
            <option key={code} value={code}>
              {name} ({code})
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}
