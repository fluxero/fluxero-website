import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

/* ─── UK GeoJSON (Local Authority Districts) ─────────────
   Uses the martinjc/UK-GeoJSON dataset — well-maintained,
   accurate UK outline with all regions as separate features.
──────────────────────────────────────────────────────── */
const GEO_URL =
  'https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/administrative/gb/topo_lad.json';

/* ─── Region Data ─────────────────────────────────────── */
interface RegionData {
  name: string;
  wind_twh: number;
  solar_twh: number;
  hydro_twh: number;
  pct: number;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  lad_prefix: string[];
  coords: [number, number];
  note: string;
}

const REGIONS: RegionData[] = [
  {
    name: 'Scottish Highlands & Islands',
    wind_twh: 4.8,
    solar_twh: 0.02,
    hydro_twh: 0.45,
    pct: 58,
    severity: 'critical',
    lad_prefix: ['S12'],
    coords: [-4.5, 57.5],
    note: 'Largest wind curtailment zone. B6 transmission constraint.',
  },
  {
    name: 'Southern Scotland',
    wind_twh: 3.1,
    solar_twh: 0.05,
    hydro_twh: 0.12,
    pct: 37,
    severity: 'critical',
    lad_prefix: ['S13', 'S14'],
    coords: [-3.2, 55.6],
    note: 'Significant wind capacity constrained by grid limits.',
  },
  {
    name: 'Northern England',
    wind_twh: 0.25,
    solar_twh: 0.08,
    hydro_twh: 0.02,
    pct: 3,
    severity: 'moderate',
    lad_prefix: ['E06000057', 'E06000001', 'E06000002'],
    coords: [-1.6, 54.7],
    note: 'Growing constraint as offshore connects.',
  },
  {
    name: 'East Anglia',
    wind_twh: 0.08,
    solar_twh: 0.22,
    hydro_twh: 0,
    pct: 1,
    severity: 'low',
    lad_prefix: ['E07000'],
    coords: [0.9, 52.4],
    note: 'Solar curtailment increasing. Offshore wind growing.',
  },
  {
    name: 'South West England',
    wind_twh: 0.05,
    solar_twh: 0.38,
    hydro_twh: 0.01,
    pct: 1,
    severity: 'low',
    lad_prefix: ['E06000052', 'E06000027'],
    coords: [-3.5, 50.9],
    note: 'Highest solar irradiance in UK — midday curtailment.',
  },
];

const SEVERITY_COLOR: Record<string, string> = {
  critical: 'rgba(239,68,68,0.8)',
  high:     'rgba(249,115,22,0.7)',
  moderate: 'rgba(59,130,246,0.6)',
  low:      'rgba(59,130,246,0.3)',
};

const SEVERITY_FILL: Record<string, string> = {
  critical: 'rgba(239,68,68,0.18)',
  high:     'rgba(249,115,22,0.14)',
  moderate: 'rgba(59,130,246,0.12)',
  low:      'rgba(59,130,246,0.06)',
};

