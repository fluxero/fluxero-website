import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const COLORS = {
  primary: '#00D68F',
  dark: '#070608',
  cardBg: '#131116',
  sectionAlt: '#0D0C0F',
  cream: '#F0EBE0',
  muted: '#A8A3B3',
  steel: '#64748B',
  nvidiaGreen: '#76b900',
  barclaysBlue: '#00AEEF',
  durhamGold: '#C9A84C',
  googleBlue: '#4285F4',
};

const FONTS = {
  serif: '"DM Serif Display", serif',
  sans: '"IBM Plex Sans", sans-serif',
  mono: '"IBM Plex Mono", monospace',
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const milestones = [
  {
    label: 'Q1 2024',
    text: 'Digital twin architecture completed. Physics-based modelling validated against PVGIS and NOABL datasets.',
  },
  {
    label: 'Q2 2024',
    text: 'First bench-scale electrolyser prototype. PEM stack operating at 65% efficiency on variable power input.',
  },
  {
    label: 'Q3 2024',
    text: 'Nvidia Inception accepted. AI dispatch algorithm v1 deployed on prototype data.',
  },
  {
    label: 'Q4 2024',
    text: 'Barclays Eagle Labs cohort. First site survey completed (Scottish wind farm, 8.3 TWh curtailment region).',
  },
  {
    label: 'Q1 2025',
    text: 'Pilot LOI signed with renewable energy landowner. SMHP container design finalised.',
  },
  {
    label: 'Q2 2025',
    text: 'Seed round open. Capital deployed into first commercial SMHP and offtake agreements.',
  },
];

const differentiators = [
  {
    title: 'We go where the grid isn\'t',
    body: 'Behind-the-meter means no 10-year connection queue. Sites other developers reject are our feedstock.',
  },
  {
    title: 'Software-defined hardware',
    body: 'Every plant is controlled by the same digital twin platform. No bespoke engineering. Margin improves with every unit deployed.',
  },
  {
    title: 'Capture what\'s already free',
    body: 'Curtailed energy has a negative or zero cost. Our feedstock economics are structurally better than any grid-connected competitor.',
  },
];

const whyNow = [
  {
    title: 'Grid congestion is accelerating, not solving',
    body: 'The Eastern HVDC interconnector, meant to fix UK curtailment, is delayed to 2029+. Every year of delay = more curtailment = more feedstock for us.',
  },
  {
    title: 'Electrolyser costs hit an inflection',
    body: 'Stack costs dropped 60% since 2020. Second-life panels at £360/kWp vs £800/kWp new. The economics only work at this cost level — in 5 years competitors will catch up.',
  },
  {
    title: 'Policy tailwind is now policy mandate',
    body: 'UK: 10 GW H₂ by 2030. EU: 10 Mt/year by 2030. US IRA: $3/kg tax credit. Binding commitments with real capital attached.',
  },
  {
    title: 'First-mover at curtailment sites',
    body: 'No competitor is deploying behind-the-meter at curtailment points. The grid-connected H₂ hubs they\'re building face the same 10-year queue they\'re trying to avoid.',
  },
];

export default function TractionPage() {
  return (
    <div
      style={{
        background: COLORS.dark,
        minHeight: '100vh',
        fontFamily: FONTS.sans,
        color: COLORS.cream,
        paddingTop: 80,
      }}
    >
      {/* ─── 1. HERO ─────────────────────────────────────────────────────────── */}
      <div data-section
        style={{
          background: COLORS.dark,
          padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: FONTS.mono,
              fontSize: 19,
              letterSpacing: '0.18em',
              color: COLORS.primary,
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            Traction
          </motion.p>

          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: FONTS.serif,
              fontSize: 'clamp(42px, 6vw, 84px)',
              fontWeight: 400,
              color: COLORS.cream,
              margin: '0 0 24px',
              lineHeight: 1.1,
            }}
          >
            Proof, not promises.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: FONTS.sans,
              fontSize: 'clamp(22px, 2vw, 24px)',
              color: COLORS.muted,
              maxWidth: 560,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            We build first, then present. Here's what exists today.
          </motion.p>
        </motion.div>
      </div>

      {/* ─── 2. PARTNER VALIDATION ───────────────────────────────────────────── */}
      <div data-section
        style={{
          background: COLORS.sectionAlt,
          padding: 'clamp(60px, 8vw, 120px) clamp(24px, 5vw, 80px)',
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{ maxWidth: 1200, margin: '0 auto' }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              letterSpacing: '0.16em',
              color: COLORS.primary,
              textTransform: 'uppercase',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            Validated by
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: FONTS.serif,
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 400,
              color: COLORS.cream,
              textAlign: 'center',
              marginBottom: 60,
            }}
          >
            Partners who verified the work.
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {/* Nvidia Inception */}
            <motion.div
              variants={fadeUp}
              style={{
                background: COLORS.cardBg,
                border: `1px solid rgba(118, 185, 0, 0.25)`,
                borderRadius: 12,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <div>
                <img
                  src="/partners/nvidia-logo.png"
                  alt="NVIDIA"
                  className="partner-logo"
                  style={{ width: 160, maxHeight: 32, marginBottom: 8 }}
                />
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 17,
                    letterSpacing: '0.2em',
                    color: COLORS.nvidiaGreen,
                    opacity: 0.85,
                    marginTop: 4,
                  }}
                >
                  INCEPTION
                </div>
              </div>

              <p
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 21,
                  color: COLORS.muted,
                  lineHeight: 1.7,
                  margin: 0,
                  flex: 1,
                }}
              >
                Selected for Nvidia Inception — the programme that accelerates AI-first startups with
                deep tech infrastructure, GPU credits, and go-to-market support. Less than 5% of
                applicants accepted.
              </p>

              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(118, 185, 0, 0.1)',
                  border: '1px solid rgba(118, 185, 0, 0.3)',
                  borderRadius: 4,
                  padding: '5px 12px',
                  fontFamily: FONTS.mono,
                  fontSize: 17,
                  letterSpacing: '0.1em',
                  color: COLORS.nvidiaGreen,
                  alignSelf: 'flex-start',
                }}
              >
                AI-Powered Infrastructure
              </div>
            </motion.div>

            {/* Barclays Eagle Labs */}
            <motion.div
              variants={fadeUp}
              style={{
                background: COLORS.cardBg,
                border: `1px solid rgba(0, 174, 239, 0.25)`,
                borderRadius: 12,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <div>
                <img
                  src="/partners/barclays-logo.png"
                  alt="Barclays"
                  className="partner-logo"
                  style={{ width: 165, maxHeight: 34, marginBottom: 8 }}
                />
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 17,
                    letterSpacing: '0.2em',
                    color: COLORS.barclaysBlue,
                    opacity: 0.85,
                    marginTop: 4,
                  }}
                >
                  EAGLE LABS
                </div>
              </div>

              <p
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 21,
                  color: COLORS.muted,
                  lineHeight: 1.7,
                  margin: 0,
                  flex: 1,
                }}
              >
                Supported by Barclays Eagle Labs, the UK's leading deeptech accelerator network.
                Gives access to mentors, investors, and enterprise customers across Barclays' network.
              </p>

              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(0, 174, 239, 0.1)',
                  border: '1px solid rgba(0, 174, 239, 0.3)',
                  borderRadius: 4,
                  padding: '5px 12px',
                  fontFamily: FONTS.mono,
                  fontSize: 17,
                  letterSpacing: '0.1em',
                  color: COLORS.barclaysBlue,
                  alignSelf: 'flex-start',
                }}
              >
                UK Deeptech Accelerator
              </div>
            </motion.div>

            {/* Durham University */}
            <motion.div
              variants={fadeUp}
              style={{
                background: COLORS.cardBg,
                border: `1px solid rgba(201, 168, 76, 0.25)`,
                borderRadius: 12,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img
                  src="/partners/durham-logo.png"
                  alt="Durham University"
                  style={{ height: 40, width: 'auto', objectFit: 'contain', flexShrink: 0 }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: FONTS.sans,
                      fontWeight: 700,
                      fontSize: 22,
                      color: COLORS.durhamGold,
                      letterSpacing: '0.08em',
                      lineHeight: 1,
                    }}
                  >
                    DURHAM
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 16,
                      letterSpacing: '0.2em',
                      color: COLORS.durhamGold,
                      opacity: 0.85,
                      marginTop: 4,
                    }}
                  >
                    UNIVERSITY
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 21,
                  color: COLORS.muted,
                  lineHeight: 1.7,
                  margin: 0,
                  flex: 1,
                }}
              >
                Rooted in Durham University's engineering and materials science research. Digital twin
                modelling and electrochemistry expertise built on world-class academic foundations.
              </p>

              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(201, 168, 76, 0.1)',
                  border: '1px solid rgba(201, 168, 76, 0.3)',
                  borderRadius: 4,
                  padding: '5px 12px',
                  fontFamily: FONTS.mono,
                  fontSize: 17,
                  letterSpacing: '0.1em',
                  color: COLORS.durhamGold,
                  alignSelf: 'flex-start',
                }}
              >
                Research Foundation
              </div>
            </motion.div>

            {/* Google for Startups */}
            <motion.div
              variants={fadeUp}
              style={{
                background: COLORS.cardBg,
                border: `1px solid rgba(66, 133, 244, 0.25)`,
                borderRadius: 12,
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <div>
                <img
                  src="/partners/google-logo.png"
                  alt="Google"
                  className="partner-logo"
                  style={{ width: 120, maxHeight: 36, marginBottom: 8 }}
                />
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 17,
                    letterSpacing: '0.2em',
                    color: COLORS.googleBlue,
                    opacity: 0.85,
                    marginTop: 4,
                  }}
                >
                  FOR STARTUPS
                </div>
              </div>

              <p
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 21,
                  color: COLORS.muted,
                  lineHeight: 1.7,
                  margin: 0,
                  flex: 1,
                }}
              >
                Backed by Google for Startups — cloud credits, ML infrastructure, and access to
                Google's engineering and go-to-market networks. Supports our digital-twin modelling
                stack at scale.
              </p>

              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(66, 133, 244, 0.1)',
                  border: '1px solid rgba(66, 133, 244, 0.3)',
                  borderRadius: 4,
                  padding: '5px 12px',
                  fontFamily: FONTS.mono,
                  fontSize: 17,
                  letterSpacing: '0.1em',
                  color: COLORS.googleBlue,
                  alignSelf: 'flex-start',
                }}
              >
                Cloud + AI Infrastructure
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ─── 3. MILESTONE TIMELINE ───────────────────────────────────────────── */}
      <div data-section
        style={{
          background: COLORS.dark,
          padding: 'clamp(60px, 8vw, 120px) clamp(24px, 5vw, 80px)',
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{ maxWidth: 800, margin: '0 auto' }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              letterSpacing: '0.16em',
              color: COLORS.primary,
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Progress
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: FONTS.serif,
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 400,
              color: COLORS.cream,
              marginBottom: 56,
            }}
          >
            What we've built.
          </motion.h2>

          {/* Timeline wrapper with left green border */}
          <div
            style={{
              borderLeft: `3px solid ${COLORS.primary}`,
              paddingLeft: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
            }}
          >
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 24,
                  paddingBottom: i < milestones.length - 1 ? 40 : 0,
                  paddingLeft: 0,
                  position: 'relative',
                }}
              >
                {/* Dot on the border line */}
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: COLORS.primary,
                    border: `3px solid ${COLORS.dark}`,
                    flexShrink: 0,
                    marginLeft: -8, // pulls it onto the border line
                    marginTop: 4,
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 18,
                      letterSpacing: '0.14em',
                      color: COLORS.primary,
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}
                  >
                    {m.label}
                  </div>
                  <p
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 22,
                      color: COLORS.cream,
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {m.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── 4. WHAT MAKES US DIFFERENT ──────────────────────────────────────── */}
      <div data-section
        style={{
          background: COLORS.sectionAlt,
          padding: 'clamp(60px, 8vw, 120px) clamp(24px, 5vw, 80px)',
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{ maxWidth: 1200, margin: '0 auto' }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              letterSpacing: '0.16em',
              color: COLORS.primary,
              textTransform: 'uppercase',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            Differentiation
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: FONTS.serif,
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 400,
              color: COLORS.cream,
              textAlign: 'center',
              marginBottom: 60,
            }}
          >
            Why Fluxero wins where others don't.
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {differentiators.map((d, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                style={{
                  background: COLORS.cardBg,
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderTop: `3px solid ${COLORS.primary}`,
                  borderRadius: 12,
                  padding: 32,
                }}
              >
                <h3
                  style={{
                    fontFamily: FONTS.serif,
                    fontSize: 26,
                    fontWeight: 400,
                    color: COLORS.cream,
                    margin: '0 0 16px',
                    lineHeight: 1.3,
                  }}
                >
                  {d.title}
                </h3>
                <p
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 21,
                    color: COLORS.muted,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {d.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ─── 5. WHY NOW ──────────────────────────────────────────────────────── */}
      <div data-section
        style={{
          background: COLORS.dark,
          padding: 'clamp(60px, 8vw, 120px) clamp(24px, 5vw, 80px)',
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{ maxWidth: 860, margin: '0 auto' }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              letterSpacing: '0.16em',
              color: COLORS.primary,
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Market timing
          </motion.p>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: FONTS.serif,
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 400,
              color: COLORS.cream,
              marginBottom: 56,
            }}
          >
            The window is open.
          </motion.h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {whyNow.map((w, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                style={{
                  borderLeft: `3px solid ${COLORS.primary}`,
                  paddingLeft: 28,
                  paddingTop: 4,
                  paddingBottom: 4,
                }}
              >
                <h3
                  style={{
                    fontFamily: FONTS.sans,
                    fontWeight: 600,
                    fontSize: 23,
                    color: COLORS.cream,
                    margin: '0 0 10px',
                    lineHeight: 1.4,
                  }}
                >
                  {w.title}
                </h3>
                <p
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 21,
                    color: COLORS.muted,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {w.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── 6. INVESTOR CTA ─────────────────────────────────────────────────── */}
      <div data-section
        style={{
          background: COLORS.sectionAlt,
          padding: 'clamp(80px, 10vw, 140px) clamp(24px, 5vw, 80px)',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{ maxWidth: 640, margin: '0 auto' }}
        >
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: FONTS.mono,
              fontSize: 18,
              letterSpacing: '0.16em',
              color: COLORS.primary,
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Seed round
          </motion.p>

          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: FONTS.serif,
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 400,
              color: COLORS.cream,
              margin: '0 0 24px',
              lineHeight: 1.15,
            }}
          >
            We are raising a seed round.
          </motion.h2>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: FONTS.sans,
              fontSize: 22,
              color: COLORS.muted,
              lineHeight: 1.75,
              margin: '0 0 48px',
            }}
          >
            Capital for our first commercial SMHP deployment and offtake agreements.
            Target outcomes: 3 SMHPs deployed, 3 offtake agreements signed within 12 months.
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              to="/contact"
              style={{
                display: 'inline-block',
                background: COLORS.primary,
                color: COLORS.dark,
                fontFamily: FONTS.sans,
                fontWeight: 600,
                fontSize: 21,
                letterSpacing: '0.03em',
                padding: '14px 32px',
                borderRadius: 8,
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.85')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
            >
              Talk to us →
            </Link>

            <Link
              to="/business"
              style={{
                display: 'inline-block',
                background: 'transparent',
                color: COLORS.cream,
                fontFamily: FONTS.sans,
                fontWeight: 500,
                fontSize: 21,
                letterSpacing: '0.03em',
                padding: '14px 32px',
                borderRadius: 8,
                border: `1px solid rgba(240, 235, 224, 0.2)`,
                textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(240, 235, 224, 0.5)';
                el.style.color = COLORS.cream;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(240, 235, 224, 0.2)';
                el.style.color = COLORS.cream;
              }}
            >
              Review the numbers →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
