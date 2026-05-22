import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

// ─── Shared style tokens ──────────────────────────────────────────────────────
const C = {
  dark:    '#070608',
  card:    '#131116',
  alt:     '#0D0C0F',
  green:   '#00D68F',
  cream:   '#F0EBE0',
  muted:   '#A8A3B3',
  steel:   '#64748B',
  border:  'rgba(255,255,255,0.05)',
  gborder: 'rgba(0,214,143,0.12)',
};

const MONO:   React.CSSProperties = { fontFamily: '"IBM Plex Mono", monospace' };
const SANS:   React.CSSProperties = { fontFamily: '"IBM Plex Sans", sans-serif' };
const SERIF:  React.CSSProperties = { fontFamily: '"DM Serif Display", serif' };

// ─── Tiny helper: animated section wrapper ────────────────────────────────────
function FadeIn({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── Mono tag + decorative line ───────────────────────────────────────────────
function MonoTag({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
      <div style={{ width: 32, height: 1, background: C.green }} />
      <span style={{ ...MONO, fontSize: 13, letterSpacing: '0.26em', textTransform: 'uppercase', color: C.green }}>
        {label}
      </span>
    </div>
  );
}

// ─── Metric box (card) ────────────────────────────────────────────────────────
function MetricBox({ value, label }: { value: string; label: string }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.gborder}`,
      borderTop: `2px solid ${C.green}`,
      borderRadius: 12,
      padding: '24px 20px',
      textAlign: 'center',
    }}>
      <div style={{ ...SERIF, fontSize: 'clamp(28px, 3.5vw, 40px)', color: C.green, lineHeight: 1, marginBottom: 8 }}>
        {value}
      </div>
      <div style={{ ...MONO, fontSize: 13, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}

// ─── Slider row ───────────────────────────────────────────────────────────────
const sliderThumb = `
  input[type=range].fluxero-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background: rgba(255,255,255,0.08);
    outline: none;
    cursor: pointer;
  }
  input[type=range].fluxero-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #00D68F;
    box-shadow: 0 0 0 3px rgba(0,214,143,0.18);
    cursor: pointer;
    transition: box-shadow 0.15s;
  }
  input[type=range].fluxero-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border: none;
    border-radius: 50%;
    background: #00D68F;
    box-shadow: 0 0 0 3px rgba(0,214,143,0.18);
    cursor: pointer;
  }
  input[type=range].fluxero-slider::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 4px;
  }
`;

function SliderRow({
  label, min, max, step, value, format, onChange,
}: {
  label: string; min: number; max: number; step: number;
  value: number; format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ ...SANS, fontSize: 15, color: C.muted, fontWeight: 400 }}>{label}</span>
        <span style={{ ...MONO, fontSize: 16, color: C.cream, fontWeight: 600 }}>{format(value)}</span>
      </div>
      <div style={{ position: 'relative' }}>
        {/* Filled track overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: `${pct}%`,
          height: 4,
          background: `linear-gradient(90deg, #00A86B, ${C.green})`,
          borderRadius: 4,
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />
        <input
          type="range"
          className="fluxero-slider"
          min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: 'relative', zIndex: 2, background: 'transparent' }}
        />
      </div>
    </div>
  );
}

