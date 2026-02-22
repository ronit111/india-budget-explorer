import type { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ChartContainer({ title, subtitle, children, className = '' }: ChartContainerProps) {
  return (
    <div className={`bg-[var(--color-bg-surface)] rounded-2xl border border-[rgba(255,255,255,0.05)] overflow-hidden ${className}`}>
      <div className="px-6 pt-6 pb-2">
        <h3 className="text-lg md:text-xl font-semibold text-[var(--color-text-primary)]">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{subtitle}</p>
        )}
      </div>
      <div className="px-4 pb-6">{children}</div>
    </div>
  );
}
