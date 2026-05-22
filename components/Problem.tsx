import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const curtailmentHistory = [
  { year: '2019', wind: 2.1, solar: 0.4, hydro: 0.1 },
  { year: '2020', wind: 2.4, solar: 0.5, hydro: 0.12 },
  { year: '2021', wind: 2.3, solar: 0.6, hydro: 0.11 },
  { year: '2022', wind: 3.4, solar: 0.8, hydro: 0.15 },
  { year: '2023', wind: 4.3, solar: 1.1, hydro: 0.18 },
  { year: '2024', wind: 8.3, solar: 1.5, hydro: 0.22 },
];

const dailyProfile = [
  { t: '00', gen: 28, cap: 42 }, { t: '03', gen: 18, cap: 38 },
  { t: '06', gen: 24, cap: 40 }, { t: '09', gen: 68, cap: 48 },
  { t: '12', gen: 91, cap: 52 }, { t: '15', gen: 74, cap: 50 },
  { t: '18', gen: 47, cap: 46 }, { t: '21', gen: 31, cap: 42 },
  { t: '24', gen: 20, cap: 38 },
];

const ChartTip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#131116', border: '1px solid rgba(0,214,143,0.15)', borderRadius: 6, padding: '10px 14px' }}>
      <p className="font-mono text-base text-steel mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 font-mono text-base">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-mist">{p.name}: </span>
          <span className="text-cream font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const CountUp: React.FC<{ to: number; decimals?: number; prefix?: string; suffix?: string }> = ({ to, decimals = 0, prefix = '', suffix = '' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const dur = 1800;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(eased * to);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return (
    <span ref={ref} className="counter">
      {prefix}{val.toFixed(decimals)}{suffix}
    </span>
  );
};

