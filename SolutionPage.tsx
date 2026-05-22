import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const G = '#00D68F';
const DARK = '#070608';
const CARD = '#131116';
const ALT = '#0D0C0F';
const CREAM = '#F0EBE0';
const MUTED = '#A8A3B3';
const STEEL = '#64748B';

const SERIF = '"DM Serif Display", serif';
const SANS = '"IBM Plex Sans", sans-serif';
const MONO = '"IBM Plex Mono", monospace';

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

// ─── Animated SMHP Process SVG ─────────────────────────────────────────────

function SMHPDiagram() {
  const svgRef = useRef<HTMLDivElement>(null);
  const inView = useInView(svgRef, { once: true, margin: '-80px' });

  // Stage positions in viewBox "0 0 900 280"
  const stages = [
    { id: 'A', x: 60,  cx: 112, label: 'Energy Source',        color: '#FBBF24', desc: 'Wind, solar or hydro — curtailed and otherwise wasted' },
    { id: 'B', x: 260, cx: 330, label: 'SMHP Container',       color: G,         desc: 'PEM electrolyser stack splits H₂O into H₂ and O₂' },
    { id: 'C', x: 510, cx: 580, label: 'Compression & Storage', color: '#38BDF8', desc: 'Compressed to 350–700 bar, stored in onsite cylinders' },
    { id: 'D', x: 720, cx: 796, label: 'Offtake',              color: '#A78BFA', desc: 'Pipeline, truck or on-site use at £8–12/kg' },
  ];

  // Connector line segments between stage boxes
  const connectors = [
    { x1: 210, x2: 260 },
    { x1: 460, x2: 510 },
    { x1: 710, x2: 720 },
  ];

  return (
    <div ref={svgRef}>
      <svg
        width="100%"
        viewBox="0 0 900 280"
        style={{ display: 'block', maxWidth: 860, margin: '0 auto', overflow: 'visible' }}
        aria-label="SMHP process diagram"
      >
        <defs>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-amber">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="connector-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,214,143,0.15)" />
            <stop offset="100%" stopColor="rgba(0,214,143,0.4)" />
          </linearGradient>
        </defs>

        {/* ── Stage boxes ── */}
        {stages.map((s, i) => (
          <motion.g
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: i * 0.4, duration: 0.5, ease: 'easeOut' }}
          >
            {/* Box background */}
            <motion.rect
              x={s.x}
              y={40}
              width={150}
              height={180}
              rx={10}
              fill={CARD}
              stroke={s.color}
              strokeWidth={1}
              strokeOpacity={0.35}
            />
            {/* Stage ID badge */}
            <motion.rect
              x={s.x + 12}
              y={52}
              width={28}
              height={18}
              rx={4}
              fill={`${s.color}22`}
            />
            <text
              x={s.x + 26}
              y={65}
              textAnchor="middle"
              fill={s.color}
              fontSize={9}
              fontFamily={MONO}
              letterSpacing="0.1em"
            >
              {s.id}
            </text>

            {/* Stage icon area */}
            <StageIcon stageId={s.id} x={s.x} color={s.color} inView={inView} />

            {/* Label */}
            <text
              x={s.x + 75}
              y={196}
              textAnchor="middle"
              fill={CREAM}
              fontSize={11}
              fontFamily={SANS}
              fontWeight="600"
            >
              {s.label}
            </text>
          </motion.g>
        ))}

        {/* ── Connector lines ── */}
        {connectors.map((c, i) => (
          <g key={i}>
            {/* Static base line */}
            <line
              x1={c.x1} y1={130} x2={c.x2} y2={130}
              stroke="rgba(0,214,143,0.12)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            {/* Animated fill line */}
            <motion.line
              x1={c.x1} y1={130} x2={c.x2} y2={130}
              stroke={G}
              strokeWidth={1.5}
              strokeOpacity={0.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ delay: i * 0.4 + 0.6, duration: 0.4 }}
            />
            {/* Travelling pulse */}
            {inView && (
              <motion.circle
                r={4}
                fill={G}
                style={{ filter: 'url(#glow-green)' }}
                initial={{ cx: c.x1, cy: 130, opacity: 0 }}
                animate={{
                  cx: [c.x1, c.x2, c.x2],
                  cy: [130, 130, 130],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  delay: i * 0.4 + 0.8,
                  duration: 1.2,
                  repeat: Infinity,
                  repeatDelay: 1.8,
                  ease: 'easeInOut',
                }}
              />
            )}
          </g>
        ))}

        {/* ── Arrow heads on connectors ── */}
        {connectors.map((c, i) => (
          <motion.polygon
            key={i}
            points={`${c.x2},126 ${c.x2 + 7},130 ${c.x2},134`}
            fill={G}
            fillOpacity={0.45}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: i * 0.4 + 1, duration: 0.3 }}
          />
        ))}

        {/* ── Price label on stage D ── */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: 1.8, duration: 0.4 }}
        >
          <rect x={730} y={218} width={76} height={22} rx={5} fill="rgba(167,139,250,0.12)" stroke="rgba(167,139,250,0.3)" strokeWidth={0.8} />
          <text x={768} y={233} textAnchor="middle" fill="#A78BFA" fontSize={10} fontFamily={MONO} fontWeight="700">
            £8–12/kg
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

