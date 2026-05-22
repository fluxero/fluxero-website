import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const G = '#00D68F';
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Countries with curtailment data — map country names to colors
const CURTAILMENT: Record<string, { color: string; twh: string; note: string }> = {
  'China': { color: 'rgba(220,38,38,0.75)', twh: '29.7 TWh', note: 'Largest globally · Xinjiang & Inner Mongolia' },
  'United States of America': { color: 'rgba(239,68,68,0.65)', twh: '14.2 TWh', note: 'CAISO & ERCOT grids · Texas wind curtailment' },
  'United Kingdom': { color: 'rgba(239,68,68,0.7)', twh: '8.3 TWh', note: '95% from Scotland · B6 bottleneck' },
  'India': { color: 'rgba(249,115,22,0.65)', twh: '8.1 TWh', note: 'Tamil Nadu & Rajasthan · Rapidly growing' },
  'Germany': { color: 'rgba(249,115,22,0.6)', twh: '6.1 TWh', note: 'North Sea wind · Grid congestion' },
  'Spain': { color: 'rgba(234,179,8,0.6)', twh: '3.8 TWh', note: 'Solar & wind · Iberian grid limits' },
  'Australia': { color: 'rgba(234,179,8,0.55)', twh: '4.2 TWh', note: 'Rooftop solar · AEMO constraints' },
};

const STATS = [
  { n: '470 TWh',  label: 'Renewable energy wasted globally per year',  src: 'IRENA 2024' },
  { n: '£393M',    label: 'Paid to UK generators to switch off in 2024', src: 'Electric Insights' },
  { n: '10 years', label: 'Average grid connection wait in the UK',      src: 'National Grid ESO' },
];

const WHY_POINTS = [
  {
    icon: '⚡',
    title: 'Generation outpaced transmission',
    body: 'Solar and wind capacity doubled in a decade. Grid infrastructure moves at government planning pace — 10–15 year lead times. The gap widens every year.',
  },
  {
    icon: '🗺',
    title: 'Energy is generated far from demand',
    body: "Scotland generates 40% of UK wind power. The cable connecting it to England is full. China's best renewables are 2,000km from its cities. Proximity doesn't help.",
  },
  {
    icon: '🔋',
    title: "Storage alone doesn't solve it",
    body: 'Batteries are expensive, site-constrained, and discharge in hours. Pumped hydro takes decades. Only hydrogen stores energy cheaply at scale, for weeks or months.',
  },
];

