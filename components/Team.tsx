import React from 'react';
import { motion } from 'framer-motion';

const team = [
  {
    initials: 'KP',
    name: 'Dr. Kieran Purvis',
    role: 'CEO & Co-Founder',
    focus: 'Strategy · Commercial · Investor Relations',
    bio: 'Drives Fluxero\'s go-to-market and commercial strategy. Leads all investor and partnership discussions. Primary contact for developers and energy operators.',
    color: '#00D0E8',
    email: 'kieran@fluxero.uk',
  },
  {
    initials: 'SM',
    name: 'Shivansh Mishra',
    role: 'CIO & Co-Founder',
    focus: 'Digital Twin · Software Architecture · Website',
    bio: 'Built the digital twin frontend in Unity and the H₂ design engine. Leads all software systems, AI integration, and the Fluxero technology platform.',
    color: '#00D68F',
    email: 'shiv@fluxero.uk',
  },
  {
    initials: 'ET',
    name: 'Euan Thomson',
    role: 'CTO & Co-Founder',
    focus: 'Renewable Engineering · NGSPICE · Electrolyser',
    bio: 'Renewable engineering specialist. Built the plant simulation backend using NGSPICE. Owns all hardware architecture, electrolyser design, and technical validation.',
    color: '#00E5B8',
    email: 'euan@fluxero.uk',
  },
];

/* 3-D tilt helpers */
const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>, color: string) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const rx = ((e.clientY - rect.top  - rect.height / 2) / rect.height) * -9;
  const ry = ((e.clientX - rect.left - rect.width  / 2) / rect.width ) *  9;
  el.style.transition = 'transform 0.06s ease, border-color 0.25s, box-shadow 0.25s';
  el.style.transform  = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.01)`;
  el.style.borderColor = `${color}35`;
  el.style.boxShadow  = `0 20px 40px rgba(0,0,0,0.35), 0 0 30px ${color}12`;
};

const handleTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  const el = e.currentTarget;
  el.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1), border-color 0.3s, box-shadow 0.4s';
  el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
  el.style.borderColor = 'rgba(255,255,255,0.05)';
  el.style.boxShadow  = 'none';
};

export const Team: React.FC = () => {
  return (
    <section id="team" className="py-28 relative" style={{ background: '#0D0C0F' }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,214,143,0.15), transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-px" style={{ background: '#00D68F' }} />
          <span className="font-mono text-base tracking-[0.25em] uppercase" style={{ color: '#00D68F' }}>The Team</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-display font-black text-cream"
              style={{ fontSize: 'clamp(42px, 4vw, 64px)', lineHeight: 0.95 }}
            >
              THREE ENGINEERS.<br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #00D68F 0%, #00E5B8 50%, #00D0E8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ONE OBSESSION.
              </span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="font-body text-mist text-2xl leading-relaxed font-light">
              Cross-disciplinary expertise covering all critical areas — renewable engineering,
              software systems, and commercial execution. We've built the simulation engine,
              the digital twin, and the business model from scratch.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.14, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              style={{
                background: 'linear-gradient(160deg, #131116 0%, #0f0e12 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 16,
                padding: '40px',
                willChange: 'transform',
                transformStyle: 'preserve-3d',
              }}
              onMouseMove={e => handleTiltMove(e, m.color)}
              onMouseLeave={handleTiltLeave}
            >
              {/* Avatar */}
              <div className="relative mb-7">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-bold text-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${m.color}20, ${m.color}08)`,
                    border: `1px solid ${m.color}35`,
                    color: m.color,
                    boxShadow: `0 0 20px ${m.color}15`,
                  }}
                >
                  {m.initials}
                </div>
                {/* Subtle glow dot */}
                <div
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                  style={{
                    background: m.color,
                    boxShadow: `0 0 8px ${m.color}`,
                    opacity: 0.7,
                  }}
                />
              </div>

              <h4 className="font-display font-black text-cream text-2xl mb-1">{m.name}</h4>
              <p className="font-mono text-base mb-2" style={{ color: m.color }}>{m.role}</p>
              <p className="font-mono text-base text-steel mb-5 leading-relaxed">{m.focus}</p>

              <div className="border-t pt-5 mb-5" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <p className="font-body text-mist text-xl leading-relaxed">{m.bio}</p>
              </div>

              <a
                href={`mailto:${m.email}`}
                className="inline-flex items-center gap-2 font-mono text-base transition-all"
                style={{ color: '#475569', textDecoration: 'none' }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = m.color;
                  e.currentTarget.style.gap = '8px';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#475569';
                  e.currentTarget.style.gap = '8px';
                }}
              >
                {m.email} →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
