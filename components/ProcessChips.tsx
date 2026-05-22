/**
 * ProcessChips — Armature Labs-style explainer row.
 *
 * Three (or four) bordered chips joined by dashed-circle "+" glyphs.
 * Pure HTML/CSS — no animation library required. We fade them in with
 * a tiny Framer Motion wrapper for the entrance only.
 */
import React from 'react';
import { motion } from 'framer-motion';

interface Chip {
  label: string;
  tag:   string;
  color: string;
}

const CHIPS: Chip[] = [
  { label: 'WIND · SOLAR · HYDRO', tag: 'CAPTURED',  color: '#38BDF8' },
  { label: 'DIGITAL TWIN',         tag: 'OPTIMISED', color: '#A78BFA' },
  { label: 'GREEN HYDROGEN',       tag: 'DELIVERED', color: '#00D68F' },
];

export const ProcessChips: React.FC = () => {
  return (
    <section style={{ background: '#0D0C0F', padding: '5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 48, textAlign: 'center' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 28, height: 1, background: '#00D68F' }} />
            <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#00D68F' }}>
              How it works
            </span>
            <div style={{ width: 28, height: 1, background: '#00D68F' }} />
          </div>
          <h2 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(28px, 4vw, 56px)', color: '#F0EBE0', lineHeight: 1.1, fontWeight: 400 }}>
            Three steps. Zero waste.
          </h2>
        </motion.div>

        {/* Chip row */}
        <div className="process-chip-row"
          style={{
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
            gap: 0,
            flexWrap: 'wrap',
          }}
        >
          {CHIPS.map((c, i) => (
            <React.Fragment key={c.label}>
              {/* The chip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  flex: '1 1 240px',
                  maxWidth: 320,
                  minWidth: 220,
                  padding: '28px 24px',
                  borderRadius: 14,
                  border: `1px solid ${c.color}33`,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.02), ${c.color}08)`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Tiny coloured dot in top corner */}
                <div style={{
                  position: 'absolute',
                  top: 14,
                  right: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: 999, background: c.color, boxShadow: `0 0 8px ${c.color}` }} />
                  <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: c.color, opacity: 0.7, letterSpacing: '0.12em' }}>
                    0{i + 1}
                  </span>
                </div>

                <div style={{ marginTop: 8 }}>
                  <div style={{
                    fontFamily: '"IBM Plex Sans Condensed", sans-serif',
                    fontWeight: 700,
                    fontSize: 15,
                    color: '#F0EBE0',
                    letterSpacing: '0.04em',
                    lineHeight: 1.2,
                    marginBottom: 10,
                  }}>
                    {c.label}
                  </div>

                  {/* Tag pill — like Armature's "[CAPTURED]" */}
                  <span style={{
                    display: 'inline-block',
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    color: c.color,
                    background: `${c.color}14`,
                    border: `1px solid ${c.color}33`,
                    padding: '4px 10px',
                    borderRadius: 4,
                  }}>
                    [{c.tag}]
                  </span>
                </div>
              </motion.div>

              {/* The dashed "+" joiner — only between chips */}
              {i < CHIPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 + 0.18 }}
                  className="process-chip-joiner"
                  style={{
                    flex: '0 0 56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    border: '1px dashed rgba(241, 235, 224, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(241, 235, 224, 0.55)',
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: 13,
                    lineHeight: 1,
                  }}>
                    +
                  </div>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Outcome line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            marginTop: 48,
            textAlign: 'center',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 10,
            letterSpacing: '0.18em',
            color: '#94A3B8',
            textTransform: 'uppercase',
          }}
        >
          = £8 – 12 / kg green H₂ at zero feedstock cost
        </motion.div>
      </div>

      {/* Mobile: stack vertically and turn joiner sideways */}
      <style>{`
        @media (max-width: 720px) {
          .process-chip-row { flex-direction: column; align-items: center; gap: 8px; }
          .process-chip-joiner { transform: rotate(90deg); flex: 0 0 36px !important; }
        }
      `}</style>
    </section>
  );
};
