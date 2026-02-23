import { motion } from 'framer-motion';

interface SectionNumberProps {
  number: number;
  className?: string;
  isVisible?: boolean;
}

/**
 * Subtle numbered section marker (01, 02, 03...) for narrative progression.
 * Slides up and fades in when the section becomes visible.
 */
export function SectionNumber({ number, className = '', isVisible = true }: SectionNumberProps) {
  return (
    <motion.span
      className={`text-section-num select-none inline-block ${className}`}
      aria-hidden
      initial={{ opacity: 0, y: 8 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {String(number).padStart(2, '0')}
    </motion.span>
  );
}
