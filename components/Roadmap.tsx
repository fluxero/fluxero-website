import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const phases = [
  {
    phase: 'COMPLETE',
    label: 'Phase 1',
    title: 'Proof of Concept',
    year: '2025',
    color: '#00D68F',
    done: true,
    items: [
      'NGSPICE simulation engine',
      'Unity digital twin frontend',
      'PVGIS + NOABL data integration',
      'Second-life solar panel supply secured',
    ],
  },
  {
    phase: 'NOW',
    label: 'Phase 2',
    title: 'Lincoln Pilot',
    year: '2026',
    color: '#00E5B8',
    done: false,
    current: true,
    items: [
      'Barclays Eagle Labs Lincoln: pilot land + office secured',
      '200–400kW mixed panel array',
      'Lab-test digital twin accuracy',
      'First kg of green H₂ produced',
    ],
  },
  {
    phase: 'NEXT',
    label: 'Phase 3',
    title: 'First Licensees',
    year: '2026',
    color: '#0099CC',
    done: false,
    items: [
      'Blueprint License product live',
      'Digital twin as deployable SaaS',
      'First commercial H₂ offtake',
      'Series A raise',
    ],
  },
  {
    phase: 'FUTURE',
    label: 'Phase 4',
    title: 'Global Rollout',
    year: '2027+',
    color: '#A8A3B3',
    done: false,
    items: [
      '100+ licensed sites target',
      'International market entry',
      'In-house electrolyser manufacturing',
      'IPO / strategic exit',
    ],
  },
];

export const Roadmap: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: '#0D0C0F' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-px" style={{ background: "#00D68F" }} />
          <span className="font-mono text-xs text-green tracking-[0.25em] uppercase">Roadmap</span>
        </div>

        <div className="flex items-start justify-between mb-10">
          <h2
            className="font-display font-black text-cream"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 0.95 }}
          >
            THE PATH<br />
            <span className="text-green-gradient">TO SCALE.</span>
          </h2>
          <div className="flex items-center gap-2 text-steel text-sm font-mono">
            <span>← scroll</span>
          </div>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div ref={scrollRef} className="h-scroll px-6 lg:px-8 pb-6">
        <div className="flex gap-5 w-max max-w-none pl-0" style={{ paddingRight: 48 }}>
          {/* Connecting line */}
          <div className="absolute top-[50%] left-0 right-0 h-px pointer-events-none hidden md:block" style={{ background: "rgba(0,214,143,0.1)" }} />

          {phases.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                width: 260,
                background: p.current ? 'rgba(0,214,143,0.05)' : '#131116',
                border: `1px solid ${p.current ? 'rgba(0,214,143,0.2)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 14,
                padding: '28px 24px',
                flexShrink: 0,
                position: 'relative',
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-6 right-6 h-px rounded-full"
                style={{ background: p.color, opacity: p.done || p.current ? 1 : 0.25 }} />

              {/* Phase badge */}
              <div className="flex items-center justify-between mb-5">
                <span
                  className="font-mono text-xs px-2.5 py-1 rounded tracking-wider"
                  style={{
                    color: p.color,
                    background: `rgba(0,214,143,0.07)`,
                    border: `1px solid ${p.color}30`,
                  }}
                >
                  {p.phase}
                </span>
                {p.done && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: '#00D68F', boxShadow: '0 0 10px rgba(0,214,143,0.4)' }}>
                    <span className="font-bold" style={{ fontSize: 12, color: "#070608" }}>✓</span>
                  </div>
                )}
                {p.current && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#00D68F" }} />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: "#00D68F" }} />
                  </span>
                )}
              </div>

              <div className="font-mono text-xs text-steel mb-2">{p.year}</div>
              <h4 className="font-display font-black text-cream text-xl mb-1">{p.label}</h4>
              <p className="font-body text-mist font-light mb-6">{p.title}</p>

              <div className="space-y-2.5 border-t border-white/5 pt-5">
                {p.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                      style={{ background: p.done ? p.color : p.current ? p.color : '#64748B' }} />
                    <span className="font-body text-xs text-mist leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
