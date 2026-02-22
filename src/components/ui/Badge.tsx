import type { ReactNode } from 'react';

type BadgeVariant = 'positive' | 'negative' | 'neutral' | 'saffron';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  positive: 'bg-emerald-500/15 text-emerald-400',
  negative: 'bg-red-500/15 text-red-400',
  neutral: 'bg-white/8 text-[var(--text-secondary)]',
  saffron: 'bg-[var(--saffron-dim)] text-[var(--saffron)]',
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function YoYBadge({ value }: { value: number }) {
  const variant: BadgeVariant = value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral';
  const arrow = value > 0 ? '\u2191' : value < 0 ? '\u2193' : '';
  return (
    <Badge variant={variant}>
      {arrow} {Math.abs(value).toFixed(1)}%
    </Badge>
  );
}
