import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// ─── Design tokens ────────────────────────────────────────────────────────────
const G      = '#00D68F';
const G2     = '#00E5B8';
const SOLAR  = '#FBBF24';
const WIND   = '#94A3B8';
const HYDRO  = '#38BDF8';
const WASTE  = '#EF4444';
const INK2   = '#131116';

const SCENE_DURATION = 3000; // ms

// ─── Scene metadata ────────────────────────────────────────────────────────────
const SCENES = [
  { id: 0, label: '01', title: 'Wasted clean energy',   desc: 'Wind, solar & hydro generate more than the grid accepts. The excess is curtailed — switched off, wasted.' },
  { id: 1, label: '02', title: 'The grid rejects it',   desc: '8.3 TWh curtailed in the UK in 2024 alone. Generators are paid to switch off. The cost falls on consumers.' },
  { id: 2, label: '03', title: 'Captured at source',    desc: "Fluxero's SMHP connects directly to the generation site — no grid connection needed. Energy that was wasted becomes feedstock." },
  { id: 3, label: '04', title: 'Converted to hydrogen', desc: 'PEM electrolysis splits water using captured electricity. ~55 kWh produces 1 kg of green hydrogen. Zero carbon.' },
  { id: 4, label: '05', title: 'Delivered to market',   desc: 'Green hydrogen sells at £8–12/kg. Used for mobility, industrial processes, and grid-scale energy storage.' },
  { id: 5, label: '06', title: 'AI-optimised always',   desc: "Our digital twin — built on NGSPICE physics, real PVGIS and NOABL data — continuously optimises every site's output." },
];

// ─── Scene 0: Sources flowing ──────────────────────────────────────────────────
const Scene0: React.FC = () => (
  <svg viewBox="0 0 520 420" style={{ width: '100%', height: '100%' }}>
    {/* Solar source */}
    <circle cx={70} cy={100} r={20} fill="none" stroke={SOLAR} strokeWidth={1.5} opacity={0.8} />
    <circle cx={70} cy={100} r={10} fill={SOLAR} opacity={0.7} />
    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
      <line
        key={i}
        x1={70 + Math.cos((i * Math.PI) / 4) * 22}
        y1={100 + Math.sin((i * Math.PI) / 4) * 22}
        x2={70 + Math.cos((i * Math.PI) / 4) * 28}
        y2={100 + Math.sin((i * Math.PI) / 4) * 28}
        stroke={SOLAR}
        strokeWidth={2}
        opacity={0.7}
      />
    ))}
    <text x={70} y={138} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={9} fill={SOLAR} opacity={0.8}>SOLAR</text>

    {/* Wind source */}
    {[0, 1, 2].map(i => (
      <path
        key={i}
        d={`M 40 ${190 + i * 8} Q 70 ${186 + i * 8} 100 ${190 + i * 8}`}
        fill="none"
        stroke={WIND}
        strokeWidth={1.5}
        opacity={0.7 - i * 0.1}
      />
    ))}
    <text x={70} y={232} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={9} fill={WIND} opacity={0.8}>WIND</text>

    {/* Hydro source */}
    {[0, 1, 2].map(i => (
      <path
        key={i}
        d={`M 40 ${298 + i * 9} Q 55 ${294 + i * 9} 70 ${298 + i * 9} Q 85 ${302 + i * 9} 100 ${298 + i * 9}`}
        fill="none"
        stroke={HYDRO}
        strokeWidth={1.5}
        opacity={0.7 - i * 0.1}
      />
    ))}
    <text x={70} y={336} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={9} fill={HYDRO} opacity={0.8}>HYDRO</text>

    {/* Flowing particles from each source */}
    {[
      { cy: 100, color: SOLAR },
      { cy: 200, color: WIND },
      { cy: 305, color: HYDRO },
    ].map(({ cy, color }) =>
      [0, 1, 2, 3, 4].map(i => (
        <motion.circle
          key={`${cy}-${i}`}
          r={3}
          fill={color}
          cy={cy}
          animate={{ cx: [120, 460], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: 2.2, delay: i * 0.44, repeat: Infinity, ease: 'linear' }}
        />
      ))
    )}

    {/* GRID label on right */}
    <text x={470} y={215} textAnchor="end" fontFamily='"IBM Plex Mono",monospace' fontSize={10} fill="rgba(148,163,184,0.5)">→ GRID</text>
  </svg>
);