// ─── Per-stage icon renderers ───────────────────────────────────────────────

function StageIcon({ stageId, x, color, inView }: { stageId: string; x: number; color: string; inView: boolean }) {
  const cy = 130;
  const cx = x + 75;

  if (stageId === 'A') {
    // Wind turbine + solar rays
    return (
      <g>
        {/* Turbine mast */}
        <line x1={cx} y1={cy + 28} x2={cx} y2={cy - 18} stroke={color} strokeWidth={1.5} strokeOpacity={0.7} />
        {/* Turbine blades */}
        <motion.g
          style={{ originX: cx, originY: cy - 18 } as React.CSSProperties}
          animate={inView ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <line x1={cx} y1={cy - 18} x2={cx} y2={cy - 46} stroke={color} strokeWidth={2} strokeLinecap="round" />
          <line x1={cx} y1={cy - 18} x2={cx + 24} y2={cy - 10} stroke={color} strokeWidth={2} strokeLinecap="round" />
          <line x1={cx} y1={cy - 18} x2={cx - 24} y2={cy - 10} stroke={color} strokeWidth={2} strokeLinecap="round" />
        </motion.g>
        {/* Pulse rings */}
        {inView && [0, 1].map(i => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy - 18}
            r={10}
            fill="none"
            stroke={color}
            strokeWidth={0.8}
            initial={{ r: 10, opacity: 0.5 }}
            animate={{ r: [10, 32], opacity: [0.5, 0] }}
            transition={{ delay: i * 1.0, duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
      </g>
    );
  }

  if (stageId === 'B') {
    // Electrolyser with rising H2 bubbles
    return (
      <g>
        {/* Stack body */}
        <rect x={cx - 22} y={cy - 30} width={44} height={50} rx={4} fill={`${color}18`} stroke={color} strokeWidth={1} strokeOpacity={0.5} />
        {/* Horizontal stack lines */}
        {[-20, -10, 0, 10].map((dy, i) => (
          <line key={i} x1={cx - 18} y1={cy + dy} x2={cx + 18} y2={cy + dy} stroke={color} strokeWidth={0.6} strokeOpacity={0.35} />
        ))}
        {/* Bubbles rising */}
        {inView && [0, 1, 2].map(i => (
          <motion.circle
            key={i}
            cx={cx + (i - 1) * 8}
            r={3}
            fill={`${color}60`}
            initial={{ cy: cy + 24, opacity: 0 }}
            animate={{ cy: [cy + 24, cy - 50], opacity: [0, 0.9, 0] }}
            transition={{ delay: i * 0.5 + 0.3, duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
        {/* H2 text */}
        <text x={cx} y={cy + 30} textAnchor="middle" fill={color} fontSize={8} fontFamily={MONO} opacity={0.8}>
          H₂O→H₂+O₂
        </text>
      </g>
    );
  }

  if (stageId === 'C') {
    // Storage cylinders + pressure gauge
    return (
      <g>
        {/* Two cylinders */}
        {[-14, 8].map((dx, i) => (
          <g key={i}>
            <rect x={cx + dx} y={cy - 28} width={18} height={50} rx={9} fill={`${color}14`} stroke={color} strokeWidth={0.9} strokeOpacity={0.5} />
            <ellipse cx={cx + dx + 9} cy={cy - 28} rx={9} ry={4} fill={`${color}20`} stroke={color} strokeWidth={0.7} strokeOpacity={0.5} />
          </g>
        ))}
        {/* Pressure gauge */}
        <circle cx={cx + 2} cy={cy + 34} r={10} fill={CARD} stroke={color} strokeWidth={0.8} strokeOpacity={0.5} />
        {inView && (
          <motion.line
            x1={cx + 2}
            y1={cy + 34}
            x2={cx + 2}
            y2={cy + 24}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={{ rotate: -90 }}
            animate={{ rotate: ['-90deg', '30deg'] }}
            style={{ originX: cx + 2, originY: cy + 34 } as React.CSSProperties}
            transition={{ delay: 1.6, duration: 1.4, ease: 'easeOut' }}
          />
        )}
      </g>
    );
  }

  if (stageId === 'D') {
    // Truck + pipeline
    return (
      <g>
        {/* Truck cab */}
        <rect x={cx - 26} y={cy - 12} width={28} height={20} rx={3} fill={`${color}18`} stroke={color} strokeWidth={0.9} strokeOpacity={0.5} />
        {/* Truck tanker */}
        <rect x={cx - 2} y={cy - 16} width={30} height={22} rx={4} fill={`${color}12`} stroke={color} strokeWidth={0.7} strokeOpacity={0.4} />
        {/* Wheels */}
        <circle cx={cx - 16} cy={cy + 12} r={5} fill={CARD} stroke={color} strokeWidth={1} strokeOpacity={0.5} />
        <circle cx={cx + 16} cy={cy + 12} r={5} fill={CARD} stroke={color} strokeWidth={1} strokeOpacity={0.5} />
        {/* Pipeline going right */}
        <line x1={cx + 28} y1={cy - 2} x2={cx + 50} y2={cy - 2} stroke={color} strokeWidth={2} strokeOpacity={0.35} strokeLinecap="round" />
        <line x1={cx + 28} y1={cy + 4} x2={cx + 50} y2={cy + 4} stroke={color} strokeWidth={2} strokeOpacity={0.35} strokeLinecap="round" />
        {/* Motion trail on truck */}
        {inView && (
          <motion.g
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: [0, 4, 0], opacity: [0, 0.4, 0] }}
            transition={{ delay: 1.5, duration: 2.5, repeat: Infinity }}
          >
            {[6, 12, 18].map((dx, i) => (
              <line key={i} x1={cx - 30 - dx} y1={cy} x2={cx - 34 - dx} y2={cy} stroke={color} strokeWidth={1} strokeOpacity={0.3 - i * 0.08} strokeLinecap="round" />
            ))}
          </motion.g>
        )}
      </g>
    );
  }

  return null;
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function SolutionPage() {
  const tableRef = useRef<HTMLDivElement>(null);
  const tableInView = useInView(tableRef, { once: true, margin: '-60px' });

  const statCards = [
    {
      stat: 'Behind-the-meter',
      label: 'No grid queue',
      desc: 'Direct source connection. No 10–15 year wait for grid upgrades.',
      color: G,
      border: `rgba(0,214,143,0.2)`,
    },
    {
      stat: '72-hour',
      label: 'Deploy time',
      desc: 'Containerised unit. No civil works, no planning permission required.',
      color: '#38BDF8',
      border: `rgba(56,189,248,0.2)`,
    },
    {
      stat: '3–5 year',
      label: 'Return on investment',
      desc: 'At current H₂ prices and curtailment rates across UK sites.',
      color: '#A78BFA',
      border: `rgba(167,139,250,0.2)`,
    },
  ];

  const curtailmentPoints = [
    {
      title: 'Variable input tolerance',
      desc: 'Handles 10–100% of rated power continuously. No damage to the PEM stack from intermittent or fluctuating input.',
    },
    {
      title: 'Dynamic load following',
      desc: 'Proprietary algorithms adjust current density in real time, maximising efficiency across the full power range.',
    },
    {
      title: 'Cold-start in <90 seconds',
      desc: 'No warm-up period required. The plant captures every curtailment event, however short the window.',
    },
  ];

  const techCards = [
    {
      num: '01',
      title: 'Physics-based digital twin',
      body: 'PVGIS irradiance data, NOABL wind speed profiles, and real electrolyser efficiency curves — all modelled before a single piece of steel is ordered.',
      color: G,
    },
    {
      num: '02',
      title: 'AI-optimised dispatch',
      body: 'ML scheduling learns site patterns and maximises hydrogen yield per kWh. Continuously improves with operational data over time.',
      color: '#38BDF8',
    },
    {
      num: '03',
      title: 'Remote monitoring',
      body: 'Real-time stack health, production rates, and efficiency metrics via cloud dashboard. Alerts before issues become failures.',
      color: '#A78BFA',
    },
  ];

  const tableRows = [
    { attr: 'Grid connection needed', smhp: 'No', grid: 'Yes', grey: 'Yes' },
    { attr: 'Lead time',              smhp: '72 hours', grid: '5–12 years', grey: '2–4 years' },
    { attr: 'Min viable scale',       smhp: '0.5 MW', grid: '10–100 MW', grey: '50 MW+' },
    { attr: 'Input power tolerance',  smhp: '10–100%', grid: '80–100%', grey: 'N/A (gas)' },
    { attr: 'Curtailment feedstock',  smhp: 'Yes — by design', grid: 'Incompatible', grey: 'No' },
    { attr: 'Transport infrastructure', smhp: 'Optional', grid: 'Required', grey: 'Required' },
  ];

  const thStyle: React.CSSProperties = {
    fontFamily: MONO,
    fontSize: 13,
    letterSpacing: '0.08em',
    color: MUTED,
    padding: '14px 20px',
    textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontWeight: 400,
    whiteSpace: 'nowrap',
  };

  const tdBase: React.CSSProperties = {
    fontFamily: SANS,
    fontSize: 16,
    padding: '14px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    verticalAlign: 'top',
    lineHeight: 1.5,
  };

  return (
    <div style={{ background: DARK, minHeight: '100vh', color: CREAM }}>

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <div data-section style={{
        padding: 'clamp(120px, 14vw, 164px) 2rem clamp(64px, 8vw, 100px)',
        background: `linear-gradient(170deg, ${DARK} 60%, ${ALT} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, height: 400,
          background: `radial-gradient(ellipse, rgba(0,214,143,0.06) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <motion.div {...fade}>
            {/* Mono tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
              <div style={{ width: 28, height: 1, background: G }} />
              <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: G }}>
                Our Solution
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: SERIF,
              fontSize: 'clamp(44px, 7vw, 88px)',
              fontWeight: 400,
              lineHeight: 1.0,
              color: CREAM,
              marginBottom: 28,
            }}>
              Small Modular<br />
              <span style={{
                background: `linear-gradient(120deg, ${G} 0%, #00E5B8 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Hydrogen Plants
              </span>
            </h1>

            {/* Sub */}
            <p style={{
              fontFamily: SANS,
              fontSize: 'clamp(18px, 1.6vw, 19px)',
              fontWeight: 300,
              color: MUTED,
              maxWidth: 520,
              lineHeight: 1.7,
            }}>
              Containerised electrolysis that plugs directly into curtailed clean energy.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── 2. STAT CARDS ────────────────────────────────────────────────── */}
      <div data-section style={{ background: ALT, padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {statCards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              style={{
                background: CARD,
                border: `1px solid ${c.border}`,
                borderRadius: 14,
                padding: '36px 32px',
              }}
            >
              <div style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px, 3vw, 42px)',
                color: c.color,
                lineHeight: 1,
                marginBottom: 6,
              }}>
                {c.stat}
              </div>
              <div style={{
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: MUTED,
                marginBottom: 16,
              }}>
                {c.label}
              </div>
              <p style={{ fontFamily: SANS, fontSize: 16, color: MUTED, lineHeight: 1.65, fontWeight: 300 }}>
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 3. SMHP PROCESS EXPLAINER ────────────────────────────────────── */}
      <div data-section style={{ background: DARK, padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fade} style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 28, height: 1, background: G }} />
              <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: G }}>
                How it works
              </span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 52px)', color: CREAM, lineHeight: 1.1, marginBottom: 12 }}>
              From wasted electrons<br />to sellable hydrogen.
            </h2>
            <p style={{ fontFamily: SANS, fontSize: 17, color: MUTED, fontWeight: 300, maxWidth: 500, lineHeight: 1.7 }}>
              Four stages. One containerised unit. No grid connection required at any point.
            </p>
          </motion.div>

          {/* SVG diagram */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'rgba(0,214,143,0.025)',
              border: '1px solid rgba(0,214,143,0.08)',
              borderRadius: 16,
              padding: '32px 20px 24px',
              marginBottom: 32,
            }}
          >
            <SMHPDiagram />
          </motion.div>

          {/* Stage text columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { id: 'A', color: '#FBBF24', label: 'Energy Source',          desc: 'Curtailed wind, solar or hydro — behind the meter, zero feedstock cost.' },
              { id: 'B', color: G,         label: 'SMHP Container',          desc: 'PEM electrolyser splits water molecules using the captured electricity.' },
              { id: 'C', color: '#38BDF8', label: 'Compression & Storage',   desc: 'H₂ compressed onsite to 350–700 bar. Stored in certified cylinders.' },
              { id: 'D', color: '#A78BFA', label: 'Offtake at £8–12/kg',     desc: 'Delivered by tube trailer, pipeline, or consumed on-site by industrial users.' },
            ].map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.3, duration: 0.5 }}
                style={{
                  borderTop: `2px solid ${s.color}`,
                  paddingTop: 16,
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 12, color: s.color, letterSpacing: '0.2em', marginBottom: 8 }}>
                  STAGE {s.id}
                </div>
                <div style={{ fontFamily: SANS, fontSize: 16, color: CREAM, fontWeight: 600, marginBottom: 8 }}>
                  {s.label}
                </div>
                <p style={{ fontFamily: SANS, fontSize: 15, color: MUTED, lineHeight: 1.65, fontWeight: 300 }}>
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. VARIABLE POWER ────────────────────────────────────────────── */}
      <div data-section style={{ background: ALT, padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fade} style={{ marginBottom: 44 }}>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 52px)', color: CREAM, lineHeight: 1.1 }}>
              Built for the chaos<br />of curtailment.
            </h2>
            <p style={{ fontFamily: SANS, fontSize: 17, color: MUTED, fontWeight: 300, maxWidth: 480, marginTop: 14, lineHeight: 1.7 }}>
              Conventional electrolysers demand steady, grid-quality power. SMHPs are designed from the ground up for variable input.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {curtailmentPoints.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.13, duration: 0.5 }}
                style={{
                  background: CARD,
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderLeft: `3px solid ${G}`,
                  borderRadius: '0 12px 12px 0',
                  padding: '28px 28px 28px 24px',
                }}
              >
                <h3 style={{ fontFamily: SERIF, fontSize: 20, color: CREAM, marginBottom: 10 }}>
                  {p.title}
                </h3>
                <p style={{ fontFamily: SANS, fontSize: 16, color: MUTED, lineHeight: 1.7, fontWeight: 300 }}>
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. TECHNOLOGY STACK ──────────────────────────────────────────── */}
      <div data-section style={{ background: DARK, padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fade} style={{ marginBottom: 44 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 28, height: 1, background: G }} />
              <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: G }}>
                Technology
              </span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 52px)', color: CREAM, lineHeight: 1.1 }}>
              The design engine<br />behind every plant.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {techCards.map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                style={{
                  background: CARD,
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 12,
                  padding: '36px 32px',
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 12, color: STEEL, marginBottom: 18, letterSpacing: '0.18em' }}>
                  {f.num}
                </div>
                <div style={{ width: 28, height: 2, background: f.color, borderRadius: 2, marginBottom: 20 }} />
                <h4 style={{ fontFamily: SERIF, fontSize: 21, color: CREAM, marginBottom: 12, lineHeight: 1.2 }}>
                  {f.title}
                </h4>
                <p style={{ fontFamily: SANS, fontSize: 16, color: MUTED, lineHeight: 1.7, fontWeight: 300 }}>
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. COMPARISON TABLE ──────────────────────────────────────────── */}
      <div data-section style={{ background: ALT, padding: '3rem 2rem' }}>
        <div ref={tableRef} style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fade} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(26px, 3.5vw, 44px)', color: CREAM, lineHeight: 1.15 }}>
              SMHP vs conventional<br />hydrogen production.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={tableInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            style={{
              background: CARD,
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ background: 'rgba(0,214,143,0.04)' }}>
                    <th style={{ ...thStyle, color: STEEL, width: '28%' }}>Attribute</th>
                    <th style={{ ...thStyle, color: G }}>
                      <span style={{ background: `${G}18`, border: `1px solid ${G}40`, borderRadius: 6, padding: '3px 10px', fontFamily: MONO, fontSize: 12, letterSpacing: '0.1em' }}>
                        SMHP — Fluxero
                      </span>
                    </th>
                    <th style={{ ...thStyle }}>Grid-connected electrolysis</th>
                    <th style={{ ...thStyle }}>Grey H₂ (SMR)</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={tableInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: i * 0.07 + 0.3, duration: 0.4 }}
                      style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                    >
                      <td style={{ ...tdBase, color: CREAM, fontWeight: 500, fontFamily: SANS }}>
                        {row.attr}
                      </td>
                      <td style={{ ...tdBase, color: G, fontWeight: 500 }}>
                        {row.smhp}
                      </td>
                      <td style={{ ...tdBase, color: MUTED }}>
                        {row.grid}
                      </td>
                      <td style={{ ...tdBase, color: MUTED }}>
                        {row.grey}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── 7. BOTTOM CTA ────────────────────────────────────────────────── */}
      <div data-section style={{ background: DARK, padding: '5rem 2rem 6rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'rgba(0,214,143,0.03)',
              border: '1px solid rgba(0,214,143,0.1)',
              borderRadius: 18,
              padding: 'clamp(36px, 5vw, 60px) clamp(28px, 5vw, 64px)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 32,
            }}
          >
            <div>
              <div style={{ fontFamily: MONO, fontSize: 12, color: G, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
                Next steps
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(24px, 3vw, 42px)', color: CREAM, lineHeight: 1.15 }}>
                Ready to see the numbers?
              </h2>
              <p style={{ fontFamily: SANS, fontSize: 16, color: MUTED, fontWeight: 300, marginTop: 10, maxWidth: 380, lineHeight: 1.65 }}>
                Explore our unit economics, revenue model, and route to market.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link
                to="/business"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: G,
                  color: '#070608',
                  fontFamily: SANS,
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  padding: '13px 28px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Business model →
              </Link>
              <Link
                to="/traction"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'transparent',
                  color: CREAM,
                  fontFamily: SANS,
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  padding: '13px 28px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${G}60`;
                  e.currentTarget.style.color = G;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.color = CREAM;
                }}
              >
                See real traction
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