// ─── Big output metric card ───────────────────────────────────────────────────
function OutputMetric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.gborder}`,
      borderRadius: 14,
      padding: '28px 24px',
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{ ...MONO, fontSize: 12, color: C.green, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
        {label}
      </div>
      <div style={{ ...SERIF, fontSize: 'clamp(26px, 3vw, 38px)', color: C.cream, lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ ...SANS, fontSize: 14, color: C.muted, marginTop: 8, fontWeight: 300 }}>{sub}</div>
      )}
    </div>
  );
}

// ─── Revenue stream tab data ──────────────────────────────────────────────────
const REVENUE_STREAMS = [
  {
    id: 'h2',
    label: 'H₂ Offtake',
    headline: 'Direct hydrogen sales to industrial buyers.',
    body: 'Green H₂ is sold under long-term offtake contracts to industrial operators — steel producers, refineries, and fuel cell vehicle fleet operators. Contracts typically run 15 years, providing a locked-in, recurring revenue base from day one of commissioning.',
    metrics: [
      { k: 'Price range', v: '£8 – £12 / kg' },
      { k: 'Contract length', v: '15-year offtake' },
      { k: 'Buyers', v: 'Steel, FCEVs, industry' },
    ],
    accent: C.green,
  },
  {
    id: 'constraint',
    label: 'Constraint Payments',
    headline: 'Turn curtailed energy into free feedstock.',
    body: 'Grid operators pay generators to curtail output when the grid is congested. Fluxero negotiates to share these constraint payments with landowners in exchange for the curtailed electricity as feedstock — meaning our electrolyser input cost can be zero or near-zero on curtailed periods.',
    metrics: [
      { k: 'Feedstock cost', v: '£0 (curtailed)' },
      { k: 'Mechanism', v: 'Shared constraint fee' },
      { k: 'UK curtailment', v: '£650M+ paid in 2023' },
    ],
    accent: '#60A5FA',
  },
  {
    id: 'carbon',
    label: 'Carbon Credits',
    headline: 'Each kg H₂ avoids 9 kg CO₂.',
    body: 'Green hydrogen produced from renewable electricity displaces grey hydrogen (from natural gas steam methane reforming). Each kg of green H₂ avoids approximately 9 kg of CO₂e. At voluntary carbon market prices, this generates an additional revenue layer stacked on top of the base H₂ offtake price.',
    metrics: [
      { k: 'CO₂ avoided', v: '~9 kg per kg H₂' },
      { k: 'Carbon price', v: '£35 – £50 / tonne' },
      { k: 'Additional rev', v: '£0.32 – £0.45 / kg H₂' },
    ],
    accent: '#A78BFA',
  },
];

// ─── Unit economics table data ────────────────────────────────────────────────
const TABLE_ROWS = [
  { metric: 'CAPEX',         perUnit: '£150k',      per100: '£15M'    },
  { metric: 'Annual Revenue', perUnit: '£47k',       per100: '£4.7M'   },
  { metric: 'OpEx',          perUnit: '£8k / yr',   per100: '£800k / yr' },
  { metric: 'EBITDA',        perUnit: '£39k / yr',  per100: '£3.9M / yr' },
  { metric: 'Payback',       perUnit: '3.2 years',  per100: '3.2 years'  },
  { metric: '10-yr Net',     perUnit: '£240k',      per100: '£24M'       },
];

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BusinessPage() {
  // Calculator state
  const [panels,     setPanels]     = useState(1000);
  const [efficiency, setEfficiency] = useState(70);
  const [sunHours,   setSunHours]   = useState(1200);
  const [h2Price,    setH2Price]    = useState(10);

  // Tab state
  const [activeTab, setActiveTab] = useState('h2');

  // ── Calculator derived values ──
  const kwhPerYear      = panels * 0.4 * (sunHours / 1000) * 1000;
  const h2KgPerYear     = (kwhPerYear * efficiency / 100) / 50;
  const annualRevenue   = h2KgPerYear * h2Price;
  const capex           = panels * 150;
  const paybackYears    = capex / annualRevenue;
  const tenYearProfit   = (annualRevenue * 10) - capex;

  // 10-yr bar: capex as % of 10yr gross revenue
  const tenYrGross      = annualRevenue * 10;
  const capexPct        = Math.min((capex / tenYrGross) * 100, 100);
  const profitPct       = 100 - capexPct;

  const fmtCurrency = (n: number) => {
    if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000)     return `£${(n / 1_000).toFixed(1)}k`;
    return `£${Math.round(n)}`;
  };
  const fmtKg = (n: number) => {
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}t`;
    return `${Math.round(n)} kg`;
  };

  const activeStream = REVENUE_STREAMS.find(s => s.id === activeTab)!;

  return (
    <>
      {/* Inject slider styles */}
      <style>{sliderThumb}</style>

      <div style={{ background: C.dark, minHeight: '100vh', paddingTop: 80 }}>

        {/* SECTION 1 - HERO */}


        <div data-section style={{
          background: C.dark,
          padding: 'clamp(72px, 10vw, 120px) 0 clamp(64px, 8vw, 96px)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle radial glow */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 800, height: 400,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(0,214,143,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>
            <FadeIn>
              <MonoTag label="Business Model" />
              <h1 style={{
                ...SERIF,
                fontSize: 'clamp(46px, 7vw, 96px)',
                color: C.cream,
                lineHeight: 0.95,
                marginBottom: 32,
                whiteSpace: 'pre-line',
              }}>
                {'Assets that scale\nlike software.'}
              </h1>
              <p style={{
                ...SANS,
                fontSize: 'clamp(18px, 1.8vw, 20px)',
                color: C.muted,
                fontWeight: 300,
                maxWidth: 600,
                lineHeight: 1.6,
              }}>
                We own or operate every SMHP. Revenue is recurring. Capital is modular.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* SECTION 2 - THESIS */}


        <div data-section style={{ background: C.alt, padding: 'clamp(64px, 8vw, 112px) 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'clamp(40px, 6vw, 80px)',
              alignItems: 'start',
            }}>
              {/* Left — text */}
              <FadeIn>
                <MonoTag label="The Thesis" />
                <h2 style={{
                  ...SERIF,
                  fontSize: 'clamp(30px, 4vw, 52px)',
                  color: C.cream,
                  lineHeight: 1.05,
                  marginBottom: 32,
                }}>
                  Infrastructure returns.<br />
                  <span style={{ color: C.green }}>Software growth.</span>
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    'Each SMHP is a discrete, revenue-generating asset — identical in manufacture, replicable at scale.',
                    'No grid connection, no bespoke engineering, no complex civil works. Containerised units qualify as permitted development in many jurisdictions.',
                    'We don\'t need planning permission for each new site. We need a flatbed truck.',
                    'Each unit deployed generates recurring hydrogen offtake revenue from day one of commissioning.',
                    'Unit 1 funds R&D. Unit 10 proves the model. Unit 100 is pure margin expansion.',
                  ].map((text, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%', background: C.green,
                        flexShrink: 0, marginTop: 7,
                      }} />
                      <p style={{ ...SANS, fontSize: 17, color: C.muted, fontWeight: 300, lineHeight: 1.7, margin: 0 }}>
                        {text}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{
                  marginTop: 40,
                  borderLeft: `3px solid ${C.green}`,
                  paddingLeft: 20,
                }}>
                  <p style={{
                    ...SERIF,
                    fontSize: 'clamp(19px, 2vw, 21px)',
                    color: C.cream,
                    lineHeight: 1.4,
                    margin: 0,
                  }}>
                    "We are building an infrastructure company with a software-company growth curve."
                  </p>
                </div>
              </FadeIn>

              {/* Right — metric grid */}
              <FadeIn delay={0.15}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                }}>
                  <MetricBox value="£150k"  label="Avg CAPEX per unit" />
                  <MetricBox value="£47k/yr" label="Avg annual revenue" />
                  <MetricBox value="3.2 yr"  label="Average payback" />
                  <MetricBox value="∞"       label="Sites available" />
                </div>

                <div style={{
                  marginTop: 24,
                  background: C.card,
                  border: `1px solid ${C.gborder}`,
                  borderRadius: 12,
                  padding: '20px 24px',
                }}>
                  <p style={{ ...MONO, fontSize: 13, color: C.steel, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
                    Why it compounds
                  </p>
                  <p style={{ ...SANS, fontSize: 16, color: C.muted, fontWeight: 300, lineHeight: 1.7, margin: 0 }}>
                    Every curtailment point in the UK is a potential location. National Grid paid over £650M in constraint payments in 2023 alone. Each of those sites is a potential Fluxero deployment — zero land cost, zero feedstock cost.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* SECTION 3 - ROI CALCULATOR */}


        <div data-section style={{ background: C.dark, padding: 'clamp(64px, 8vw, 112px) 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>
            <FadeIn>
              <MonoTag label="ROI Calculator" />
              <h2 style={{
                ...SERIF,
                fontSize: 'clamp(30px, 4vw, 52px)',
                color: C.cream,
                lineHeight: 1.05,
                marginBottom: 12,
              }}>
                Model your site.
              </h2>
              <p style={{ ...SANS, fontSize: 17, color: C.muted, fontWeight: 300, maxWidth: 540, lineHeight: 1.6, marginBottom: 48 }}>
                Adjust the parameters below. Outputs update live — based on the same methodology used in our founder's 1,000-panel example.
              </p>
            </FadeIn>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 32,
              alignItems: 'start',
            }}>
              {/* Left — sliders */}
              <FadeIn delay={0.05}>
                <div style={{
                  background: C.card,
                  border: `1px solid ${C.gborder}`,
                  borderRadius: 16,
                  padding: 'clamp(24px, 3vw, 36px)',
                }}>
                  <p style={{ ...MONO, fontSize: 13, color: C.green, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 28 }}>
                    Input parameters
                  </p>

                  <SliderRow
                    label="Solar panels"
                    min={200} max={5000} step={100} value={panels}
                    format={v => `${v.toLocaleString()} panels`}
                    onChange={setPanels}
                  />
                  <SliderRow
                    label="Electrolyser efficiency"
                    min={50} max={85} step={5} value={efficiency}
                    format={v => `${v}%`}
                    onChange={setEfficiency}
                  />
                  <SliderRow
                    label="Annual sun hours"
                    min={600} max={2200} step={100} value={sunHours}
                    format={v => `${v.toLocaleString()} hrs/yr`}
                    onChange={setSunHours}
                  />
                  <SliderRow
                    label="H₂ sale price"
                    min={6} max={14} step={0.5} value={h2Price}
                    format={v => `£${v}/kg`}
                    onChange={setH2Price}
                  />

                  {/* Secondary metrics */}
                  <div style={{
                    borderTop: `1px solid ${C.border}`,
                    paddingTop: 24,
                    marginTop: 8,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                  }}>
                    {[
                      { k: 'kWh captured / yr', v: `${(kwhPerYear / 1000).toFixed(0)}k kWh` },
                      { k: 'H₂ production',     v: fmtKg(h2KgPerYear) },
                      { k: 'Est. CAPEX',         v: fmtCurrency(capex) },
                      { k: 'Payback period',     v: `${paybackYears.toFixed(1)} yrs` },
                    ].map(item => (
                      <div key={item.k} style={{
                        background: C.alt,
                        borderRadius: 8,
                        padding: '12px 14px',
                        border: `1px solid ${C.border}`,
                      }}>
                        <div style={{ ...MONO, fontSize: 9, color: C.steel, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
                          {item.k}
                        </div>
                        <div style={{ ...MONO, fontSize: 16, color: C.cream, fontWeight: 600 }}>
                          {item.v}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Right — output metrics + projection bar */}
              <FadeIn delay={0.12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* 3 big outputs */}
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <OutputMetric
                      label="Annual Revenue"
                      value={fmtCurrency(annualRevenue)}
                      sub={`from ${fmtKg(h2KgPerYear)} H₂ / yr`}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <OutputMetric
                      label="H₂ Production"
                      value={fmtKg(h2KgPerYear)}
                      sub={`≈ ${(kwhPerYear / 1000).toFixed(0)}k kWh input`}
                    />
                    <OutputMetric
                      label="Payback Period"
                      value={`${paybackYears.toFixed(1)} yrs`}
                      sub={`on ${fmtCurrency(capex)} CAPEX`}
                    />
                  </div>

                  {/* 10-year projection bar */}
                  <div style={{
                    background: C.card,
                    border: `1px solid ${C.gborder}`,
                    borderRadius: 14,
                    padding: '24px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                      <span style={{ ...MONO, fontSize: 13, color: C.green, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        10-year projection
                      </span>
                      <span style={{ ...MONO, fontSize: 15, color: tenYearProfit >= 0 ? C.green : '#F87171' }}>
                        {tenYearProfit >= 0 ? '+' : ''}{fmtCurrency(tenYearProfit)} net
                      </span>
                    </div>

                    {/* Bar */}
                    <div style={{ display: 'flex', height: 32, borderRadius: 8, overflow: 'hidden', gap: 2 }}>
                      <motion.div
                        animate={{ width: `${capexPct}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        style={{
                          background: 'rgba(100,116,139,0.45)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          minWidth: capexPct > 8 ? 0 : 0,
                          overflow: 'hidden',
                        }}
                      >
                        {capexPct > 12 && (
                          <span style={{ ...MONO, fontSize: 12, color: C.steel, whiteSpace: 'nowrap' }}>CAPEX</span>
                        )}
                      </motion.div>
                      <motion.div
                        animate={{ width: `${profitPct}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        style={{
                          background: `linear-gradient(90deg, #00A86B, ${C.green})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        {profitPct > 20 && (
                          <span style={{ ...MONO, fontSize: 12, color: C.dark, whiteSpace: 'nowrap' }}>10-yr profit</span>
                        )}
                      </motion.div>
                    </div>

                    <div style={{ display: 'flex', gap: 24, marginTop: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(100,116,139,0.45)' }} />
                        <span style={{ ...MONO, fontSize: 13, color: C.steel }}>CAPEX — {fmtCurrency(capex)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: C.green }} />
                        <span style={{ ...MONO, fontSize: 13, color: C.steel }}>10-yr gross — {fmtCurrency(tenYrGross)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* SECTION 4 - THREE REVENUE STREAMS */}


        <div data-section style={{ background: C.alt, padding: 'clamp(64px, 8vw, 112px) 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>
            <FadeIn>
              <MonoTag label="Revenue Streams" />
              <h2 style={{
                ...SERIF,
                fontSize: 'clamp(30px, 4vw, 52px)',
                color: C.cream,
                lineHeight: 1.05,
                marginBottom: 12,
              }}>
                Three layers of revenue.
              </h2>
              <p style={{ ...SANS, fontSize: 17, color: C.muted, fontWeight: 300, maxWidth: 520, lineHeight: 1.6, marginBottom: 44 }}>
                Every SMHP participates in all three streams. Each one is independent — together they materially de-risk the revenue profile.
              </p>
            </FadeIn>

            <FadeIn delay={0.08}>
              {/* Tab bar */}
              <div style={{
                display: 'flex',
                gap: 4,
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: 4,
                marginBottom: 32,
                width: 'fit-content',
                flexWrap: 'wrap',
              }}>
                {REVENUE_STREAMS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveTab(s.id)}
                    style={{
                      ...MONO,
                      fontSize: 14,
                      letterSpacing: '0.08em',
                      padding: '10px 20px',
                      borderRadius: 7,
                      border: 'none',
                      cursor: 'pointer',
                      background: activeTab === s.id ? s.accent : 'transparent',
                      color: activeTab === s.id ? C.dark : C.muted,
                      fontWeight: 500,
                      transition: 'background 0.2s, color 0.2s',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 24,
                }}
              >
                {/* Description */}
                <div style={{
                  background: C.card,
                  border: `1px solid ${C.gborder}`,
                  borderTop: `2px solid ${activeStream.accent}`,
                  borderRadius: 14,
                  padding: 'clamp(24px, 3vw, 36px)',
                }}>
                  <h3 style={{ ...SERIF, fontSize: 'clamp(22px, 2.5vw, 30px)', color: C.cream, marginBottom: 16, lineHeight: 1.2 }}>
                    {activeStream.headline}
                  </h3>
                  <p style={{ ...SANS, fontSize: 17, color: C.muted, fontWeight: 300, lineHeight: 1.75, margin: 0 }}>
                    {activeStream.body}
                  </p>
                </div>

                {/* Metrics */}
                <div style={{
                  background: C.card,
                  border: `1px solid ${C.gborder}`,
                  borderRadius: 14,
                  padding: 'clamp(24px, 3vw, 36px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <p style={{ ...MONO, fontSize: 12, color: activeStream.accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>
                    Key metrics
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {activeStream.metrics.map((m, i) => (
                      <div key={m.k} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom: i < activeStream.metrics.length - 1 ? `1px solid ${C.border}` : 'none',
                      }}>
                        <span style={{ ...MONO, fontSize: 14, color: C.steel }}>{m.k}</span>
                        <span style={{ ...SANS, fontSize: 17, color: C.cream, fontWeight: 500 }}>{m.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>

        {/* SECTION 5 - MARKET SIZE */}


        <div data-section style={{ background: C.dark, padding: 'clamp(64px, 8vw, 112px) 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>
            <FadeIn>
              <MonoTag label="Market Opportunity" />
              <h2 style={{
                ...SERIF,
                fontSize: 'clamp(30px, 4vw, 52px)',
                color: C.cream,
                lineHeight: 1.05,
                marginBottom: 48,
              }}>
                A £190B market,<br />
                <span style={{ color: C.green }}>captured from the ground up.</span>
              </h2>
            </FadeIn>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}>
              {[
                {
                  num: '£190B',
                  label: 'Global green hydrogen market by 2034',
                  sub: 'Source: IRENA 2024',
                  accent: C.green,
                },
                {
                  num: '500',
                  label: 'SMHPs target by 2030',
                  sub: '= £23.5M ARR',
                  accent: C.green,
                },
                {
                  num: '£117M',
                  label: 'Asset value at 5× revenue',
                  sub: 'Conservative infrastructure multiple',
                  accent: C.green,
                },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div style={{
                    background: C.card,
                    border: `1px solid ${C.gborder}`,
                    borderRadius: 14,
                    padding: 'clamp(28px, 3vw, 40px)',
                    height: '100%',
                  }}>
                    <div style={{
                      ...SERIF,
                      fontSize: 'clamp(36px, 5vw, 56px)',
                      color: item.accent,
                      lineHeight: 1,
                      marginBottom: 16,
                    }}>
                      {item.num}
                    </div>
                    <div style={{ ...SANS, fontSize: 19, color: C.cream, fontWeight: 500, marginBottom: 8, lineHeight: 1.3 }}>
                      {item.label}
                    </div>
                    <div style={{ ...MONO, fontSize: 13, color: C.steel, letterSpacing: '0.1em' }}>
                      {item.sub}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 6 - UNIT ECONOMICS TABLE */}


        <div data-section style={{ background: C.alt, padding: 'clamp(64px, 8vw, 112px) 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>
            <FadeIn>
              <MonoTag label="Unit Economics" />
              <h2 style={{
                ...SERIF,
                fontSize: 'clamp(30px, 4vw, 52px)',
                color: C.cream,
                lineHeight: 1.05,
                marginBottom: 12,
              }}>
                The numbers, unabridged.
              </h2>
              <p style={{ ...SANS, fontSize: 17, color: C.muted, fontWeight: 300, maxWidth: 520, lineHeight: 1.6, marginBottom: 48 }}>
                Unit economics per SMHP and how they compound across 100 deployed units.
              </p>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: 0,
                  background: C.card,
                  border: `1px solid ${C.gborder}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                }}>
                  {/* Header */}
                  <thead>
                    <tr>
                      {['Metric', 'Per Unit', 'Per 100 Units'].map((h, i) => (
                        <th key={h} style={{
                          ...MONO,
                          fontSize: 13,
                          color: C.green,
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          padding: '18px 24px',
                          textAlign: i === 0 ? 'left' : 'right',
                          background: 'rgba(0,214,143,0.04)',
                          borderBottom: `1px solid ${C.gborder}`,
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Body */}
                  <tbody>
                    {TABLE_ROWS.map((row, i) => (
                      <tr key={row.metric} style={{
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                      }}>
                        <td style={{
                          ...SANS,
                          fontSize: 17,
                          color: C.cream,
                          padding: '18px 24px',
                          fontWeight: 500,
                          borderBottom: i < TABLE_ROWS.length - 1 ? `1px solid ${C.border}` : 'none',
                        }}>
                          {row.metric}
                        </td>
                        <td style={{
                          ...MONO,
                          fontSize: 16,
                          color: C.muted,
                          padding: '18px 24px',
                          textAlign: 'right',
                          borderBottom: i < TABLE_ROWS.length - 1 ? `1px solid ${C.border}` : 'none',
                          whiteSpace: 'nowrap',
                        }}>
                          {row.perUnit}
                        </td>
                        <td style={{
                          ...MONO,
                          fontSize: 16,
                          color: C.green,
                          padding: '18px 24px',
                          textAlign: 'right',
                          borderBottom: i < TABLE_ROWS.length - 1 ? `1px solid ${C.border}` : 'none',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}>
                          {row.per100}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* SECTION 7 - CTA */}


        <div data-section style={{ background: C.dark, padding: 'clamp(80px, 10vw, 128px) 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)' }}>
            <FadeIn>
              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 56 }}>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.green}, transparent)` }} />
                <span style={{ ...MONO, fontSize: 12, color: C.steel, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                  next steps
                </span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(270deg, ${C.green}, transparent)` }} />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 20,
              }}>
                {/* Card 1 */}
                <Link to="/traction" style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: C.card,
                      border: `1px solid ${C.gborder}`,
                      borderRadius: 14,
                      padding: 'clamp(28px, 3vw, 40px)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = 'translateY(-4px)';
                      el.style.boxShadow = '0 12px 40px rgba(0,214,143,0.1)';
                      el.style.borderColor = 'rgba(0,214,143,0.28)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = 'translateY(0)';
                      el.style.boxShadow = 'none';
                      el.style.borderColor = C.gborder;
                    }}
                  >
                    <div style={{ ...MONO, fontSize: 13, color: C.green, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
                      01
                    </div>
                    <h3 style={{ ...SERIF, fontSize: 'clamp(22px, 2.5vw, 30px)', color: C.cream, marginBottom: 12, lineHeight: 1.2 }}>
                      Explore the traction
                    </h3>
                    <p style={{ ...SANS, fontSize: 16, color: C.muted, fontWeight: 300, lineHeight: 1.65, marginBottom: 28 }}>
                      Nvidia Inception, Barclays Eagle Labs, and our proof points — see where we are today.
                    </p>
                    <span style={{ ...MONO, fontSize: 14, color: C.green, letterSpacing: '0.1em' }}>
                      View traction →
                    </span>
                  </div>
                </Link>

                {/* Card 2 */}
                <Link to="/calculator" style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: C.green,
                      border: `1px solid ${C.green}`,
                      borderRadius: 14,
                      padding: 'clamp(28px, 3vw, 40px)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s, filter 0.2s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = 'translateY(-4px)';
                      el.style.boxShadow = '0 12px 40px rgba(0,214,143,0.25)';
                      el.style.filter = 'brightness(1.07)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.transform = 'translateY(0)';
                      el.style.boxShadow = 'none';
                      el.style.filter = 'none';
                    }}
                  >
                    <div style={{ ...MONO, fontSize: 13, color: C.dark, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16, opacity: 0.6 }}>
                      02
                    </div>
                    <h3 style={{ ...SERIF, fontSize: 'clamp(22px, 2.5vw, 30px)', color: C.dark, marginBottom: 12, lineHeight: 1.2 }}>
                      Model your site
                    </h3>
                    <p style={{ ...SANS, fontSize: 16, color: C.dark, fontWeight: 400, lineHeight: 1.65, marginBottom: 28, opacity: 0.75 }}>
                      Run a full projection for your renewable site — panels, location, offtake price, and more.
                    </p>
                    <span style={{ ...MONO, fontSize: 14, color: C.dark, letterSpacing: '0.1em' }}>
                      Open calculator →
                    </span>
                  </div>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>

      </div>
    </>
  );
}
