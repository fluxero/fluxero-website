import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const ANNUAL_TWH = 472; // 310 wind + 140 solar + 22 hydro
const TWH_PER_SECOND = ANNUAL_TWH / (365.25 * 24 * 3600);

const GAUGES = [
  {
    label: 'Wind',
    value: 310,
    max: 400,
    color: '#94A3B8',
    icon: '🌬',
  },
  {
    label: 'Solar',
    value: 140,
    max: 200,
    color: '#FBBF24',
    icon: '☀',
  },
  {
    label: 'Hydro',
    value: 22,
    max: 50,
    color: '#38BDF8',
    icon: '💧',
  },
] as const;

const COUNTRIES = [
  {
    flag: '🇨🇳',
    country: 'China',
    stat: '66 TWh curtailed in 2024',
    description: 'World\'s largest solar curtailment — rapid capacity additions outpacing grid infrastructure.',
    accent: '#00D68F',
  },
  {
    flag: '🇩🇪',
    country: 'Germany',
    stat: 'Wind curtailment up 40% in 2024',
    description: 'North Sea offshore capacity exceeds southern demand. Grid balancing costs rising sharply.',
    accent: '#FBBF24',
  },
  {
    flag: '🇬🇧',
    country: 'United Kingdom',
    stat: '8.3 TWh wind + 1.5 TWh solar wasted in 2024',
    description: "That's enough to power 3 million homes for a year. B6 transmission bottleneck is the primary cause.",
    accent: '#38BDF8',
  },
] as const;

/* ─────────────────────────────────────────────
   Circular Gauge (SVG ring)
───────────────────────────────────────────── */
const RADIUS = 54;
const STROKE_WIDTH = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 339.3

interface GaugeProps {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: string;
  index: number;
}

