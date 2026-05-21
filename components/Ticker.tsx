import React, { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface GenerationMixItem {
  fuel: string;
  perc: number;
}

interface LiveGridData {
  intensityActual: number | null;
  intensityIndex: string | null;
  generationMix: GenerationMixItem[];
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const RENEWABLES = ['wind', 'solar', 'hydro', 'biomass'];

function sumRenewables(mix: GenerationMixItem[]): number {
  return mix
    .filter(m => RENEWABLES.includes(m.fuel.toLowerCase()))
    .reduce((acc, m) => acc + m.perc, 0);
}

function getByFuel(mix: GenerationMixItem[], fuel: string): number {
  return mix.find(m => m.fuel.toLowerCase() === fuel)?.perc ?? 0;
}

function indexColor(index: string): string {
  const i = index.toLowerCase();
  if (i === 'low' || i === 'very low') return '#00D68F';
  if (i === 'moderate') return '#FBBF24';
  if (i === 'high' || i === 'very high') return '#EF4444';
  return '#94A3B8';
}

/* ─────────────────────────────────────────────
   Fetch live data
───────────────────────────────────────────── */
async function fetchLiveData(): Promise<LiveGridData | null> {
  try {
    const [intensityRes, generationRes] = await Promise.all([
      fetch('https://api.carbonintensity.org.uk/intensity'),
      fetch('https://api.carbonintensity.org.uk/generation'),
    ]);
    if (!intensityRes.ok || !generationRes.ok) return null;
    const intensityJson = await intensityRes.json();
    const generationJson = await generationRes.json();
    return {
      intensityActual: intensityJson?.data?.[0]?.intensity?.actual ?? null,
      intensityIndex: intensityJson?.data?.[0]?.intensity?.index ?? null,
      generationMix: generationJson?.data?.[0]?.generationmix ?? [],
    };
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────
   Hardcoded ticker items (existing content)
───────────────────────────────────────────── */
const STATIC_ITEMS: string[] = [
  '⚡ 8.3 TWh of UK wind wasted in 2024 — up 91% YoY',
  '🔋 Fluxero converts curtailed renewables into green hydrogen at source',
  '💰 £393M paid in constraint payments to UK generators in 2024',
  '🌬 Scotland generates 40% of UK wind but accounts for 95% of curtailment',
  '☀ Solar curtailment up 36% in 2024 — midday demand mismatch growing',
  '🌍 Global renewable curtailment estimated at 472+ TWh/year — IEA 2024',
  '⚗ Each tonne of green H₂ displaces ~9 tonnes of CO₂ vs grey hydrogen',
  '🚂 Scottish wind curtailment peaks when B6 transmission corridor saturates',
  '🏭 Fluxero modular electrolysers deploy in 90 days, no new grid connection',
  '📈 Green hydrogen market projected to reach $680B by 2050 — BloombergNEF',
];

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export const Ticker: React.FC = () => {
  const [liveData, setLiveData] = useState<LiveGridData | null>(null);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  /* ── Fetch on mount + every 60 s ── */
  useEffect(() => {
    fetchLiveData().then(setLiveData);
    const id = setInterval(() => fetchLiveData().then(setLiveData), 60_000);
    return () => clearInterval(id);
  }, []);

  /* ── Build items list ── */
  const liveItems: string[] = [];
  if (liveData) {
    if (liveData.intensityActual !== null && liveData.intensityIndex) {
      liveItems.push(`⚡ UK Grid Now: ${liveData.intensityActual} gCO₂/kWh · ${liveData.intensityIndex}`);
    }
    if (liveData.generationMix.length > 0) {
      const renewPct = sumRenewables(liveData.generationMix).toFixed(1);
      liveItems.push(`♻ Renewables: ${renewPct}%`);
      const wind = getByFuel(liveData.generationMix, 'wind').toFixed(1);
      const solar = getByFuel(liveData.generationMix, 'solar').toFixed(1);
      const hydro = getByFuel(liveData.generationMix, 'hydro').toFixed(1);
      liveItems.push(`🌬 Wind: ${wind}% · ☀ Solar: ${solar}% · 💧 Hydro: ${hydro}%`);
    }
  }
  const allItems = [...liveItems, ...STATIC_ITEMS];
  // Duplicate for seamless loop
  const displayItems = [...allItems, ...allItems];

  /* ── Continuous scroll animation ── */
  useEffect(() => {
    const SPEED = 0.4; // px per frame
    const step = () => {
      if (!pausedRef.current && trackRef.current) {
        setOffset(prev => {
          const track = trackRef.current!;
          const halfWidth = track.scrollWidth / 2;
          const next = prev + SPEED;
          return next >= halfWidth ? 0 : next;
        });
      }
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      style={{
        background: '#070608',
        borderTop: '1px solid rgba(0,214,143,0.12)',
        borderBottom: '1px solid rgba(0,214,143,0.12)',
        overflow: 'hidden',
        position: 'relative',
        height: 40,
      }}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* Left fade */}
      <div
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
          background: 'linear-gradient(90deg, #070608 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      {/* Right fade */}
      <div
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
          background: 'linear-gradient(270deg, #070608 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          whiteSpace: 'nowrap',
          transform: `translateX(-${offset}px)`,
          willChange: 'transform',
        }}
      >
        {displayItems.map((item, i) => {
          /* Colour the intensity index token for live items */
          const isIntensityItem = item.startsWith('⚡ UK Grid Now:') && liveData?.intensityIndex;
          if (isIntensityItem && liveData?.intensityIndex) {
            const idx = liveData.intensityIndex;
            const parts = item.split(` · ${idx}`);
            return (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', margin: '0 32px' }}>
                <span className="font-mono text-xs" style={{ color: '#94A3B8' }}>{parts[0]} · </span>
                <span className="font-mono text-xs font-bold" style={{ color: indexColor(idx) }}>{idx}</span>
              </span>
            );
          }
          return (
            <span
              key={i}
              className="font-mono text-xs"
              style={{ color: '#94A3B8', margin: '0 32px', letterSpacing: '0.04em' }}
            >
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
};
