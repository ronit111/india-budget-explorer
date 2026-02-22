import { motion } from 'framer-motion';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`inline-flex rounded-lg p-1 ${className}`}
      style={{ background: 'var(--bg-raised)' }}
      role="radiogroup"
    >
      {options.map((option) => (
        <button
          key={option.value}
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className="relative px-4 py-2 text-sm font-medium rounded-md transition-colors"
          style={{
            color: value === option.value ? 'var(--text-primary)' : 'var(--text-muted)',
          }}
        >
          {value === option.value && (
            <motion.div
              layoutId="segment-indicator"
              className="absolute inset-0 rounded-md"
              style={{ background: 'var(--bg-hover)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
