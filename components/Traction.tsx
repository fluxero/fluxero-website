import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const G = '#3B82F6';
const G2 = '#60A5FA';
const INK = '#0F172A';

const CountUp: React.FC<{ to: number; decimals?: number; prefix?: string; suffix?: string }> = ({ to, decimals = 0, prefix = '', suffix = '' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const dur = 2000;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = p < 0.5 ? 4*p*p*p : 1 - Math.pow(-2*p+2,3)/2;
          setVal(eased * to);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref} className="counter font-display font-black"
      style={{ fontSize: 'clamp(30px, 7vw, 72px)', lineHeight: 1, color: G, textShadow: '0 0 40px rgba(59,130,246,0.25)' }}>
      {prefix}{val.toFixed(decimals)}{suffix}
    </span>
  );
};

const milestones = [
  { done: true,  label: 'Physics-based digital twin built & lab-tested' },
  { done: true,  label: 'NGSPICE simulation backend validated' },
  { done: true,  label: 'Unity 3D frontend integrated with simulation' },
  { done: true,  label: 'Pilot land + office secured at Barclays Eagle Labs' },
  { done: true,  label: 'Backed by Barclays Eagle Labs & Durham Venture School' },
  { done: true,  label: 'Academic partnership with Durham University' },
  { done: false, label: 'Lincoln pilot: first H₂ production' },
  { done: false, label: 'First commercial blueprint license signed' },
  { done: false, label: 'Series A raise' },
];

const partners = [
  { abbr: 'BEL', name: 'Barclays Eagle Labs',   role: 'Strategic partner · Innovation accelerator', note: 'Office + pilot land at Lincoln location', highlight: true  },
  { abbr: 'DVS', name: 'Durham Venture School',  role: 'Founding cohort · Investor community · Commercial mentorship', note: null, highlight: false },
  { abbr: 'DU',  name: 'Durham University',      role: 'Academic partnership · Technical advisory',  note: 'UKRI/Innovate UK grant expertise · National Grid connections', highlight: false },
];

export const Traction: React.FC = () => (
  <section className="py-28 relative overflow-hidden" style={{ background: '#0F172A' }}>
    <div className="absolute inset-0 pointer-events-none opacity-[0.018]"
      style={{ backgroundImage: 'repeating-linear-gradient(45deg,rgba(59,130,246,1) 0,rgba(59,130,246,1) 1px,transparent 0,transparent 50%)', backgroundSize: '40px 40px' }} />

    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
      <div className="flex items-center gap-4 mb-16">
        <div className="w-8 h-px" style={{ background: G }} />
        <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: G }}>Traction & Proof Points</span>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {[
          { pre: '',  to: 55,  d: 0, suf: '%',  label: 'CAPEX saved on panels',        sub: '£360/kWp second-life vs £800/kWp new' },
          { pre: '',  to: 9,   d: 0, suf: ' kg', label: 'CO₂ avoided per kg H₂',       sub: 'vs grey H₂ from steam methane reforming · IPCC' },
          { pre: '£', to: 8.5, d: 1, suf: '',    label: 'Per kg green H₂ market price', sub: 'UK 2024–25 average contract price' },
          { pre: '',  to: 72,  d: 0, suf: '%',   label: 'Max electrolyser efficiency',  sub: 'PEM stack at optimal operating point · IEA' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{ background: '#1E293B', border: '1px solid rgba(59,130,246,0.08)', borderRadius: 12, padding: '26px 22px' }}>
            <CountUp to={s.to} decimals={s.d} prefix={s.pre} suffix={s.suf} />
            <p className="font-display font-bold text-cream text-sm mt-3 mb-1 leading-snug">{s.label}</p>
            <p className="font-mono text-steel text-xs leading-relaxed">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Milestones */}
        <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h3 className="font-display font-black text-cream mb-2" style={{ fontSize: 'clamp(24px, 3vw, 36px)', lineHeight: 0.95 }}>
            BUILT.<br/>
            <span style={{ background: 'linear-gradient(135deg,#3B82F6,#60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              NOT PITCHED.
            </span>
          </h3>
          <p className="font-body text-mist text-sm mb-8 font-light">Real engineering progress, confirmed milestones.</p>

          <div className="space-y-2">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg px-4 py-3"
                style={{ background: m.done ? 'rgba(59,130,246,0.05)' : 'transparent', border: `1px solid ${m.done ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)'}` }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: m.done ? G : 'transparent', border: `1px solid ${m.done ? G : '#64748B'}` }}>
                  {m.done && <span style={{ fontSize: 9, color: INK, fontWeight: 800 }}>✓</span>}
                </div>
                <span className="font-body text-sm flex-1" style={{ color: m.done ? '#F0EBE0' : '#64748B' }}>{m.label}</span>
                {!m.done && (
                  <span className="font-mono text-xs px-2 py-0.5 rounded flex-shrink-0"
                    style={{ color: G2, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)' }}>
                    NEXT
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Partners */}
        <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h3 className="font-display font-black text-cream mb-2" style={{ fontSize: 'clamp(24px, 3vw, 36px)', lineHeight: 0.95 }}>
            BACKED &<br/>
            <span style={{ background: 'linear-gradient(135deg,#3B82F6,#60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              SUPPORTED BY.
            </span>
          </h3>
          <p className="font-body text-mist text-sm mb-8 font-light">Institutions with access, expertise, and networks.</p>

          <div className="space-y-3">
            {partners.map((p, i) => (
              <div key={i} style={{ background: p.highlight ? 'rgba(59,130,246,0.05)' : '#1E293B', border: `1px solid ${p.highlight ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)'}`, borderRadius: 10, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
                  <span className="font-mono text-xs font-bold" style={{ color: G }}>{p.abbr}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-semibold text-cream text-sm">{p.name}</p>
                  <p className="font-mono text-steel text-xs mt-0.5 leading-relaxed">{p.role}</p>
                  {p.note && <p className="font-mono text-xs mt-1" style={{ color: 'rgba(59,130,246,0.7)' }}>{p.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
