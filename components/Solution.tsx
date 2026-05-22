import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const FlowDiagram: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let p = 0;
        const id = setInterval(() => {
          p = Math.min(p + 1, 100);
          setProgress(p);
          if (p >= 100) clearInterval(id);
        }, 25);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const nodes = [
    { id: 'solar', icon: '☀', label: 'Solar', sub: 'Curtailed PV', x: 60, y: 80, color: '#FBBF24' },
    { id: 'wind',  icon: '⟳', label: 'Wind',  sub: 'Off-peak',    x: 60, y: 200, color: '#94A3B8' },
    { id: 'hydro', icon: '≋', label: 'Hydro', sub: 'Spill',       x: 60, y: 320, color: '#00D0E8' },
    { id: 'smhp',  icon: '⬡', label: 'SMHP',  sub: 'Electrolyser', x: 260, y: 200, color: '#00D68F' },
    { id: 'h2',    icon: 'H₂', label: 'Green H₂', sub: '£8–12/kg', x: 460, y: 200, color: '#00E5B8' },
  ];

  const paths = [
    { from: [60,80],  to: [260,200] },
    { from: [60,200], to: [260,200] },
    { from: [60,320], to: [260,200] },
    { from: [260,200],to: [460,200] },
  ];

  const pctToOffset = (pct: number, len: number) => len * (1 - pct / 100);

  return (
    <div ref={ref} className="relative">
      <svg width="100%" viewBox="0 0 540 400" className="w-full max-w-xl mx-auto overflow-visible">
        <defs>
          <marker id="arrowAmber" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="rgba(0,214,143,0.6)" />
          </marker>
        </defs>

        {/* Connection lines */}
        {paths.map((p, i) => {
          const dx = p.to[0] - p.from[0], dy = p.to[1] - p.from[1];
          const len = Math.sqrt(dx*dx + dy*dy);
          const delay = i * 18;
          const localPct = Math.max(0, Math.min(100, (progress - delay) * 1.4));
          return (
            <g key={i}>
              {/* Base line */}
              <line x1={p.from[0]+30} y1={p.from[1]} x2={p.to[0]-30} y2={p.to[1]}
                stroke="rgba(0,214,143,0.1)" strokeWidth={1.5} strokeDasharray="4 4" />
              {/* Animated fill */}
              <line x1={p.from[0]+30} y1={p.from[1]} x2={p.to[0]-30} y2={p.to[1]}
                stroke="rgba(0,214,143,0.7)" strokeWidth={1.5}
                strokeDasharray={len} strokeDashoffset={pctToOffset(localPct, len)}
                markerEnd="url(#arrowAmber)" />
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(n => {
          const isSmhp = n.id === 'smhp';
          const isH2   = n.id === 'h2';
          const size = isSmhp ? 44 : 32;
          return (
            <g key={n.id}>
              <circle
                cx={n.x} cy={n.y} r={size}
                fill={`rgba(${isSmhp ? '0,214,143' : '255,255,255'},0.04)`}
                stroke={n.color}
                strokeWidth={isSmhp ? 1.5 : 1}
                opacity={isSmhp ? 1 : 0.6}
              />
              {isSmhp && (
                <circle cx={n.x} cy={n.y} r={size+12} fill="none"
                  stroke="rgba(0,214,143,0.08)" strokeWidth={1} strokeDasharray="4 4">
                  <animateTransform attributeName="transform" type="rotate"
                    from={`0 ${n.x} ${n.y}`} to={`360 ${n.x} ${n.y}`} dur="20s" repeatCount="indefinite" />
                </circle>
              )}
              <text x={n.x} y={n.y+1} textAnchor="middle" dominantBaseline="middle"
                fontSize={isSmhp ? 18 : 14} fill={n.color} fontFamily="IBM Plex Mono,monospace" fontWeight="700">
                {n.icon}
              </text>
              <text x={n.x} y={n.y+size+14} textAnchor="middle" fontSize={11}
                fill="#F0EBE0" fontFamily="IBM Plex Sans Condensed,sans-serif" fontWeight="700" letterSpacing="1">
                {n.label}
              </text>
              <text x={n.x} y={n.y+size+26} textAnchor="middle" fontSize={9}
                fill="#64748B" fontFamily="IBM Plex Mono,monospace">
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const features = [
  {
    num: '01',
    title: 'Behind-the-meter',
    body: 'SMHPs connect directly to the energy source — no grid connection needed. Bypasses 10–15 year queue for grid upgrades entirely.',
    color: '#00D68F',
  },
  {
    num: '02',
    title: 'Wind, Solar & Hydro ready',
    body: 'Handles the chaotic voltage profiles of curtailed wind, mismatched solar, and variable hydro head. Standard electrolysers demand steady power — ours don\'t.',
    color: '#00E5B8',
  },
  {
    num: '03',
    title: 'Digital-twin first',
    body: 'Every site gets a physics-based digital twin before anything is built. Real PVGIS irradiance data. Real NOABL wind speeds. Real electrolyser efficiency curves.',
    color: '#00D0E8',
  },
];

export const Solution: React.FC = () => {
  return (
    <section id="solution" className="py-28 relative overflow-hidden" style={{ background: '#0D0C0F' }}>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,214,143,0.4) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-px" style={{ background: '#00D68F' }} />
          <span className="font-mono text-base tracking-[0.25em] uppercase" style={{ color: '#00D68F' }}>The Solution</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-display font-black text-cream mb-6"
              style={{ fontSize: 'clamp(38px, 4vw, 64px)', lineHeight: 0.95 }}
            >
              SMALL MODULAR<br />
              <span className="text-green-gradient">HYDROGEN PLANTS</span>
            </h2>
            <p className="font-body text-mist text-2xl leading-relaxed mb-8 font-light">
              Containerised electrolysis units that plug directly into curtailed wind, solar, and hydro sources.
              We turn the grid's problem — too much clean energy — into our feedstock.
            </p>
            <a href="#tech"
              className="inline-flex items-center gap-2 font-body font-semibold text-lg tracking-wide group"
              style={{ color: '#00D68F' }}>
              See the design engine
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              background: 'rgba(0,214,143,0.03)',
              border: '1px solid rgba(0,214,143,0.08)',
              borderRadius: 16,
              padding: '32px 24px',
            }}
          >
            <FlowDiagram />
          </motion.div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                background: '#131116',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 12,
                padding: '40px',
              }}
            >
              <div className="font-mono text-base text-steel mb-6 tracking-widest">{f.num}</div>
              <div className="w-8 h-0.5 mb-6 rounded-full" style={{ background: f.color }} />
              <h4 className="font-display font-bold text-cream text-xl mb-3">{f.title}</h4>
              <p className="font-body text-mist text-xl leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