const WHY_NOW = [
  {
    title: 'Curtailment is accelerating',
    body: 'UK curtailment was 2.1 TWh in 2019. It hit 8.3 TWh in 2024. The Eastern HVDC link meant to fix this is delayed to 2029+. Every year the feedstock gets larger and cheaper.',
  },
  {
    title: 'Policy has made green H₂ non-negotiable',
    body: 'UK: 10 GW H₂ by 2030. EU: 10 Mt by 2030. US IRA: $3/kg production credit. These are not aspirations — they are binding policy commitments with capital attached.',
  },
  {
    title: 'The cost window is open now',
    body: 'Electrolyser costs fell 60% since 2020. Second-life panels cost £360/kWp vs £800/kWp new. The unit economics only work at current prices. In 5 years the advantage narrows.',
  },
  {
    title: 'No-one builds where the energy is wasted',
    body: 'Competitors pursue grid-connected H₂ hubs — fighting for grid connections that take a decade. Fluxero installs behind-the-meter, at curtailment sites, where there is no queue.',
  },
];

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function ProblemPage() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ background: '#070608', minHeight: '100vh', color: '#F0EBE0' }}>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(120px, 15vw, 160px) 2rem clamp(60px, 8vw, 96px)', textAlign: 'center', background: 'linear-gradient(to bottom, #070608, #0D0C0F)' }}>
        <motion.div {...fade}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 28 }}>
            <div style={{ width: 32, height: 1, background: G }} />
            <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: G }}>The Problem</span>
            <div style={{ width: 32, height: 1, background: G }} />
          </div>
          <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(36px, 6vw, 80px)', fontWeight: 400, lineHeight: 1.05, marginBottom: 24, color: '#F0EBE0' }}>
            Clean energy is being<br />
            <span style={{ background: 'linear-gradient(135deg, #EF4444, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              thrown away.
            </span>
          </h1>
          <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 'clamp(15px, 1.5vw, 18px)', fontWeight: 300, color: '#A8A3B3', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Every day, enough renewable electricity to power millions of homes is rejected by the grid. Not because it isn't needed. Because the infrastructure can't carry it.
          </p>
        </motion.div>
      </section>

      {/* ── THREE STATS ──────────────────────────────────────────── */}
      <section style={{ background: '#0D0C0F', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {STATS.map((s, i) => (
            <motion.div key={i} {...fade} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ background: '#131116', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: '32px 28px' }}>
              <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(36px, 4vw, 52px)', color: G, lineHeight: 1, marginBottom: 12 }}>{s.n}</div>
              <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 15, color: '#F0EBE0', fontWeight: 500, marginBottom: 8, lineHeight: 1.4 }}>{s.label}</p>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: '#64748B', letterSpacing: '0.08em' }}>Source: {s.src}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WORLD MAP ─────────────────────────────────────────────── */}
      <section style={{ background: '#070608', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fade} style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 32, height: 1, background: G }} />
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: G }}>Global curtailment</span>
            </div>
            <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(28px, 4vw, 52px)', color: '#F0EBE0', marginBottom: 12, lineHeight: 1.1 }}>
              The waste is everywhere.
            </h2>
            <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 15, color: '#A8A3B3', fontWeight: 300, maxWidth: 560 }}>
              Curtailment is a structural global problem. The countries generating the most renewables are paying the highest cost.
            </p>
          </motion.div>

          <motion.div {...fade} transition={{ duration: 0.7 }}
            style={{ background: '#0D0C0F', border: '1px solid rgba(0,214,143,0.08)', borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 130, center: [10, 20] }}
              style={{ width: '100%', height: 400 }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const c = CURTAILMENT[geo.properties.name as string];
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={c ? c.color : 'rgba(255,255,255,0.03)'}
                        stroke="rgba(0,214,143,0.06)"
                        strokeWidth={0.5}
                        onMouseEnter={() => c && setHovered(geo.properties.name as string)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          default: { outline: 'none' },
                          hover: {
                            outline: 'none',
                            fill: c ? c.color.replace(/0\.\d+\)/, '1)') : 'rgba(255,255,255,0.07)',
                            cursor: c ? 'pointer' : 'default',
                          },
                          pressed: { outline: 'none' },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>

            {/* Hover tooltip */}
            {hovered && CURTAILMENT[hovered] && (
              <div style={{ position: 'absolute', bottom: 16, left: 16, background: '#131116', border: '1px solid rgba(0,214,143,0.2)', borderRadius: 10, padding: '12px 16px', maxWidth: 260 }}>
                <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: G, marginBottom: 4 }}>{hovered}</p>
                <p style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, color: '#F0EBE0', marginBottom: 4 }}>{CURTAILMENT[hovered].twh}</p>
                <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: '#64748B' }}>{CURTAILMENT[hovered].note}</p>
              </div>
            )}

            {/* Legend */}
            <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: '#475569' }}>Low</span>
              {(['rgba(234,179,8,0.6)', 'rgba(249,115,22,0.6)', 'rgba(239,68,68,0.7)', 'rgba(220,38,38,0.85)'] as string[]).map((c, i) => (
                <div key={i} style={{ width: 20, height: 8, background: c, borderRadius: 2 }} />
              ))}
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: '#475569' }}>High</span>
            </div>
          </motion.div>

          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: '#334155', marginTop: 12, textAlign: 'right' }}>
            Source: IEA, IRENA, national grid operators · 2024 data
          </p>
        </div>
      </section>

      {/* ── WHY IS THIS HAPPENING ─────────────────────────────────── */}
      <section style={{ background: '#0D0C0F', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fade} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(28px, 4vw, 48px)', color: '#F0EBE0', lineHeight: 1.1 }}>
              Why is this happening?
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {WHY_POINTS.map((p, i) => (
              <motion.div key={i} {...fade} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: '#131116', borderRadius: 12, padding: '28px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: 24, marginBottom: 16 }}>{p.icon}</div>
                <h3 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 20, color: '#F0EBE0', marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 14, color: '#A8A3B3', lineHeight: 1.7, fontWeight: 300 }}>{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY HYDROGEN ─────────────────────────────────────────── */}
      <section style={{ background: '#070608', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fade} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(28px, 4vw, 52px)', color: '#F0EBE0', lineHeight: 1.1, marginBottom: 12 }}>
              Hydrogen is the answer.
            </h2>
            <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 15, color: '#A8A3B3', fontWeight: 300, maxWidth: 520 }}>
              It stores energy at scale, travels in existing infrastructure, and commands a market price of £8–12/kg.
            </p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { v: '✓', label: 'Stores indefinitely', sub: 'Unlike electricity, weeks or months' },
              { v: '£190B', label: 'Global market by 2034', sub: 'IRENA · 41.4% CAGR' },
              { v: '10 GW', label: 'UK 2030 H₂ target', sub: 'Binding policy mandate' },
              { v: '60%', label: 'Electrolyser cost drop since 2020', sub: 'And still falling' },
            ].map((item, i) => (
              <motion.div key={i} {...fade} transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ background: 'rgba(0,214,143,0.04)', border: '1px solid rgba(0,214,143,0.1)', borderRadius: 12, padding: '20px' }}>
                <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 28, color: G, marginBottom: 8 }}>{item.v}</div>
                <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 14, color: '#F0EBE0', fontWeight: 500, marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: '#64748B' }}>{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY NOW ──────────────────────────────────────────────── */}
      <section style={{ background: '#0D0C0F', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fade} style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 32, height: 1, background: G }} />
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: G }}>Timing</span>
            </div>
            <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(28px, 4vw, 52px)', color: '#F0EBE0', lineHeight: 1.1 }}>
              Why now.
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {WHY_NOW.map((w, i) => (
              <motion.div key={i} {...fade} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ borderLeft: `3px solid ${G}`, paddingLeft: 20, paddingTop: 4 }}>
                <h3 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 19, color: '#F0EBE0', marginBottom: 10 }}>{w.title}</h3>
                <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 14, color: '#A8A3B3', lineHeight: 1.7, fontWeight: 300 }}>{w.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
