interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}

export function Skeleton({ width, height = 20, className = '', rounded = false }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${rounded ? 'rounded-full' : ''} ${className}`}
      style={{ width, height }}
      aria-hidden
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonChart({ height = 400, className = '' }: { height?: number; className?: string }) {
  return (
    <div className={className}>
      <Skeleton height={16} width={200} className="mb-2" />
      <Skeleton height={12} width={140} className="mb-6" />
      <Skeleton height={height} width="100%" />
    </div>
  );
}
