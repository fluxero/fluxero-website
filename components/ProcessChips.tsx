/**
 * ProcessChips — animated three-stage pipeline.
 *
 *   WIND·SOLAR·HYDRO [CAPTURED]   →   DIGITAL TWIN [OPTIMISED]   →   GREEN HYDROGEN [DELIVERED]
 *
 * Animation layers:
 *   1. Staggered chip entrance on scroll-into-view
 *   2. Continuous breathing radial gradient inside each chip
 *   3. Rotating dashed orbit + pulsing dot around the corner number
 *   4. Pulsing box-shadow on the tag pill
 *   5. SVG connector lines that draw on view, then continuously shuttle
 *      glowing particles from one chip to the next
 *   6. Section-wide horizontal shimmer behind the row
 */
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ChipDef {
  label: string;
  tag:   string;
  desc:  string;
  color: string;
  rgb:   string;
}

const CHIPS: ChipDef[] = [
  { label: 'WIND · SOLAR · HYDRO', tag: 'CAPTURED',  desc: 'Curtailed renewable feedstock at zero cost.',  color: '#38BDF8', rgb: '56,189,248'  },
  { label: 'DIGITAL TWIN',         tag: 'OPTIMISED', desc: 'AI dispatch + physics-based site model.',      color: '#A78BFA', rgb: '167,139,250' },
  { label: 'GREEN HYDROGEN',       tag: 'DELIVERED', desc: '£8 – 12 / kg at the point of offtake.',         color: '#00D68F', rgb: '0,214,143'   },
];

/* ── Connector with drawn line + travelling particles ───────────────── */
const Connector: React.FC<{ from: ChipDef; to: ChipDef; index: number; inView: boolean }> = ({ from, to, index, inView }) => {
  const gradId = `flux-grad-${index}`;
  const glow   = `flux-glow-${index}`;
  return (
    <div className="process-chip-joiner" style={{ flex: '0 0 80px', height: 96, position: 'relative' }}>
      <svg viewBox="0 0 80 96" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%"   stopColor={from.color} stopOpacity="0.55" />
            <stop offset="50%"  stopColor="#F0EBE0"    stopOpacity="0.35" />
            <stop offset="100%" stopColor={to.color}   stopOpacity="0.55" />
          </linearGradient>
          <filter id={glow}>
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* dashed background track */}
        <motion.line
          x1={4} y1={48} x2={76} y2={48}
          stroke="rgba(241,235,224,0.12)" strokeWidth={1} strokeDasharray="3 4"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.25 + index * 0.35, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* coloured current line */}
        <motion.line
          x1={4} y1={48} x2={76} y2={48}
          stroke={`url(#${gradId})`} strokeWidth={1.5} strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 + index * 0.35, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* fast lead particle */}
        <motion.circle
          r={3.5} cy={48} fill={to.color} filter={`url(#${glow})`}
          initial={{ cx: 4, opacity: 0 }}
          animate={inView ? { cx: [4, 76], opacity: [0, 1, 1, 0] } : {}}
          transition={{
            duration: 1.8, repeat: Infinity, ease: 'linear',
            delay: 1.2 + index * 0.4, times: [0, 0.1, 0.9, 1], repeatDelay: 0.4,
          }}
        />

        {/* slower trailing particle */}
        <motion.circle
          r={2} cy={48} fill={from.color} opacity={0.75} filter={`url(#${glow})`}
          initial={{ cx: 4, opacity: 0 }}
          animate={inView ? { cx: [4, 76], opacity: [0, 0.7, 0.7, 0] } : {}}
          transition={{
            duration: 2.4, repeat: Infinity, ease: 'linear',
            delay: 2.0 + index * 0.4, times: [0, 0.1, 0.9, 1], repeatDelay: 0.4,
          }}
        />

        {/* rotating dashed ring at midpoint */}
        <motion.circle
          cx={40} cy={48} r={11}
          fill="none" stroke="rgba(241,235,224,0.20)" strokeWidth={1} strokeDasharray="2 3"
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '40px 48px' }}
        />
        <text x={40} y={52} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize={13} fill="rgba(241,235,224,0.55)">+</text>
      </svg>
    </div>
  );
};

