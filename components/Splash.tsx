import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const RING_SIZES = [220, 380, 550, 720];

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

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#060B18' }}
    >
      {/* Animated concentric rings */}
      {RING_SIZES.map((size, i) => (
        <motion.div
          key={size}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: size,
            height: size,
            border: `1px solid rgba(59,130,246,${0.14 - i * 0.025})`,
          }}
          animate={{
            scale:   [1, 1.07, 1],
            opacity: [0.35, 0.9, 0.35],
          }}
          transition={{
            duration: 3.5 + i * 0.7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.45,
          }}
        />
      ))}

      {/* Core radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 mb-10"
      >
        <img
          src="./logo.png"
          alt="Fluxero"
          className="h-14 w-auto object-contain"
          onError={e => {
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
            const el = document.createElement('div');
            el.style.cssText =
              'font-family:"Barlow Condensed",sans-serif;font-weight:900;font-size:32px;letter-spacing:0.28em;color:#F0EBE0;';
            el.textContent = 'FLUXERO';
            img.parentElement?.appendChild(el);
          }}
        />
      </motion.div>

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
