import React, { useState } from 'react';
import { motion } from 'framer-motion';

const models = [
  {
    id: 'license',
    num: '01',
    title: 'Blueprint License',
    tag: 'Primary',
    tagColor: '#00D68F',
    body: 'Developers license our digital twin software and engineering blueprints. They fund and build the plant. Fluxero earns recurring SaaS fees without owning the asset — near-zero marginal cost to scale.',
    metrics: [
      { k: 'Revenue type',    v: 'Recurring SaaS + license' },
      { k: 'Capital required', v: 'Zero per deployment' },
      { k: 'Scales to',       v: '100s of sites globally' },
    ],
  },
  {
    id: 'revshare',
    num: '02',
    title: 'Revenue Share',
    tag: null,
    tagColor: '',
    body: 'Site provides curtailed energy. Fluxero provides the plant and operations. Hydrogen revenue is split. Zero capital cost to the energy producer — ideal for wind farms wanting upside without risk.',
    metrics: [
      { k: 'Revenue type',    v: 'Split of H₂ sales' },
      { k: 'Capital required', v: 'Shared or Fluxero-led' },
      { k: 'Best for',        v: 'Wind & solar generators' },
    ],
  },
  {
    id: 'coinvest',
    num: '03',
    title: 'Co-Investment',
    tag: null,
    tagColor: '',
    body: 'Both parties contribute CAPEX. Fluxero operates. Profit on hydrogen sales is divided. Suited to large industrial parks that want ownership and guaranteed offtake.',
    metrics: [
      { k: 'Revenue type',    v: 'Profit share' },
      { k: 'Capital required', v: 'Joint contribution' },
      { k: 'Best for',        v: 'Industrial offtakers' },
    ],
  },
];

export const BusinessModel: React.FC = () => {
  const [active, setActive] = useState('license');
  const model = models.find(m => m.id === active)!;

  return (
    <section className="py-28 relative" style={{ background: '#0D0C0F' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-px" style={{ background: "#00D68F" }} />
          <span className="font-mono text-base text-green tracking-[0.25em] uppercase">Commercial Model</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* Left — model selector */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-display font-black text-cream mb-4"
              style={{ fontSize: 'clamp(30px, 4vw, 48px)', lineHeight: 0.95 }}
            >
              ASSET-LIGHT.<br />
              <span className="text-green-gradient">SCALES LIKE SOFTWARE.</span>
            </h2>
            <p className="font-body text-mist text-xl leading-relaxed mb-10 font-light">
              Fluxero's core product is intelligence — the digital twin, the simulation engine,
              the deployment playbook. The more sites we license, the better the model gets.
            </p>

            {/* Model tabs */}
            <div className="space-y-2 mb-10">
              {models.map(m => (
                <button
                  key={m.id}
                  onClick={() => setActive(m.id)}
                  className="w-full text-left px-5 py-4 rounded-lg transition-all group"
                  style={{
                    background: active === m.id ? 'rgba(0,214,143,0.07)' : '#131116',
                    border: `1px solid ${active === m.id ? 'rgba(0,214,143,0.25)' : 'rgba(255,255,255,0.04)'}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-base text-steel">{m.num}</span>
                      <span className={`font-display font-bold text-xl ${active === m.id ? 'text-green' : 'text-cream'}`}>
                        {m.title}
                      </span>
                    </div>
                    {m.tag && (
                      <span className="font-mono text-base px-2 py-1 rounded"
                        style={{ color: m.tagColor, background: 'rgba(0,214,143,0.1)', border: '1px solid rgba(0,214,143,0.2)' }}>
                        {m.tag}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Model detail */}
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: '#131116',
                border: '1px solid rgba(0,214,143,0.08)',
                borderRadius: 12,
                padding: '24px',
              }}
            >
              <p className="font-body text-mist text-lg leading-relaxed mb-5">{model.body}</p>
              <div className="space-y-3 border-t border-white/5 pt-5">
                {model.metrics.map(metric => (
                  <div key={metric.k} className="flex items-center justify-between">
                    <span className="font-mono text-base text-steel">{metric.k}</span>
                    <span className="font-body font-medium text-cream text-lg">{metric.v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — code snippet */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Code window */}
            <div style={{
              background: '#070608',
              border: '1px solid rgba(0,214,143,0.1)',
              borderRadius: 14,
              overflow: 'hidden',
            }}>
              <div style={{
                background: '#0D0C0F',
                borderBottom: '1px solid rgba(0,214,143,0.06)',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => (
                  <div key={i} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.7 }} />
                ))}
                <span className="font-mono text-base text-steel ml-2">fluxero_model.ts</span>
              </div>
              <div className="p-6 font-mono text-lg space-y-2 overflow-x-auto">
                {[
                  ['// Fluxero unit economics', 'steel'],
                  ['', ''],
                  ['const sites = [', 'cream'],
                  ['  "lincoln_pilot",', 'amber-dark'],
                  ['  "site_002", // incoming', 'steel'],
                  ['  ...licensing.scale(),', 'amber'],
                  ['];', 'cream'],
                  ['', ''],
                  ['const revenue = sites.map(site => ({', 'cream'],
                  ['  saas:     site.license_fee,      // £40–80k/yr', 'amber'],
                  ['  h2Sales:  site.kg_output * price, // £8–12/kg', 'amber-dark'],
                  ['  marginal: "≈ £0 per new site",   // the moat', 'steel'],
                  ['}));', 'cream'],
                  ['', ''],
                  ['// the more we deploy', 'steel'],
                  ['// the better the model learns', 'steel'],
                  ['return fluxero.scale("globally");', 'cream'],
                ].map(([line, col], i) => (
                  <div key={i} className={`${
                    col === 'cream'      ? 'text-cream/80' :
                    col === 'amber'      ? 'text-green' :
                    col === 'amber-dark' ? 'text-green/60' :
                    'text-steel'
                  }`} style={{ whiteSpace: 'pre' }}>
                    <span className="select-none text-steel/30 mr-6 text-base">{String(i + 1).padStart(2, '0')}</span>
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* Note below */}
            <div className="mt-6 flex items-start gap-4 px-1">
              <div className="w-1 h-12 rounded-full flex-shrink-0 mt-1" style={{ background: "rgba(0,214,143,0.4)" }} />
              <p className="font-body text-mist text-lg leading-relaxed">
                Each new licensed site improves our digital twin's accuracy. Our dataset compounds
                — making Fluxero's projections better and our defensibility stronger over time.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
