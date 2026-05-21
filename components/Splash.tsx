import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Splash: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 14 + 3;
      if (v >= 100) {
        v = 100;
        clearInterval(id);
        setPhase('done');
        setTimeout(onDone, 700);
      }
      setPct(Math.min(100, Math.round(v)));
    }, 70);
    return () => clearInterval(id);
  }, [onDone]);

  const wordmark = 'FLUXERO'.split('');

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#070608' }}
    >
      {/* Logo + Wordmark row */}
      <div className="relative z-10 flex flex-row items-center gap-4 mb-10">

        {/* Pulsing glow behind SVG */}
        <div className="relative flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl"
            style={{
              background:
                'radial-gradient(circle, rgba(0,214,143,0.3) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* SVG logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <svg
              viewBox="0 0 120 100"
              width="64"
              height="54"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block' }}
            >
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00C97A" />
                  <stop offset="100%" stopColor="#00BFA5" />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00BFA5" />
                  <stop offset="100%" stopColor="#0055CC" />
                </linearGradient>
              </defs>

              {/* Blob 1 — larger, left, green→teal */}
              <motion.path
                d="M 20 50 C 20 20, 55 10, 65 35 C 75 55, 60 80, 40 80 C 25 80, 20 70, 20 50 Z"
                fill="url(#grad1)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />

              {/* Blob 2 — smaller, right, teal→blue, overlapping */}
              <motion.path
                d="M 50 40 C 55 20, 80 25, 85 45 C 90 60, 75 75, 60 65 C 48 58, 45 55, 50 40 Z"
                fill="url(#grad2)"
                fillOpacity={0.85}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.85 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Wordmark — letter by letter */}
        <div
          className="flex flex-row items-center"
          style={{ gap: 0 }}
          aria-label="FLUXERO"
        >
          {wordmark.map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.06, duration: 0.4 }}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: '32px',
                letterSpacing: '0.2em',
                color: '#F0EBE0',
                display: 'inline-block',
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Status label */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative z-10 font-mono uppercase tracking-[0.38em] text-[11px] mb-5"
        style={{ color: 'rgba(96,165,250,0.5)' }}
      >
        {phase === 'done' ? 'Systems Ready' : 'Initializing'}
      </motion.p>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.7 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative z-10 w-52"
        style={{ height: 2 }}
      >
        {/* Track */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        />
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #1D4ED8, #3B82F6, #60A5FA)',
            boxShadow: '0 0 14px rgba(96,165,250,0.75)',
            transition: 'width 0.08s ease',
          }}
        />
        {/* Glowing tip */}
        <div
          style={{
            position: 'absolute',
            top: -3,
            left: `calc(${pct}% - 3px)`,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 0 10px rgba(255,255,255,0.9), 0 0 22px rgba(96,165,250,0.7)',
            transition: 'left 0.08s ease',
          }}
        />
      </motion.div>

      {/* Percentage counter */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 font-mono text-[11px] mt-4 tabular-nums"
        style={{ color: '#60A5FA', letterSpacing: '0.12em' }}
      >
        {pct}%
      </motion.p>
    </motion.div>
  );
};