/* ── Single chip ────────────────────────────────────────────────────── */
const Chip: React.FC<{ chip: ChipDef; index: number; inView: boolean }> = ({ chip, index, inView }) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.96 }}
    animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
    transition={{ duration: 0.7, delay: index * 0.35, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    style={{
      position: 'relative',
      flex: '1 1 260px',
      maxWidth: 340,
      minWidth: 230,
      padding: '30px 24px 26px',
      borderRadius: 16,
      border: `1px solid rgba(${chip.rgb},0.28)`,
      background: `linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(${chip.rgb},0.04) 100%)`,
      overflow: 'hidden',
      cursor: 'default',
    }}
  >
    {/* breathing radial gradient */}
    <motion.div
      animate={{ opacity: [0.35, 0.7, 0.35] }}
      transition={{ duration: 4.5, repeat: Infinity, delay: index * 0.6, ease: 'easeInOut' }}
      style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(circle at 60% 110%, rgba(${chip.rgb},0.18) 0%, transparent 60%)`,
      }}
    />

    {/* top-edge tracer */}
    <motion.div
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 0.8, delay: 0.2 + index * 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${chip.color}, transparent)`,
        transformOrigin: 'center',
        pointerEvents: 'none',
      }}
    />

    {/* number badge w/ rotating dashed orbit */}
    <div style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0, border: `1px dashed rgba(${chip.rgb},0.5)`, borderRadius: 999 }}
      />
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
        style={{
          position: 'absolute', top: 11, left: 11, width: 8, height: 8,
          borderRadius: 999, background: chip.color, boxShadow: `0 0 10px ${chip.color}`,
        }}
      />
    </div>

    {/* step number */}
    <div style={{
      position: 'absolute', top: 21, right: 56,
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: 11, letterSpacing: '0.15em',
      color: `rgba(${chip.rgb},0.85)`,
    }}>
      0{index + 1}
    </div>

    {/* body */}
    <div style={{ position: 'relative', marginTop: 4 }}>
      <div style={{
        fontFamily: '"IBM Plex Sans Condensed", sans-serif',
        fontWeight: 700, fontSize: 17, color: '#F0EBE0',
        letterSpacing: '0.04em', lineHeight: 1.2, marginBottom: 12,
      }}>
        {chip.label}
      </div>

      <motion.span
        animate={{
          boxShadow: [
            `0 0 0px rgba(${chip.rgb},0)`,
            `0 0 16px rgba(${chip.rgb},0.55)`,
            `0 0 0px rgba(${chip.rgb},0)`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.8 + index * 0.5 }}
        style={{
          display: 'inline-block',
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 12, letterSpacing: '0.16em',
          color: chip.color,
          background: `rgba(${chip.rgb},0.10)`,
          border: `1px solid rgba(${chip.rgb},0.38)`,
          padding: '5px 12px', borderRadius: 4,
        }}
      >
        [{chip.tag}]
      </motion.span>

      <div style={{
        marginTop: 14,
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontSize: 13, color: '#94A3B8', lineHeight: 1.55, fontWeight: 300,
      }}>
        {chip.desc}
      </div>
    </div>
  </motion.div>
);

/* ── Public ─────────────────────────────────────────────────────────── */
export const ProcessChips: React.FC = () => {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      style={{
        background: '#0D0C0F',
        padding: '5rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ambient horizontal shimmer */}
      <motion.div
        animate={{ opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', left: 0, right: 0, top: '50%',
          height: 240, marginTop: -120,
          background: 'radial-gradient(ellipse 60% 90% at 50% 50%, rgba(0,214,143,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 56, textAlign: 'center' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 28, height: 1, background: '#00D68F' }} />
            <span style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 13, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#00D68F',
            }}>
              How it works
            </span>
            <div style={{ width: 28, height: 1, background: '#00D68F' }} />
          </div>
          <h2 style={{
            fontFamily: '"DM Serif Display", serif',
            fontSize: 'clamp(30px, 4vw, 56px)',
            color: '#F0EBE0', lineHeight: 1.1, fontWeight: 400,
          }}>
            Three steps. Zero waste.
          </h2>
        </motion.div>

        <div className="process-chip-row" style={{
          display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: 0,
        }}>
          {CHIPS.map((c, i) => (
            <React.Fragment key={c.label}>
              <Chip chip={c} index={i} inView={inView} />
              {i < CHIPS.length - 1 && (
                <Connector from={c} to={CHIPS[i + 1]} index={i} inView={inView} />
              )}
            </React.Fragment>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.5 }}
          style={{
            marginTop: 56, textAlign: 'center',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 13, letterSpacing: '0.18em',
            color: '#94A3B8', textTransform: 'uppercase',
          }}
        >
          ={'  '}£8 – 12 / kg green H₂{'  '}at zero feedstock cost
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .process-chip-row { flex-direction: column; align-items: center; gap: 8px; }
          .process-chip-joiner { transform: rotate(90deg); flex: 0 0 64px !important; width: 80px; }
        }
      `}</style>
    </section>
  );
};
