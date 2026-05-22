import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const G       = '#00D68F';
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/* ─── Renewable-type palette ───────────────────────────────────────────
   Each country is coloured by its DOMINANT curtailed renewable.
   Opacity scales with magnitude (TWh).                                  */
type Kind = 'wind' | 'solar' | 'mixed' | 'hydro';

const KIND_COLOR: Record<Kind, [number, number, number]> = {
  wind:  [56, 189, 248],   // sky blue
  solar: [251, 191, 36],   // amber
  mixed: [167, 139, 250],  // violet
  hydro: [34, 211, 238],   // cyan
};

const KIND_LABEL: Record<Kind, string> = {
  wind:  'Wind-dominant',
  solar: 'Solar-dominant',
  mixed: 'Mixed',
  hydro: 'Hydro',
};

/* TWh figures are 2023–2024 best-available curtailment estimates
   from IEA, IRENA, NREL, Ember and national grid operators.            */
type Country = { name: string; twh: number; kind: Kind; note: string };

const COUNTRIES: Country[] = [
  { name: 'China',                    twh: 29.7, kind: 'mixed', note: 'Xinjiang & Inner Mongolia wind, NW solar' },
  { name: 'United States of America', twh: 14.2, kind: 'wind',  note: 'Texas (ERCOT) & California (CAISO)' },
  { name: 'United Kingdom',           twh:  8.3, kind: 'wind',  note: 'Scotland · B6 grid bottleneck' },
  { name: 'India',                    twh:  8.1, kind: 'solar', note: 'Tamil Nadu, Rajasthan, Gujarat' },
  { name: 'Germany',                  twh:  6.1, kind: 'wind',  note: 'North-Sea offshore · grid congestion' },
  { name: 'Australia',                twh:  4.2, kind: 'solar', note: 'Rooftop PV · AEMO constraints' },
  { name: 'Spain',                    twh:  3.8, kind: 'mixed', note: 'Iberian grid limits · solar + wind' },
  { name: 'Italy',                    twh:  2.4, kind: 'solar', note: 'Sicily & Apulia rooftop solar' },
  { name: 'Brazil',                   twh:  2.1, kind: 'wind',  note: 'Northeast wind · transmission limits' },
  { name: 'Japan',                    twh:  1.9, kind: 'solar', note: 'Kyushu solar curtailment' },
  { name: 'Ireland',                  twh:  1.6, kind: 'wind',  note: '15% wind curtailed 2023' },
  { name: 'Vietnam',                  twh:  1.4, kind: 'solar', note: 'Ninh Thuận solar boom · grid lag' },
  { name: 'Portugal',                 twh:  1.3, kind: 'mixed', note: 'Solar + wind · weak interconnect' },
  { name: 'Denmark',                  twh:  1.2, kind: 'wind',  note: 'Offshore wind · negative prices' },
  { name: 'South Africa',             twh:  1.1, kind: 'solar', note: 'Cape solar · Eskom constraints' },
  { name: 'Mexico',                   twh:  1.0, kind: 'mixed', note: 'Oaxaca wind + Sonora solar' },
  { name: 'Chile',                    twh:  0.9, kind: 'solar', note: 'Atacama PV · zero-priced hours' },
  { name: 'Canada',                   twh:  0.8, kind: 'wind',  note: 'Alberta & Ontario wind' },
  { name: 'Netherlands',              twh:  0.7, kind: 'wind',  note: 'Offshore wind · grid full' },
  { name: 'Sweden',                   twh:  0.6, kind: 'hydro', note: 'Hydro spill + northern wind' },
  { name: 'Argentina',                twh:  0.5, kind: 'wind',  note: 'Patagonia wind · low demand' },
  { name: 'France',                   twh:  0.5, kind: 'mixed', note: 'Occitanie solar + wind' },
  { name: 'Poland',                   twh:  0.4, kind: 'wind',  note: 'Pomerania wind constraints' },
  { name: 'Greece',                   twh:  0.3, kind: 'solar', note: 'Aegean islands solar' },
  { name: 'Turkey',                   twh:  0.3, kind: 'wind',  note: 'Aegean wind · grid lag' },
];

