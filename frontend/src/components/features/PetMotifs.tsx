"use client";

import { motion } from "framer-motion";

export function GentlePawIcon({ className = "w-4 h-4 text-primary" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className} 
      aria-hidden="true"
    >
      {/* Central Pad */}
      <path d="M12 11c-2.8 0-4.5 1.7-4.5 3.8 0 2.2 1.9 3.7 4.5 3.7s4.5-1.5 4.5-3.7c0-2.1-1.7-3.8-4.5-3.8z" />
      {/* Toe 1 */}
      <circle cx="7" cy="8.5" r="2" />
      {/* Toe 2 */}
      <circle cx="10.5" cy="5.8" r="2.1" />
      {/* Toe 3 */}
      <circle cx="14" cy="5.8" r="2.1" />
      {/* Toe 4 */}
      <circle cx="17.5" cy="8.5" r="2" />
    </svg>
  );
}

export function TailWagStroke({ className = "w-28 h-8 text-amberBrand/60" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <motion.path
        d="M6 24 C 30 6, 60 30, 95 10 C 108 3, 114 8, 116 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />
    </svg>
  );
}

export function FloatingSpaBubble({ 
  className = "w-6 h-6", 
  delay = 0,
  size
}: { 
  className?: string; 
  delay?: number;
  size?: number;
}) {
  const sizeStyle = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 0.7, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={sizeStyle}
      className={`rounded-full bg-gradient-to-tr from-amber-200/50 to-white/80 border border-white/60 backdrop-blur-xs pointer-events-none shadow-xs ${className}`}
      aria-hidden="true"
    />
  );
}

