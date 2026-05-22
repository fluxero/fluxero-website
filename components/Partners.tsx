import React from 'react';
import { motion } from 'framer-motion';

const PartnerImage: React.FC<{ src: string; alt: string; width: number }> = ({ src, alt, width }) => (
  <img
    className="partner-logo"
    src={src}
    alt={alt}
    style={{ width, maxHeight: 44, opacity: 0.92 }}
  />
);

const DurhamLockup: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 44 }}>
    <img src="/partners/durham-logo.png" alt="" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontFamily: '"IBM Plex Sans Condensed", sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: '0.08em', color: 'rgba(201,168,76,0.85)' }}>
        DURHAM
      </span>
      <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(148,163,184,0.65)' }}>
        UNIVERSITY
      </span>
    </div>
  </div>
);

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
          className="font-mono text-center text-base tracking-[0.2em] uppercase mb-8"
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
          {[
            <PartnerImage src="/partners/nvidia-logo.png" alt="NVIDIA Inception" width={150} />,
            <PartnerImage src="/partners/barclays-logo.png" alt="Barclays Eagle Labs" width={164} />,
            <PartnerImage src="/partners/google-logo.png" alt="Google for Startups" width={130} />,
            <DurhamLockup />,
          ].map((logo, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="hidden md:block w-px h-8" style={{ background: 'rgba(255,255,255,0.06)' }} />}
              <div
                className="flex items-center transition-opacity duration-300"
                style={{ opacity: 0.72 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.72')}
              >
                {logo}
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
