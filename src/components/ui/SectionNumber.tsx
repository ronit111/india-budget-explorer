interface SectionNumberProps {
  number: number;
  className?: string;
}

/**
 * Subtle numbered section marker (01, 02, 03...) for narrative progression.
 * Positioned top-left of each homepage composition.
 */
export function SectionNumber({ number, className = '' }: SectionNumberProps) {
  return (
    <span
      className={`text-section-num select-none ${className}`}
      aria-hidden
    >
      {String(number).padStart(2, '0')}
    </span>
  );
}