export const Problem: React.FC = () => {
  return (
    <section id="problem" className="py-28 relative" style={{ background: '#0D0C0F' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="flex items-center gap-4 mb-16">
          <div className="w-8 h-px" style={{ background: '#00D68F' }} />
          <span className="font-mono text-base tracking-[0.25em] uppercase" style={{ color: '#00D68F' }}>The Problem</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              n: 8.3, d: 1, pre: '', suf: ' TWh',
              label: 'Wind curtailed in 2024',
              sub: 'Up 91% from 4.3 TWh in 2023 · REF',
              color: '#EF4444',
            },
            {
              n: 1.5, d: 1, pre: '', suf: ' TWh',
              label: 'Solar curtailed in 2024',
              sub: 'Midday generation exceeds demand · NESO',
              color: '#FBBF24',
            },
            {
              n: 393, d: 0, pre: '£', suf: 'M',
              label: 'Paid to generators to switch off',
              sub: '£310M in 2023 · Electric Insights',
              color: '#00D68F',
            },
            {
              n: 95, d: 0, pre: '', suf: '%',
              label: 'Of wind curtailment from Scotland',
              sub: 'B6 Scotland–England transmission bottleneck',
              color: '#94A3B8',
            },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
              style={{ background: '#131116', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '32px' }}
            >
              <div className="font-display font-black"
                style={{ fontSize: 'clamp(36px, 7vw, 72px)', lineHeight: 1, color: s.color }}>
                <CountUp to={s.n} decimals={s.d} prefix={s.pre} suffix={s.suf} />
              </div>
              <p className="font-body font-medium text-cream text-xl mt-3 mb-1 leading-snug">{s.label}</p>
              <p className="font-mono text-steel text-base leading-relaxed">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Solar + Hydro callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.12)', borderRadius: 12, padding: '20px 24px' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: '#FBBF24' }} />
              <p className="font-display font-bold text-cream text-xl">Solar Curtailment Rising</p>
            </div>
            <p className="font-body text-mist text-xl leading-relaxed">
              Midday solar generation increasingly exceeds grid demand across southern England.
              In 2024, ~1.5 TWh was curtailed — up from near-zero in 2020. Network operators
              instruct solar farms to reduce output on sunny, low-demand days.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.08 }}
            style={{ background: 'rgba(0,208,232,0.04)', border: '1px solid rgba(0,208,232,0.12)', borderRadius: 12, padding: '20px 24px' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: '#00D0E8' }} />
              <p className="font-display font-bold text-cream text-xl">Hydro Constrained in Wet Spells</p>
            </div>
            <p className="font-body text-mist text-xl leading-relaxed">
              Scottish hydro schemes face constraint payments during high-rainfall periods
              when reservoirs are full and grid export is restricted. Run-of-river schemes
              are particularly vulnerable to simultaneous wind over-supply.
            </p>
          </motion.div>
        </div>

        {/* Market Opportunity Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ background: 'rgba(0,214,143,0.04)', border: '1px solid rgba(0,214,143,0.15)', borderRadius: 14, padding: '28px 32px', marginBottom: '4rem' }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-base tracking-[0.2em] uppercase mb-2" style={{ color: '#00D68F' }}>The Opportunity</p>
              <h3 className="font-display font-black text-cream mb-2" style={{ fontSize: 'clamp(22px, 3vw, 36px)', lineHeight: 1 }}>
                THE WASTE IS FLUXERO'S FEEDSTOCK.
              </h3>
              <p className="font-body text-mist text-lg leading-relaxed max-w-xl">
                UK curtailment alone represents £800M+ of green H₂ production opportunity annually.
                Globally, over 470 TWh of clean energy is wasted every year — enough to power 140 million homes.
                We convert it at source.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              {[
                { v: '£800M+', l: 'Annual UK H₂ opportunity from curtailment' },
                { v: '470 TWh', l: 'Global renewable energy wasted yearly' },
                { v: '2030', l: "UK's 10 GW green H₂ target deadline" },
              ].map(s => (
                <div key={s.v} className="flex items-baseline gap-3">
                  <span className="font-display font-black" style={{ fontSize: 28, color: '#00D68F', lineHeight: 1 }}>{s.v}</span>
                  <span className="font-body text-mist text-base">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Two column charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-black text-cream mb-8"
              style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 0.95 }}>
              THE GRID IS FULL.<br />
              <span className="text-green-gradient">THE ENERGY ISN'T.</span>
            </h2>

            <div className="space-y-5 mb-10">
              {[
                {
                  color: '#EF4444',
                  title: 'Curtailment is accelerating',
                  body: 'In 2024 the UK wasted 8.3 TWh of wind power alone — up 91% from 4.3 TWh in 2023. Solar curtailment added another 1.5 TWh. The trend is structural, not cyclical.',
                },
                {
                  color: '#00D68F',
                  title: 'The grid can\'t keep up',
                  body: 'Scotland generates 40% of UK wind power but accounts for 95% of curtailment. A single transmission bottleneck at the B6 Scotland–England boundary causes the majority of losses.',
                },
                {
                  color: '#00D0E8',
                  title: 'Consumer bills foot the bill',
                  body: 'Wind, solar, and hydro farms are paid constraint payments to switch off — £393M in 2024 alone. That cost is passed directly to consumers. Converting the surplus at source eliminates it.',
                },
              ].map(item => (
                <div key={item.title} className="flex gap-5">
                  <div className="w-1 rounded-full flex-shrink-0 mt-1" style={{ background: item.color, minHeight: 52 }} />
                  <div>
                    <h4 className="font-display font-bold text-cream text-xl mb-1">{item.title}</h4>
                    <p className="font-body text-mist text-xl leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stacked bar chart — Wind / Solar / Hydro */}
            <div style={{ background: '#131116', border: '1px solid rgba(0,214,143,0.08)', borderRadius: 12, padding: '20px' }}>
              <p className="font-mono text-base text-steel mb-1 uppercase tracking-widest">UK Renewable Curtailment by Year</p>
              <p className="font-body font-semibold text-cream text-lg mb-4">TWh wasted · Source: Electric Insights, REF, NESO</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={curtailmentHistory} barSize={20}>
                  <XAxis dataKey="year" stroke="none" tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
                  <YAxis stroke="none" tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'IBM Plex Mono' }} unit=" T" />
                  <Tooltip
                    formatter={(v: any, n: string) => [`${v} TWh`, n]}
                    contentStyle={{ background: '#131116', border: '1px solid rgba(0,214,143,0.15)', borderRadius: 6, fontSize: 13, fontFamily: 'IBM Plex Mono' }}
                    labelStyle={{ color: '#94A3B8' }}
                  />
                  <Bar dataKey="wind" name="Wind" stackId="a" fill="rgba(0,214,143,0.7)" radius={[0,0,0,0]} />
                  <Bar dataKey="solar" name="Solar" stackId="a" fill="rgba(251,191,36,0.7)" radius={[0,0,0,0]} />
                  <Bar dataKey="hydro" name="Hydro" stackId="a" fill="rgba(0,208,232,0.7)" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ background: 'rgba(0,214,143,0.7)' }} /><span className="font-mono text-base text-steel">Wind</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ background: 'rgba(251,191,36,0.7)' }} /><span className="font-mono text-base text-steel">Solar</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm inline-block" style={{ background: 'rgba(0,208,232,0.7)' }} /><span className="font-mono text-base text-steel">Hydro</span></div>
              </div>
            </div>
          </motion.div>

          {/* Daily profile chart */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ background: '#131116', border: '1px solid rgba(0,214,143,0.08)', borderRadius: 12, padding: '28px' }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-mono text-base text-steel tracking-widest uppercase mb-1">Illustrative — Scottish Onshore Wind Farm</p>
                <p className="font-display font-bold text-cream text-2xl">Generation vs Grid Capacity</p>
              </div>
              <div className="font-mono text-base px-3 py-1.5 rounded"
                style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                ▲ WASTED
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={dailyProfile}>
                <defs>
                  <linearGradient id="gGen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gGrid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#64748B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" stroke="none" tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'IBM Plex Mono' }} />
                <YAxis stroke="none" tick={{ fill: '#64748B', fontSize: 12, fontFamily: 'IBM Plex Mono' }} unit="%" />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="gen" name="Generation %" stroke="#EF4444" strokeWidth={2} fill="url(#gGen)" />
                <Area type="monotone" dataKey="cap" name="Grid cap %" stroke="#64748B" strokeWidth={1} fill="url(#gGrid)" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 px-4 py-3 rounded flex items-center justify-between"
              style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}>
              <span className="font-body text-lg text-mist">Gap above grid cap = curtailed energy</span>
              <span className="font-mono font-bold text-lg" style={{ color: '#EF4444' }}>paid to waste it</span>
            </div>

            <div className="mt-5 p-4 rounded-lg" style={{ background: 'rgba(13,12,15,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="font-mono text-base text-steel mb-3 uppercase tracking-wider">Why this is getting worse</p>
              <div className="space-y-2">
                {[
                  { dot: '#EF4444', text: '95% of UK wind curtailment originates in Scotland' },
                  { dot: '#00D68F', text: 'B6 boundary cables can\'t carry surplus south' },
                  { dot: '#FBBF24', text: 'Solar curtailment growing fastest — up 36% in 2024' },
                  { dot: '#00D0E8', text: 'Eastern HVDC link delayed to 2027+ at earliest' },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: r.dot }} />
                    <p className="font-body text-base text-mist leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
