import React from 'react';
import { motion } from 'framer-motion';

const features = [
  { icon: '◉', label: 'Every UK postcode',       sub: 'PVGIS & NOABL data baked in' },
  { icon: '⟆', label: 'Weibull wind physics',    sub: 'IEC 61400 power curve integration' },
  { icon: '☀', label: 'Solar irradiance model',   sub: 'Monthly kWh/m² for 40+ postcodes' },
  { icon: '≋', label: 'Real efficiency curves',   sub: 'Alkaline & PEM part-load modelled' },
  { icon: '⬡', label: 'Auto electrolyser sizing', sub: 'Prevents oversizing waste' },
  { icon: '◈', label: 'Unity export',             sub: 'JSON config for 3D site planner' },
];

export const Technology: React.FC = () => {

  return (
    <section id="tech" className="py-28 relative" style={{ background: '#131116' }}>
      {/* Top line accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,214,143,0.4), transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-px" style={{ background: '#00D68F' }} />
          <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: '#00D68F' }}>Fluxero Design Engine</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-16">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-display font-black text-cream mb-6"
              style={{ fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 0.95 }}
            >
              THE DIGITAL TWIN<br />
              <span className="text-green-gradient">THAT RUNS FIRST.</span>
            </h2>
            <p className="font-body text-mist text-lg leading-relaxed mb-8 font-light">
              Enter your postcode, energy source (wind, solar, or hydro), panel or turbine specs.
              The engine returns projected H₂ output, payback period, and annual revenue —
              using physics, not assumptions.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-10">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    background: 'rgba(13,12,15,0.6)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 8,
                    padding: '14px 16px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {}}
                >
                  <div className="font-mono text-base mb-2" style={{ color: '#00D68F' }}>{f.icon}</div>
                  <p className="font-display font-bold text-cream text-sm">{f.label}</p>
                  <p className="font-mono text-steel text-xs mt-0.5">{f.sub}</p>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => {}}
              className="mag-btn font-body font-semibold px-8 py-4 rounded text-base tracking-wide transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00A86B, #00D68F)',
                color: '#F0EBE0',
                boxShadow: '0 0 30px rgba(0,214,143,0.2)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Open the H₂ Design Engine →
            </button>
          </motion.div>

          {/* Right — static dashboard teaser */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            onClick={() => {}}
            style={{
              background: '#0D0C0F',
              border: '1px solid rgba(0,214,143,0.1)',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 0 60px rgba(0,214,143,0.04)',
              cursor: 'pointer',
            }}
          >
            {/* Window chrome */}
            <div style={{
              background: '#131116',
              borderBottom: '1px solid rgba(0,214,143,0.06)',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div className="flex items-center gap-2">
                {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
                  <div key={i} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.7 }} />
                ))}
                <span className="font-mono text-xs text-steel ml-3">FLUXERO_DESIGN_ENGINE · v2.5</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#00D68F' }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#00D68F' }} />
                </span>
                <span className="font-mono text-xs" style={{ color: '#00D68F' }}>LIVE</span>
              </div>
            </div>

            {/* Mock result screen */}
            <div className="p-6">
              <p className="font-mono text-xs text-steel mb-4">// example: DH1 · 400 panels · 400W · Alkaline 200kW</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { l: 'H₂ PER YEAR', v: '4,526 kg',  c: '#00D68F' },
                  { l: 'ANNUAL REV',  v: '£38,471',    c: '#00D68F' },
                  { l: 'PAYBACK',     v: '8.3 yrs',    c: '#00E5B8' },
                  { l: 'CO₂ AVOIDED', v: '40.7 t/yr',  c: '#00D0E8' },
                ].map(s => (
                  <div key={s.l} style={{ background: '#131116', borderRadius: 8, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="font-mono text-xs text-steel mb-1">{s.l}</p>
                    <p className="font-mono font-bold text-lg" style={{ color: s.c }}>{s.v}</p>
                  </div>
                ))}
              </div>

              {/* Bar chart mockup */}
              <div style={{ background: '#131116', borderRadius: 8, padding: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="font-mono text-xs text-steel mb-3">Monthly H₂ Output (kg)</p>
                <div className="flex items-end gap-1.5 h-16">
                  {[18, 22, 42, 68, 92, 98, 96, 88, 62, 38, 20, 14].map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${v}%`,
                        background: `rgba(0,214,143,${0.25 + (v / 100) * 0.55})`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map(m => (
                    <span key={m} className="flex-1 text-center font-mono text-[8px] text-steel">{m}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 py-3 rounded"
                style={{ border: '1px solid rgba(0,214,143,0.2)', background: 'rgba(0,214,143,0.04)' }}>
                <span className="font-mono text-xs" style={{ color: '#00D68F' }}>Click to run for your site →</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