const TOTAL_TWH = COUNTRIES.reduce((s, c) => s + c.twh, 0);
const MAX_TWH   = Math.max(...COUNTRIES.map(c => c.twh));
const BY_NAME   = Object.fromEntries(COUNTRIES.map(c => [c.name, c])) as Record<string, Country>;

function fillFor(c: Country | undefined, activeKind: Kind | 'all'): string {
  if (!c) return 'rgba(255,255,255,0.03)';
  const dim = activeKind !== 'all' && c.kind !== activeKind;
  if (dim) return 'rgba(255,255,255,0.04)';
  const [r, g, b] = KIND_COLOR[c.kind];
  // Magnitude → opacity (0.32–0.92)
  const a = 0.32 + (c.twh / MAX_TWH) * 0.6;
  return `rgba(${r},${g},${b},${a.toFixed(2)})`;
}

const STATS = [
  { n: '470 TWh',  label: 'Renewable energy wasted globally per year',  src: 'IRENA 2024' },
  { n: '£393M',    label: 'Paid to UK generators to switch off in 2024', src: 'Electric Insights' },
  { n: '10 years', label: 'Average UK grid connection wait',             src: 'National Grid ESO' },
];

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55 },
};

export default function ProblemPage() {
  const [hovered, setHovered]   = useState<string | null>(null);
  const [filter, setFilter]     = useState<Kind | 'all'>('all');

  const ranked = useMemo(
    () => [...COUNTRIES]
      .filter(c => filter === 'all' || c.kind === filter)
      .sort((a, b) => b.twh - a.twh)
      .slice(0, 12),
    [filter],
  );

  return (
    <div style={{ background: '#070608', minHeight: '100vh', color: '#F0EBE0' }}>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <div data-section style={{ padding: 'clamp(96px, 7vw, 116px) 2rem clamp(28px, 3vw, 44px)', textAlign: 'center', background: 'linear-gradient(to bottom, #070608, #0D0C0F)' }}>
        <motion.div {...fade}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 22 }}>
            <div style={{ width: 28, height: 1, background: G }} />
            <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: G }}>The Problem</span>
            <div style={{ width: 28, height: 1, background: G }} />
          </div>
          <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(36px, 6vw, 80px)', fontWeight: 400, lineHeight: 1.05, marginBottom: 18, color: '#F0EBE0' }}>
            Clean energy is being<br />
            <span style={{ background: 'linear-gradient(135deg, #EF4444, #F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              thrown away.
            </span>
          </h1>
          <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 'clamp(17px, 1.4vw, 19px)', fontWeight: 300, color: '#A8A3B3', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Enough renewable electricity to power millions of homes is rejected by the grid — every single day.
          </p>
        </motion.div>
      </div>

      {/* ── THREE STATS ──────────────────────────────────────────── */}
      <div data-section style={{ background: '#0D0C0F', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {STATS.map((s, i) => (
            <motion.div key={i} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ background: '#131116', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: '28px 24px' }}>
              <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(34px, 3.6vw, 48px)', color: G, lineHeight: 1, marginBottom: 10 }}>{s.n}</div>
              <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 16, color: '#F0EBE0', fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>{s.label}</p>
              <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: '#64748B', letterSpacing: '0.08em' }}>Source: {s.src}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── WORLD MAP + FILTER ─────────────────────────────────────── */}
      <div data-section style={{ background: '#070608', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>

          {/* Heading */}
          <motion.div {...fade} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 28, height: 1, background: G }} />
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: G }}>
                Global curtailment · {COUNTRIES.length} countries · {TOTAL_TWH.toFixed(1)} TWh tracked
              </span>
            </div>
            <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(28px, 4vw, 52px)', color: '#F0EBE0', marginBottom: 10, lineHeight: 1.1 }}>
              The waste is everywhere.
            </h2>
            <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 17, color: '#A8A3B3', fontWeight: 300, maxWidth: 620 }}>
              Some countries waste wind. Others waste sun. The pattern is structural — every grid built for fossil generation chokes on renewables.
            </p>
          </motion.div>

          {/* Filter pills */}
          <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
            {(['all', 'wind', 'solar', 'mixed', 'hydro'] as const).map(k => {
              const active = filter === k;
              const c      = k === 'all' ? [241, 235, 224] : KIND_COLOR[k as Kind];
              return (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: 13,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '7px 14px',
                    borderRadius: 999,
                    border: `1px solid rgba(${c[0]},${c[1]},${c[2]},${active ? 0.55 : 0.18})`,
                    background: active ? `rgba(${c[0]},${c[1]},${c[2]},0.14)` : 'transparent',
                    color: active ? `rgb(${c[0]},${c[1]},${c[2]})` : '#94A3B8',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {k === 'all' ? 'All renewables' : KIND_LABEL[k as Kind]}
                </button>
              );
            })}
          </motion.div>

          {/* Map */}
          <motion.div {...fade} transition={{ duration: 0.6 }}
            style={{ background: '#0D0C0F', border: '1px solid rgba(0,214,143,0.08)', borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 135, center: [10, 25] }}
              style={{ width: '100%', height: 460 }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const name = geo.properties.name as string;
                    const c    = BY_NAME[name];
                    const fill = fillFor(c, filter);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="rgba(0,214,143,0.06)"
                        strokeWidth={0.5}
                        onMouseEnter={() => c && setHovered(name)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          default: { outline: 'none', transition: 'fill 0.25s' },
                          hover: {
                            outline: 'none',
                            fill: c
                              ? `rgba(${KIND_COLOR[c.kind][0]},${KIND_COLOR[c.kind][1]},${KIND_COLOR[c.kind][2]},0.95)`
                              : 'rgba(255,255,255,0.07)',
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
            {hovered && BY_NAME[hovered] && (() => {
              const c = BY_NAME[hovered];
              const [r, g, b] = KIND_COLOR[c.kind];
              return (
                <div style={{ position: 'absolute', bottom: 16, left: 16, background: '#131116', border: `1px solid rgba(${r},${g},${b},0.35)`, borderRadius: 10, padding: '12px 16px', maxWidth: 280, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 999, background: `rgb(${r},${g},${b})` }} />
                    <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: `rgba(${r},${g},${b},0.9)`, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{KIND_LABEL[c.kind]}</p>
                  </div>
                  <p style={{ fontFamily: '"IBM Plex Sans Condensed", sans-serif', fontWeight: 700, fontSize: 15, color: '#F0EBE0', letterSpacing: '0.04em', marginBottom: 4 }}>{hovered}</p>
                  <p style={{ fontFamily: '"DM Serif Display", serif', fontSize: 24, color: '#F0EBE0', lineHeight: 1, marginBottom: 6 }}>{c.twh} TWh</p>
                  <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 14, color: '#94A3B8', lineHeight: 1.4 }}>{c.note}</p>
                </div>
              );
            })()}
          </motion.div>

          {/* Source line */}
          <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: '#334155', marginTop: 10, textAlign: 'right' }}>
            Source: IEA · IRENA · Ember · national grid operators · 2023–24 data
          </p>

          {/* Top-12 ranked list with bars */}
          <motion.div {...fade} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ marginTop: 32, background: '#0D0C0F', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 14, padding: '24px 8px' }}>
            <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: '#64748B', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '0 16px', marginBottom: 18 }}>
              {filter === 'all' ? 'Top 12 by curtailment volume' : `Top ${ranked.length} ${KIND_LABEL[filter as Kind].toLowerCase()} curtailment`}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {ranked.map((c, i) => {
                const [r, g, b] = KIND_COLOR[c.kind];
                const pct = (c.twh / MAX_TWH) * 100;
                return (
                  <div
                    key={c.name}
                    onMouseEnter={() => setHovered(c.name)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '28px 1.2fr 2fr 80px',
                      alignItems: 'center',
                      gap: 14,
                      padding: '10px 16px',
                      borderRadius: 8,
                      background: hovered === c.name ? 'rgba(255,255,255,0.025)' : 'transparent',
                      transition: 'background 0.15s',
                      cursor: 'default',
                    }}
                  >
                    <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, color: '#475569', textAlign: 'right' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 16, color: '#F0EBE0', fontWeight: 400, letterSpacing: '0.01em' }}>{c.name}</span>
                    <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          height: '100%',
                          borderRadius: 3,
                          background: `linear-gradient(90deg, rgba(${r},${g},${b},0.4), rgba(${r},${g},${b},0.9))`,
                          boxShadow: `0 0 12px rgba(${r},${g},${b},0.25)`,
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: `rgb(${r},${g},${b})` }} />
                      <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 14, color: '#F0EBE0', fontVariantNumeric: 'tabular-nums' }}>{c.twh} TWh</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── HYDROGEN IS THE ANSWER (compact 4-stat strip) ─────────── */}
      <div data-section style={{ background: '#0D0C0F', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fade} style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(28px, 4vw, 52px)', color: '#F0EBE0', lineHeight: 1.1, marginBottom: 10 }}>
              Hydrogen is the answer.
            </h2>
            <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 17, color: '#A8A3B3', fontWeight: 300, maxWidth: 520 }}>
              Storable for months. Travels in existing pipes. Sells at £8–12/kg.
            </p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {[
              { v: '£190B',  l: 'Market by 2034',         s: 'IRENA · 41% CAGR' },
              { v: '10 GW',  l: 'UK 2030 target',         s: 'Binding policy' },
              { v: '$3/kg',  l: 'US IRA production credit', s: '10-year subsidy' },
              { v: '60%',    l: 'Electrolyser cost drop', s: 'Since 2020' },
            ].map((item, i) => (
              <motion.div key={i} {...fade} transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{ background: 'rgba(0,214,143,0.04)', border: '1px solid rgba(0,214,143,0.1)', borderRadius: 12, padding: '18px 16px' }}>
                <div style={{ fontFamily: '"DM Serif Display", serif', fontSize: 26, color: G, marginBottom: 6, lineHeight: 1 }}>{item.v}</div>
                <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 15, color: '#F0EBE0', fontWeight: 500, marginBottom: 4 }}>{item.l}</p>
                <p style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, color: '#64748B' }}>{item.s}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHY NOW — 3 punchy lines ─────────────────────────────── */}
      <div data-section style={{ background: '#070608', padding: '3rem 2rem 4rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fade} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div style={{ width: 28, height: 1, background: G }} />
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: G }}>Timing</span>
            </div>
            <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(28px, 4vw, 52px)', color: '#F0EBE0', lineHeight: 1.1 }}>
              Why now.
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {[
              { h: 'Curtailment is accelerating', s: 'UK: 2.1 TWh in 2019 → 8.3 TWh in 2024. Every year there is more wasted feedstock.' },
              { h: 'Policy is binding, not aspirational', s: 'UK 10 GW H₂ by 2030. EU 10 Mt. US $3/kg credit. Capital is committed.' },
              { h: 'No-one builds where the waste is', s: 'Competitors chase grid-connected hubs. We install behind-the-meter, where the queue is zero.' },
            ].map((w, i) => (
              <motion.div key={i} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ borderLeft: `2px solid ${G}`, paddingLeft: 18 }}>
                <h3 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 18, color: '#F0EBE0', marginBottom: 8 }}>{w.h}</h3>
                <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 15.5, color: '#A8A3B3', lineHeight: 1.6, fontWeight: 300 }}>{w.s}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