/* ─── Component ───────────────────────────────────────── */
export const CurtailmentMap: React.FC = () => {
  const [hovered, setHovered] = useState<RegionData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getRegionFill = (geo: any): { fill: string; stroke: string } => {
    const code: string = geo.properties?.LAD13CD || geo.properties?.lad13cd || '';
    for (const r of REGIONS) {
      if (r.lad_prefix.some(p => code.startsWith(p))) {
        return { fill: SEVERITY_FILL[r.severity], stroke: SEVERITY_COLOR[r.severity] };
      }
    }
    return {
      fill: code.startsWith('S') ? SEVERITY_FILL['high'] : 'rgba(30,41,59,0.6)',
      stroke: code.startsWith('S') ? SEVERITY_COLOR['high'] : 'rgba(71,85,105,0.25)',
    };
  };

  return (
    <section id="map" style={{ background: '#0F172A', padding: '6rem 0' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-4" style={{ color: '#3B82F6' }}>
            Where Energy Is Wasted
          </p>
          <h2
            className="font-display font-black text-cream leading-none mb-4"
            style={{ fontSize: 'clamp(28px, 5vw, 56px)', letterSpacing: '-0.02em', textTransform: 'uppercase' }}
          >
            UK Curtailment{' '}
            <span className="text-blue-gradient">Hotspots</span>
          </h2>
          <p className="font-body text-mist max-w-lg leading-relaxed font-light" style={{ fontSize: '1rem' }}>
            Grid constraints force operators to switch off wind, solar, and hydro generation.
            Scotland accounts for 95% of curtailed wind — but solar curtailment is rising
            fast across England.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Map */}
          <div className="lg:col-span-3 relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(59,130,246,0.1)',
                borderRadius: 12,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <ComposableMap
                projection="geoAlbers"
                projectionConfig={{
                  rotate: [2.0, 0, 0],
                  center: [0, 54.5],
                  scale: 3000,
                }}
                style={{ width: '100%', height: 'auto' }}
                viewBox="0 0 600 700"
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map(geo => {
                      const { fill, stroke } = getRegionFill(geo);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={{
                            default: { fill, stroke, strokeWidth: 0.3, outline: 'none' },
                            hover:   { fill: fill.replace(/[\d.]+\)$/, '0.35)'), stroke, strokeWidth: 0.5, outline: 'none', cursor: 'pointer' },
                            pressed: { fill, stroke, outline: 'none' },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>

                {/* Region markers */}
                {REGIONS.map(r => (
                  <Marker
                    key={r.name}
                    coordinates={r.coords}
                    onMouseEnter={(evt: React.MouseEvent) => {
                      setHovered(r);
                      const svgEl = (evt.currentTarget as SVGElement).closest('svg');
                      if (svgEl) {
                        const rect = svgEl.getBoundingClientRect();
                        setTooltipPos({ x: evt.clientX - rect.left, y: evt.clientY - rect.top });
                      }
                    }}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <circle r={6} fill={SEVERITY_FILL[r.severity]} stroke={SEVERITY_COLOR[r.severity]} strokeWidth={1} />
                    {r.severity === 'critical' && (
                      <circle r={10} fill="none" stroke={SEVERITY_COLOR[r.severity]} strokeWidth={0.8} opacity={0.4}>
                        <animate attributeName="r" from="6" to="16" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </Marker>
                ))}
              </ComposableMap>

              {/* Tooltip */}
              {hovered && (
                <div
                  style={{
                    position: 'absolute',
                    left: Math.min(tooltipPos.x + 12, 340),
                    top: Math.max(tooltipPos.y - 10, 10),
                    background: 'rgba(15,23,42,0.96)',
                    border: `1px solid ${SEVERITY_COLOR[hovered.severity]}`,
                    borderRadius: 8,
                    padding: '12px 16px',
                    pointerEvents: 'none',
                    minWidth: 220,
                    zIndex: 20,
                  }}
                >
                  <p className="font-display font-bold text-cream text-sm mb-2">{hovered.name}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                    {hovered.wind_twh > 0 && (
                      <>
                        <span className="font-mono text-xs" style={{ color: SEVERITY_COLOR[hovered.severity] }}>{hovered.wind_twh} TWh</span>
                        <span className="font-body text-xs text-mist">Wind</span>
                      </>
                    )}
                    {hovered.solar_twh > 0 && (
                      <>
                        <span className="font-mono text-xs" style={{ color: '#FBBF24' }}>{hovered.solar_twh} TWh</span>
                        <span className="font-body text-xs text-mist">Solar</span>
                      </>
                    )}
                    {hovered.hydro_twh > 0 && (
                      <>
                        <span className="font-mono text-xs" style={{ color: '#38BDF8' }}>{hovered.hydro_twh} TWh</span>
                        <span className="font-body text-xs text-mist">Hydro</span>
                      </>
                    )}
                  </div>
                  <p className="font-body text-xs leading-relaxed" style={{ color: '#64748B' }}>{hovered.note}</p>
                </div>
              )}

              {/* Legend */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  background: 'rgba(15,23,42,0.88)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 6,
                  padding: '8px 12px',
                }}
              >
                {(['critical', 'high', 'moderate', 'low'] as const).map(s => (
                  <div key={s} className="flex items-center gap-2 mb-1 last:mb-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SEVERITY_COLOR[s] }} />
                    <span className="font-mono text-[10px] uppercase tracking-wider capitalize" style={{ color: '#64748B' }}>{s}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Region list */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {REGIONS.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  background: hovered?.name === r.name ? 'rgba(59,130,246,0.06)' : 'rgba(30,41,59,0.4)',
                  border: `1px solid ${hovered?.name === r.name ? SEVERITY_COLOR[r.severity] : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: 8,
                  padding: '14px 16px',
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={() => setHovered(r)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-body font-semibold text-sm text-cream leading-tight">{r.name}</p>
                  <span
                    className="font-mono text-xs px-2 py-0.5 rounded ml-2 flex-shrink-0"
                    style={{
                      color: SEVERITY_COLOR[r.severity],
                      background: SEVERITY_FILL[r.severity],
                      border: `1px solid ${SEVERITY_COLOR[r.severity]}`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {r.severity}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-1 rounded-full"
                      style={{ width: `${r.pct}%`, background: SEVERITY_COLOR[r.severity], transition: 'width 0.6s ease' }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-steel flex-shrink-0">{r.pct}%</span>
                </div>

                <div className="flex gap-4 text-xs flex-wrap">
                  {r.wind_twh > 0 && (
                    <span>
                      <span className="font-mono font-bold" style={{ color: SEVERITY_COLOR[r.severity] }}>{r.wind_twh} TWh</span>
                      {' '}<span className="text-steel">wind</span>
                    </span>
                  )}
                  {r.solar_twh > 0 && (
                    <span>
                      <span className="font-mono font-bold" style={{ color: '#FBBF24' }}>{r.solar_twh} TWh</span>
                      {' '}<span className="text-steel">solar</span>
                    </span>
                  )}
                  {r.hydro_twh > 0 && (
                    <span>
                      <span className="font-mono font-bold" style={{ color: '#38BDF8' }}>{r.hydro_twh} TWh</span>
                      {' '}<span className="text-steel">hydro</span>
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10"
        >
          {[
            { v: '8.3 TWh', l: 'Total wind curtailed', sub: '2024 · Elexon data' },
            { v: '£393M',   l: 'Paid to curtail',       sub: 'UK consumer bills' },
            { v: '95%',     l: 'From Scotland',          sub: 'B6 constraint' },
            { v: '1.5 TWh', l: 'Solar curtailed',        sub: '2024 · growing fast' },
          ].map(s => (
            <div
              key={s.v}
              style={{
                background: 'rgba(30,41,59,0.4)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 8,
                padding: '16px',
              }}
            >
              <p className="font-mono font-bold text-xl mb-1" style={{ color: '#3B82F6' }}>{s.v}</p>
              <p className="font-body text-sm text-cream mb-0.5">{s.l}</p>
              <p className="font-body text-xs" style={{ color: '#475569' }}>{s.sub}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
