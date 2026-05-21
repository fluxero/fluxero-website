import React from 'react';
import { motion } from 'framer-motion';

/* ─── Individual Partner Logos (inline SVG wordmarks) ─── */

// Barclays Eagle Labs — uses Barclays' signature blue (#00AEEF) + eagle motif
const BarclaysEagleLabs: React.FC = () => (
  <svg viewBox="0 0 220 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Barclays Eagle Labs">
    {/* Eagle simplified icon */}
    <path
      d="M12 26 C12 26 8 18 14 14 C18 11 22 14 22 18 C22 22 18 24 18 26 C18 28 20 30 22 32 C18 32 14 30 12 26Z"
      fill="rgba(0,174,239,0.55)"
    />
    <path
      d="M22 18 C26 14 32 14 34 18 C36 22 34 28 30 30 C28 28 26 24 22 18Z"
      fill="rgba(0,174,239,0.4)"
    />
    {/* Barclays wordmark */}
    <text x="40" y="20" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="13" letterSpacing="0.08em" fill="rgba(0,174,239,0.75)">BARCLAYS</text>
    <text x="40" y="35" fontFamily="'Barlow', sans-serif" fontWeight="400" fontSize="10" letterSpacing="0.12em" fill="rgba(148,163,184,0.6)">EAGLE LABS</text>
    {/* Divider */}
    <line x1="40" y1="22" x2="170" y2="22" stroke="rgba(0,174,239,0.12)" strokeWidth="0.5" />
  </svg>
);

// Durham University — uses Durham's deep purple/maroon (#7B1E3D) and gold (#C9A84C)
const DurhamUniversity: React.FC = () => (
  <svg viewBox="0 0 200 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Durham University">
    {/* Simplified castle/cathedral icon representing Durham */}
    <rect x="10" y="28" width="6" height="14" rx="1" fill="rgba(201,168,76,0.5)" />
    <rect x="18" y="22" width="6" height="20" rx="1" fill="rgba(201,168,76,0.6)" />
    <rect x="26" y="26" width="6" height="16" rx="1" fill="rgba(201,168,76,0.5)" />
    {/* Battlements */}
    <rect x="10" y="25" width="2" height="4" rx="0.5" fill="rgba(201,168,76,0.5)" />
    <rect x="14" y="25" width="2" height="4" rx="0.5" fill="rgba(201,168,76,0.5)" />
    <rect x="18" y="19" width="2" height="4" rx="0.5" fill="rgba(201,168,76,0.6)" />
    <rect x="22" y="19" width="2" height="4" rx="0.5" fill="rgba(201,168,76,0.6)" />
    <rect x="26" y="23" width="2" height="4" rx="0.5" fill="rgba(201,168,76,0.5)" />
    <rect x="30" y="23" width="2" height="4" rx="0.5" fill="rgba(201,168,76,0.5)" />
    {/* Text */}
    <text x="42" y="24" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="13" letterSpacing="0.08em" fill="rgba(201,168,76,0.75)">DURHAM</text>
    <text x="42" y="38" fontFamily="'Barlow', sans-serif" fontWeight="400" fontSize="10" letterSpacing="0.12em" fill="rgba(148,163,184,0.6)">UNIVERSITY</text>
  </svg>
);

// Durham University Venture Labs
const DurhamVentureLabs: React.FC = () => (
  <svg viewBox="0 0 240 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Durham University Venture Labs">
    {/* Stylised launch/rocket icon */}
    <path d="M20 38 L16 42 L20 40 Z" fill="rgba(201,168,76,0.45)" />
    <path d="M20 38 L24 42 L20 40 Z" fill="rgba(201,168,76,0.45)" />
    <path
      d="M20 14 C22 14 27 18 27 26 L27 36 L20 38 L13 36 L13 26 C13 18 18 14 20 14Z"
      fill="rgba(201,168,76,0.15)"
      stroke="rgba(201,168,76,0.45)"
      strokeWidth="1"
    />
    <circle cx="20" cy="26" r="3" fill="none" stroke="rgba(201,168,76,0.55)" strokeWidth="1" />
    {/* Text */}
    <text x="36" y="22" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="12" letterSpacing="0.08em" fill="rgba(201,168,76,0.75)">DURHAM</text>
    <text x="36" y="33" fontFamily="'Barlow', sans-serif" fontWeight="400" fontSize="9" letterSpacing="0.1em" fill="rgba(148,163,184,0.6)">UNIVERSITY</text>
    <text x="36" y="43" fontFamily="'Barlow', sans-serif" fontWeight="600" fontSize="9" letterSpacing="0.14em" fill="rgba(148,163,184,0.5)">VENTURE LABS</text>
  </svg>
);

/* ─── Partners Strip ────────────────────────────────────── */
export const Partners: React.FC = () => {
  return (
    <section
      style={{
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(30,41,59,0.25)',
        padding: '3rem 0',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-center text-xs tracking-[0.2em] uppercase mb-8"
          style={{ color: '#475569' }}
        >
          Backed by &amp; in partnership with
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-12 md:gap-20"
        >
          {/* Barclays Eagle Labs */}
          <div
            className="flex items-center transition-opacity duration-300"
            style={{ opacity: 0.7 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
          >
            <div style={{ width: 180, height: 44 }}>
              <BarclaysEagleLabs />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Durham University */}
          <div
            className="flex items-center transition-opacity duration-300"
            style={{ opacity: 0.7 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
          >
            <div style={{ width: 170, height: 44 }}>
              <DurhamUniversity />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Durham Venture Labs */}
          <div
            className="flex items-center transition-opacity duration-300"
            style={{ opacity: 0.7 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
          >
            <div style={{ width: 200, height: 44 }}>
              <DurhamVentureLabs />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