// ─── Scene 1: Curtailment ──────────────────────────────────────────────────────
const Scene1: React.FC = () => (
  <svg viewBox="0 0 520 420" style={{ width: '100%', height: '100%' }}>
    {/* Sources (smaller) */}
    <circle cx={55} cy={100} r={14} fill={SOLAR} opacity={0.5} />
    <text x={55} y={122} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={8} fill={SOLAR} opacity={0.6}>SOLAR</text>
    <path d="M 35 200 Q 55 196 75 200 Q 95 204 115 200" fill="none" stroke={WIND} strokeWidth={1.5} opacity={0.5} />
    <text x={55} y={222} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={8} fill={WIND} opacity={0.6}>WIND</text>
    <path d="M 35 298 Q 55 294 75 298 Q 95 302 115 298" fill="none" stroke={HYDRO} strokeWidth={1.5} opacity={0.5} />
    <text x={55} y={318} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={8} fill={HYDRO} opacity={0.6}>HYDRO</text>

    {/* Grid limit line */}
    <motion.line
      x1={280} y1={20} x2={280} y2={400}
      stroke={WASTE} strokeWidth={1.5} strokeDasharray="6 4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ duration: 0.5 }}
    />
    <text x={280} y={15} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={9} fill={WASTE}>GRID LIMIT</text>

    {/* Particles hitting limit and falling */}
    {[
      { startY: 100, color: SOLAR },
      { startY: 200, color: WIND },
      { startY: 305, color: HYDRO },
    ].map(({ startY, color: _color }) =>
      [0, 1, 2].map(i => (
        <motion.circle
          key={`${startY}-${i}`}
          r={3}
          fill={WASTE}
          animate={{
            cx: [120, 280, 280, 290],
            cy: [startY, startY, startY, startY + 120],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{ duration: 2.5, delay: i * 0.6 + 0.3, repeat: Infinity, ease: 'linear' }}
        />
      ))
    )}

    {/* WASTED label */}
    <motion.text
      x={330} y={380}
      textAnchor="middle"
      fontFamily='"IBM Plex Mono",monospace'
      fontSize={11}
      fill={WASTE}
      animate={{ opacity: [0.4, 0.9, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      WASTED
    </motion.text>

    {/* Stats */}
    <text x={380} y={200} fontFamily='"IBM Plex Mono",monospace' fontSize={9} fill="rgba(148,163,184,0.5)" textAnchor="middle">8.3 TWh</text>
    <text x={380} y={215} fontFamily='"IBM Plex Mono",monospace' fontSize={8} fill="rgba(148,163,184,0.35)" textAnchor="middle">curtailed · UK · 2024</text>
  </svg>
);

// ─── Scene 2: SMHP Capture ─────────────────────────────────────────────────────
const Scene2: React.FC = () => (
  <svg viewBox="0 0 520 420" style={{ width: '100%', height: '100%' }}>
    {/* Sources small */}
    <circle cx={55} cy={100} r={12} fill={SOLAR} opacity={0.5} />
    <text x={55} y={120} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={8} fill={SOLAR} opacity={0.6}>SOLAR</text>
    <path d="M 35 200 Q 55 196 75 200" fill="none" stroke={WIND} strokeWidth={1.5} opacity={0.5} />
    <text x={55} y={218} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={8} fill={WIND} opacity={0.6}>WIND</text>
    <path d="M 35 300 Q 55 296 75 300" fill="none" stroke={HYDRO} strokeWidth={1.5} opacity={0.5} />
    <text x={55} y={318} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={8} fill={HYDRO} opacity={0.6}>HYDRO</text>

    {/* Glow behind SMHP */}
    <ellipse cx={360} cy={210} rx={80} ry={55} fill="rgba(0,214,143,0.04)" />

    {/* SMHP box */}
    <motion.rect
      x={280} y={155} width={160} height={110} rx={8}
      fill="rgba(0,214,143,0.04)" stroke={G} strokeWidth={1.5} strokeDasharray="6 4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    />

    {/* SMHP label */}
    <text x={360} y={205} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={13} fontWeight="bold" fill={G}>SMHP</text>
    <text x={360} y={222} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={8} fill="rgba(0,214,143,0.6)">ELECTROLYSER</text>

    {/* Particles redirecting to SMHP */}
    {[
      { startY: 100, color: SOLAR },
      { startY: 200, color: WIND },
      { startY: 300, color: HYDRO },
    ].map(({ startY }) =>
      [0, 1, 2].map(i => (
        <motion.circle
          key={`${startY}-${i}`}
          r={3}
          fill={G}
          animate={{ cx: [120, 280, 360], cy: [startY, startY, 210], opacity: [0, 0.9, 0.9] }}
          transition={{ duration: 2, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))
    )}

    {/* No-grid-needed label */}
    <text x={360} y={295} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={9} fill="rgba(0,214,143,0.55)">NO GRID CONNECTION</text>
  </svg>
);

// ─── Scene 3: Electrolysis ─────────────────────────────────────────────────────
const Scene3: React.FC = () => (
  <svg viewBox="0 0 520 420" style={{ width: '100%', height: '100%' }}>
    {/* Electrolyser box center */}
    <rect x={175} y={130} width={170} height={160} rx={10} fill="rgba(0,214,143,0.05)" stroke={G} strokeWidth={1.5} />
    <text x={260} y={200} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={11} fontWeight="bold" fill={G}>ELECTRO-</text>
    <text x={260} y={216} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={11} fontWeight="bold" fill={G}>LYSER</text>
    <text x={260} y={270} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={8} fill="rgba(0,214,143,0.5)">PEM · 55 kWh/kg</text>

    {/* H2O entering from left */}
    {[0, 1, 2].map(i => (
      <motion.g key={i}>
        <motion.circle
          r={8}
          fill={HYDRO}
          opacity={0.7}
          animate={{ cx: [60, 170], cy: [210, 210], opacity: [0, 0.7, 0] }}
          transition={{ duration: 1.8, delay: i * 0.6, repeat: Infinity }}
        />
        <motion.text
          textAnchor="middle"
          fontFamily='"IBM Plex Mono",monospace'
          fontSize={7}
          fill={HYDRO}
          animate={{ x: [60, 170], opacity: [0, 0.7, 0] }}
          style={{ y: 213 } as React.CSSProperties}
          transition={{ duration: 1.8, delay: i * 0.6, repeat: Infinity }}
        >
          H₂O
        </motion.text>
      </motion.g>
    ))}

    {/* H2 emerging from right */}
    {[0, 1, 2].map(i => (
      <motion.g key={i}>
        <motion.circle
          r={7}
          fill={G}
          opacity={0.8}
          animate={{ cx: [350, 460], cy: [210, 210 + (i - 1) * 30], opacity: [0, 0.9, 0] }}
          transition={{ duration: 1.8, delay: i * 0.5 + 0.4, repeat: Infinity }}
        />
        <motion.text
          textAnchor="middle"
          fontFamily='"IBM Plex Mono",monospace'
          fontSize={7}
          fontWeight="bold"
          fill={G}
          animate={{ x: [350, 460], opacity: [0, 0.9, 0] }}
          style={{ y: 213 + (i - 1) * 30 } as React.CSSProperties}
          transition={{ duration: 1.8, delay: i * 0.5 + 0.4, repeat: Infinity }}
        >
          H₂
        </motion.text>
      </motion.g>
    ))}

    {/* Labels */}
    <text x={90} y={355} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={9} fill={HYDRO} opacity={0.7}>WATER IN</text>
    <text x={420} y={355} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={9} fill={G} opacity={0.7}>H₂ OUT</text>
    <text x={260} y={395} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={8} fill="rgba(148,163,184,0.4)">Zero carbon · Green certified</text>
  </svg>
);

// ─── Scene 4: Distribution ─────────────────────────────────────────────────────
const Scene4: React.FC = () => (
  <svg viewBox="0 0 520 420" style={{ width: '100%', height: '100%' }}>
    {/* H2 source left */}
    <circle cx={80} cy={210} r={36} fill="rgba(0,214,143,0.08)" stroke={G} strokeWidth={1.5} />
    <text x={80} y={206} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={14} fontWeight="bold" fill={G}>H₂</text>
    <text x={80} y={221} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={8} fill="rgba(0,214,143,0.6)">STORAGE</text>

    {/* Three destination arrows */}
    {[
      { y: 110, label: 'MOBILITY',   sub: 'Transport · Fuel cells' },
      { y: 210, label: 'INDUSTRY',   sub: 'Steel · Ammonia · Chemical' },
      { y: 310, label: 'GRID STORE', sub: 'Seasonal energy storage' },
    ].map(({ y, label, sub }, i) => (
      <g key={i}>
        {/* Animated arrow line */}
        <motion.line
          x1={125} y1={210} x2={320} y2={y}
          stroke={G} strokeWidth={1.5} strokeDasharray="6 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1, delay: i * 0.3 + 0.2, repeat: Infinity, repeatDelay: 1.5 }}
        />
        {/* Dot on destination */}
        <circle cx={325} cy={y} r={4} fill={G} opacity={0.8} />
        {/* Label */}
        <text x={340} y={y - 6} fontFamily='"IBM Plex Mono",monospace' fontSize={11} fontWeight="bold" fill="#F0EBE0">{label}</text>
        <text x={340} y={y + 8} fontFamily='"IBM Plex Mono",monospace' fontSize={8} fill="rgba(148,163,184,0.6)">{sub}</text>
      </g>
    ))}

    {/* Price label */}
    <text x={460} y={30} textAnchor="end" fontFamily='"IBM Plex Mono",monospace' fontSize={14} fontWeight="bold" fill={G}>£8–12/kg</text>
    <text x={460} y={46} textAnchor="end" fontFamily='"IBM Plex Mono",monospace' fontSize={8} fill="rgba(148,163,184,0.5)">current UK market</text>
  </svg>
);

// ─── Scene 5: AI Optimisation ──────────────────────────────────────────────────
const Scene5: React.FC = () => (
  <svg viewBox="0 0 520 420" style={{ width: '100%', height: '100%' }}>
    {/* Background grid dots */}
    {[0, 1, 2, 3, 4, 5].map(row =>
      [0, 1, 2, 3, 4, 5, 6, 7].map(col => (
        <circle key={`${row}-${col}`} cx={30 + col * 66} cy={30 + row * 66} r={1.5} fill="rgba(0,214,143,0.12)" />
      ))
    )}
    {/* Some connections */}
    {([[0,0,1,1],[1,2,2,3],[3,1,4,2],[2,4,3,5]] as [number,number,number,number][]).map(([r1,c1,r2,c2], i) => (
      <line key={i} x1={30+c1*66} y1={30+r1*66} x2={30+c2*66} y2={30+r2*66} stroke="rgba(0,214,143,0.06)" strokeWidth={1} />
    ))}

    {/* Central dashboard */}
    <rect x={110} y={80} width={300} height={260} rx={12} fill="rgba(19,17,22,0.95)" stroke="rgba(0,214,143,0.2)" strokeWidth={1} />

    {/* Status indicator */}
    <motion.circle
      cx={132} cy={108} r={5} fill={G}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <text x={145} y={112} fontFamily='"IBM Plex Mono",monospace' fontSize={10} fill={G}>DIGITAL TWIN ACTIVE</text>

    {/* Divider */}
    <line x1={120} y1={125} x2={400} y2={125} stroke="rgba(0,214,143,0.1)" strokeWidth={1} />

    {/* Metrics */}
    {[
      { label: 'EFFICIENCY',     value: '94.2%',  color: G,         y: 175 },
      { label: 'H₂ OUTPUT GAIN', value: '+40%',   color: G2,        y: 235 },
      { label: 'COST / KG',      value: '£7.80',  color: '#F0EBE0', y: 295 },
    ].map(({ label, value, color, y }) => (
      <g key={label}>
        <text x={135} y={y - 10} fontFamily='"IBM Plex Mono",monospace' fontSize={9} fill="rgba(148,163,184,0.6)">{label}</text>
        <motion.text
          x={135} y={y + 10}
          fontFamily='"DM Serif Display",serif'
          fontSize={28}
          fill={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {value}
        </motion.text>
      </g>
    ))}

    {/* Footer */}
    <text x={260} y={355} textAnchor="middle" fontFamily='"IBM Plex Mono",monospace' fontSize={9} fill="rgba(148,163,184,0.4)">NGSPICE · PVGIS · NOABL DATA</text>
  </svg>
);

// ─── Scene dispatcher ──────────────────────────────────────────────────────────
const SceneComponent: React.FC<{ scene: number }> = ({ scene }) => {
  switch (scene) {
    case 0: return <Scene0 />;
    case 1: return <Scene1 />;
    case 2: return <Scene2 />;
    case 3: return <Scene3 />;
    case 4: return <Scene4 />;
    case 5: return <Scene5 />;
    default: return <Scene0 />;
  }
};

// ─── Main export ───────────────────────────────────────────────────────────────
export const EnergyExplainer: React.FC = () => {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setScene(s => (s + 1) % SCENES.length);
    }, SCENE_DURATION);
    setPlaying(true);
  };

  useEffect(() => {
    if (isInView) startPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  // suppress unused-variable warning from the playing state (kept for future use)
  void playing;

  return (
    <section style={{ background: '#0D0C0F', padding: '6rem 0' }}>
      <div ref={containerRef} style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          <div style={{ width: 32, height: 1, background: G }} />
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: G }}>
            How it works
          </span>
        </div>

        <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(28px, 4vw, 52px)', color: '#F0EBE0', marginBottom: 56, lineHeight: 1.1 }}>
          From wasted megawatts<br />
          <span style={{ background: 'linear-gradient(135deg, #00A86B, #00D68F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            to green hydrogen.
          </span>
        </h2>

        {/* Two-column layout */}
        <div className="energy-explainer-grid" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 48, alignItems: 'start' }}>

          {/* LEFT: Animation card */}
          <div
            style={{
              background: INK2,
              border: `1px solid rgba(0,214,143,0.12)`,
              borderRadius: 16,
              overflow: 'hidden',
              position: 'relative',
            }}
            onMouseEnter={() => { if (intervalRef.current) clearInterval(intervalRef.current); }}
            onMouseLeave={() => startPlay()}
          >
            {/* Scene display */}
            <div className="energy-scene" style={{ height: 420, position: 'relative', overflow: 'hidden' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <SceneComponent scene={scene} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div style={{ height: 2, background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                key={`progress-${scene}`}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: SCENE_DURATION / 1000, ease: 'linear' }}
                style={{ height: '100%', background: G }}
              />
            </div>
          </div>

          {/* RIGHT: Scene info */}
          <div style={{ paddingTop: 8 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={scene}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, color: G, letterSpacing: '0.2em', marginBottom: 16 }}>
                  {SCENES[scene].label} / {SCENES.length.toString().padStart(2, '0')}
                </div>
                <h3 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(22px, 2.5vw, 32px)', color: '#F0EBE0', marginBottom: 16, lineHeight: 1.2 }}>
                  {SCENES[scene].title}
                </h3>
                <p style={{ fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 15, color: '#A8A3B3', lineHeight: 1.7, fontWeight: 300, marginBottom: 32 }}>
                  {SCENES[scene].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Scene dots */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              {SCENES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setScene(i); startPlay(); }}
                  style={{
                    width: i === scene ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: i === scene ? G : 'rgba(255,255,255,0.15)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setScene(s => (s - 1 + SCENES.length) % SCENES.length); startPlay(); }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  padding: '8px 16px',
                  color: '#A8A3B3',
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                ← Prev
              </button>
              <button
                onClick={() => { setScene(s => (s + 1) % SCENES.length); startPlay(); }}
                style={{
                  background: 'rgba(0,214,143,0.06)',
                  border: '1px solid rgba(0,214,143,0.18)',
                  borderRadius: 8,
                  padding: '8px 16px',
                  color: G,
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Next →
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
