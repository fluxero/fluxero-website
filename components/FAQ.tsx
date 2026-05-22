import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: "What is a Small Modular Hydrogen Plant?",
    a: "A containerised electrolyser that connects directly to a renewable energy source — no grid connection needed. Fluxero's SMHPs convert variable, curtailed electricity into green hydrogen at the point of generation. 'Small modular' means they scale from a few kilowatts to several megawatts by stacking units."
  },
  {
    q: "What is curtailed energy — and why does it matter?",
    a: "When wind turbines or solar panels generate more electricity than the grid can absorb, operators are forced to switch them off. This is curtailment. The UK curtailed over 3.2 TWh of clean energy in 2023 — paying renewable generators to produce nothing. Fluxero converts this wasted output into hydrogen instead."
  },
  {
    q: "What makes the Fluxero Design Engine different from a spreadsheet?",
    a: "Our engine uses real PVGIS satellite irradiance data and NOABL wind speed data for every UK postcode area. Wind energy is calculated via Weibull k=2 distribution integration across the full IEC 61400 power curve — not a simple average multiplied by rated power. Electrolyser efficiency is modelled at each part-load operating point. The result is a physics-based projection, not an optimistic estimate."
  },
  {
    q: "Do I need a grid connection?",
    a: "No. That's a core part of Fluxero's value. SMHPs connect behind the meter, directly to your energy source. This bypasses grid connection queues entirely — currently 10–15 years in some UK regions — and means you can start producing hydrogen from energy that would otherwise be wasted or penalised."
  },
  {
    q: "What does the Blueprint License model mean for developers?",
    a: "Fluxero provides the digital twin software, engineering blueprints, and deployment playbook. You fund and build the plant. Fluxero earns a recurring SaaS license fee and optionally supplies the electrolyser stack. You own the hydrogen asset. This keeps our capital requirements near zero while giving you full ownership."
  },
  {
    q: "Is the hydrogen actually green?",
    a: "Yes, 100%. Our plants only run on energy that would otherwise be wasted from renewable sources. No fossil fuels are involved at any stage. Each kilogram of green hydrogen avoids approximately 9 kg of CO₂ compared to grey hydrogen produced from natural gas via steam methane reforming."
  },
];

export const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-28 relative" style={{ background: '#0D0C0F' }}>
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-px" style={{ background: "#00D68F" }} />
          <span className="font-mono text-base text-green tracking-[0.25em] uppercase">FAQ</span>
        </div>

        <h2
          className="font-display font-black text-cream mb-12"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 0.95 }}
        >
          COMMON<br />
          <span className="text-green-gradient">QUESTIONS.</span>
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              style={{
                background: open === i ? '#131116' : '#0D0C0F',
                border: `1px solid ${open === i ? 'rgba(0,214,143,0.15)' : 'rgba(255,255,255,0.04)'}`,
                borderRadius: 10,
                overflow: 'hidden',
                transition: 'background 0.2s, border-color 0.2s',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-body font-semibold text-cream text-xl pr-6">{faq.q}</span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{
                    background: open === i ? 'rgba(0,214,143,0.15)' : 'rgba(255,255,255,0.04)',
                    color: open === i ? '#00D68F' : '#64748B',
                  }}
                >
                  <span style={{ fontSize: 20, lineHeight: 1, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', display: 'block' }}>+</span>
                </div>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-6 border-t border-white/5 pt-4">
                      <p className="font-body text-mist text-lg leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
