import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const REPO = 'ronit111/indian-data-project';

export function FeedbackButton() {
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    const page = location.pathname || '/';
    const title = encodeURIComponent(`Data issue on ${page}`);
    const body = encodeURIComponent(
      `Page: ${page}\n\nWhat looks wrong?\n\n\nWhat should it say instead? (if you know)\n\n`
    );
    window.open(
      `https://github.com/${REPO}/issues/new?title=${title}&body=${body}`,
      '_blank',
      'noopener'
    );
  };

  return (
    <div className="fixed right-4 bottom-20 md:bottom-6 z-40">
      <div className="relative">
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{
                background: 'var(--bg-raised)',
                color: 'var(--text-primary)',
                border: 'var(--border-subtle)',
              }}
            >
              Report incorrect data
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          onClick={handleClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 shadow-lg"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-muted)',
          }}
          aria-label="Report incorrect data"
          title="Report incorrect data"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