const CircularGauge: React.FC<GaugeProps> = ({ label, value, max, color, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [dashOffset, setDashOffset] = useState(CIRCUMFERENCE);

  useEffect(() => {
    if (!isInView) return;
    const targetFraction = value / max;
    const targetOffset = CIRCUMFERENCE * (1 - targetFraction);
    const controls = animate(CIRCUMFERENCE, targetOffset, {
      duration: 1.6,
      delay: index * 0.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: v => setDashOffset(v),
    });
    return () => controls.stop();
  }, [isInView, value, max, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
    >
      {/* SVG ring */}
      <div style={{ position: 'relative', width: 128, height: 128 }}>
        <svg
          width={128}
          height={128}
          viewBox="0 0 128 128"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background track */}
          <circle
            cx={64}
            cy={64}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={STROKE_WIDTH}
          />
          {/* Animated foreground */}
          <circle
            cx={64}
            cy={64}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        </svg>
        {/* Center text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <span
            className="font-display font-black tabular-nums"
            style={{ fontSize: 20, lineHeight: 1, color }}
          >
            {value}
          </span>
          <span className="font-mono" style={{ fontSize: 11, color: '#64748B', letterSpacing: '0.05em' }}>
            TWh/yr
          </span>
        </div>
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center' }}>
        <p className="font-display font-bold text-lg" style={{ color: '#F1F5F9', marginBottom: 2 }}>
          {label}
        </p>
        <p className="font-mono" style={{ fontSize: 14, color: '#64748B', letterSpacing: '0.08em' }}>
          wasted annually
        </p>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Global Counter
───────────────────────────────────────────── */
const GlobalCounter: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [totalTWh, setTotalTWh] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isInView) return;
    // Start from 0 and increment
    setTotalTWh(0);
    intervalRef.current = setInterval(() => {
      setTotalTWh(prev => prev + TWH_PER_SECOND);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        textAlign: 'center',
        padding: '48px 32px',
        background: 'rgba(0,214,143,0.03)',
        border: '1px solid rgba(0,214,143,0.12)',
        borderRadius: 16,
        margin: '0 auto',
        maxWidth: 720,
      }}
    >
      <p
        className="font-mono uppercase tracking-widest"
        style={{ fontSize: 15, color: '#00D68F', marginBottom: 16, letterSpacing: '0.2em' }}
      >
        Energy wasted globally this year
      </p>
      <div
        className="font-display font-black counter tabular-nums"
        style={{
          fontSize: 'clamp(50px, 7vw, 84px)',
          lineHeight: 1,
          color: '#00D68F',
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 0 40px rgba(0,214,143,0.3)',
          marginBottom: 8,
        }}
      >
        {totalTWh.toFixed(3)}
        <span style={{ fontSize: '0.4em', color: '#94A3B8', marginLeft: 8, fontWeight: 700 }}>TWh</span>
      </div>
      <p className="font-mono" style={{ fontSize: 15, color: '#475569', marginTop: 16 }}>
        Based on IEA &amp; IRENA 2024 estimates. Growing 15% year-on-year.
      </p>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Country Card
───────────────────────────────────────────── */
interface CountryCardProps {
  flag: string;
  country: string;
  stat: string;
  description: string;
  accent: string;
  index: number;
}

const CountryCard: React.FC<CountryCardProps> = ({ flag, country, stat, description, accent, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flex: '1 1 260px',
        background: '#131116',
        border: `1px solid ${accent}28`,
        borderTop: `3px solid ${accent}`,
        borderRadius: 12,
        padding: '32px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 26 }}>{flag}</span>
        <span className="font-display font-bold" style={{ fontSize: 19, color: '#F1F5F9' }}>
          {country}
        </span>
      </div>
      <p
        className="font-display font-black"
        style={{ fontSize: 17, color: accent, marginBottom: 10, lineHeight: 1.3 }}
      >
        {stat}
      </p>
      <p className="font-body text-xl" style={{ color: '#94A3B8', lineHeight: 1.6 }}>
        {description}
      </p>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Main Section
───────────────────────────────────────────── */
export const WastedEnergy: React.FC = () => {
  const headlineRef = useRef<HTMLDivElement>(null);
  const headlineInView = useInView(headlineRef, { once: true, margin: '-80px' });

  return (
    <section
      id="wasted-energy"
      style={{ background: '#070608', padding: '112px 0' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}>
          <div style={{ width: 32, height: 1, background: '#00D68F' }} />
          <span
            className="font-mono uppercase"
            style={{ fontSize: 15, letterSpacing: '0.25em', color: '#00D68F' }}
          >
            Global Waste
          </span>
        </div>

        {/* Headline */}
        <div ref={headlineRef} style={{ marginBottom: 24 }}>
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            animate={headlineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black"
            style={{
              fontSize: 'clamp(46px, 6vw, 92px)',
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              marginBottom: 0,
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 60%, #00D68F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block',
              }}
            >
              THE WASTE IS GLOBAL.
            </span>
            <span
              style={{
                background: 'linear-gradient(135deg, #00D68F 0%, #34D399 50%, #F1F5F9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block',
              }}
            >
              SO IS THE OPPORTUNITY.
            </span>
          </motion.h2>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={headlineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-body"
          style={{
            fontSize: 'clamp(20px, 2vw, 24px)',
            color: '#94A3B8',
            maxWidth: 600,
            lineHeight: 1.65,
            marginBottom: 80,
          }}
        >
          Renewable energy is being thrown away every second across the planet.
          Fluxero exists to capture it.
        </motion.p>

        {/* ── Circular Gauges ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '48px 80px',
            marginBottom: 80,
          }}
        >
          {GAUGES.map((g, i) => (
            <CircularGauge key={g.label} {...g} index={i} />
          ))}
        </div>

        {/* ── Global Counter ── */}
        <div style={{ marginBottom: 80 }}>
          <GlobalCounter />
        </div>

        {/* ── Country Cards ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          {COUNTRIES.map((c, i) => (
            <CountryCard key={c.country} {...c} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
};
