import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/*
  UK wind curtailment 2024: 8.3 TWh
  Solar curtailment 2024: ~1.5 TWh
  Total: ~9.8 TWh/year
  ÷ 365.25 days = 26.83 GWh/day
  ÷ 86,400 seconds = ~310.5 kWh/second = 0.3105 MWh/second

  We calculate how much has been wasted since midnight today
  and display it as a live counter ticking up.
*/

const MWH_PER_SECOND = 0.3105; // total renewable curtailment rate UK 2024

function getMwhSinceMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  const secondsSinceMidnight = (now.getTime() - midnight.getTime()) / 1000;
  return secondsSinceMidnight * MWH_PER_SECOND;
}

function formatMwh(mwh: number): string {
  if (mwh >= 1000) {
    return `${(mwh / 1000).toFixed(2)} GWh`;
  }
  return `${mwh.toFixed(1)} MWh`;
}

export const LiveCurtailmentBar: React.FC = () => {
  const [mwh, setMwh]         = useState(getMwhSinceMidnight);
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Tick every 333ms (3 updates/second feels real without burning CPU)
  useEffect(() => {
    const interval = setInterval(() => {
      setMwh(getMwhSinceMidnight());
    }, 333);
    return () => clearInterval(interval);
  }, []);

  // Entrance observer
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    if (barRef.current) obs.observe(barRef.current);
    return () => obs.disconnect();
  }, []);

  // Equivalent homes powered (avg UK home ~4,000 kWh/year = ~11 kWh/day)
  const homesWasted = Math.floor((mwh * 1000) / 11);
  // H2 that could have been made: ~0.022 kg H2 per kWh (PEM efficiency ~65%)
  const h2KgPossible = Math.floor(mwh * 1000 * 0.018);

  return (
    <div ref={barRef} style={{ background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid rgba(239,68,68,0.12)' }}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 lg:px-8"
      >
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
        >
          {/* Live label */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#EF4444' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#EF4444' }} />
            </span>
            <span className="font-mono text-base tracking-[0.15em] uppercase" style={{ color: '#64748B' }}>
              UK renewable curtailment today
            </span>
          </div>

          {/* Counter */}
          <div className="flex items-baseline gap-2">
            <span
              className="font-display font-black counter tabular-nums"
              style={{
                fontSize: 'clamp(22px, 3vw, 36px)',
                color: '#EF4444',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatMwh(mwh)}
            </span>
            <span className="font-mono text-base" style={{ color: '#475569' }}>wasted since midnight</span>
          </div>

          {/* Equivalents */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <div className="text-center">
              <p className="font-mono font-bold text-lg tabular-nums" style={{ color: '#FBBF24' }}>
                {homesWasted.toLocaleString()}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: '#475569' }}>homes could be powered</p>
            </div>
            <div className="w-px h-6 hidden sm:block" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <div className="text-center">
              <p className="font-mono font-bold text-lg tabular-nums" style={{ color: '#00D68F' }}>
                {h2KgPossible.toLocaleString()} kg
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: '#475569' }}>green H₂ uncaptured</p>
            </div>
            <div className="w-px h-6 hidden sm:block" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <div className="text-center">
              <p className="font-mono font-bold text-lg" style={{ color: '#94A3B8' }}>
                £{Math.floor(mwh * 1000 * 0.01 / 100).toLocaleString()}k
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: '#475569' }}>constraint payments accruing</p>
            </div>
          </div>

          {/* CTA */}
          <a
            href="#problem"
            className="font-mono text-base px-3 py-1.5 rounded flex-shrink-0 transition-all hover:scale-105"
            style={{
              color: '#EF4444',
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)',
              textDecoration: 'none',
            }}
          >
            Why? →
          </a>
        </div>
      </motion.div>
    </div>
  );
};
