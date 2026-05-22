import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

/* â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const GEO_URL =
  'https://raw.githubusercontent.com/martinjc/UK-GeoJSON/master/json/administrative/gb/topo_lad.json';

const C = {
  green:   '#00D68F',
  bg:      '#0D0C0F',
  card:    '#131116',
  cream:   '#F0EBE0',
  mist:    '#A8A3B3',
  steel:   '#64748B',
  red:     '#FF4020',
  orange:  '#FF8C00',
};

/* â”€â”€â”€ Region data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
interface Region {
  id: string;
  name: string;
  twh: number;
  pct: number;
  notes: string;
  coords: [number, number];
  severity: 'critical' | 'high' | 'moderate' | 'low';
}

const regions: Region[] = [
  {
    id: 'highlands',
    name: 'Scottish Highlands',
    twh: 4.8,
    pct: 58,
    notes: 'Largest UK curtailment source. Remote wind farms with no transmission path south.',
    coords: [-4.5, 57.8],
    severity: 'critical',
  },
  {
    id: 'southern-scotland',
    name: 'Southern Scotland',
    twh: 3.1,
    pct: 37,
    notes: 'B6 boundary bottleneck â€” the pinch point between Scotland and England.',
    coords: [-3.8, 55.4],
    severity: 'critical',
  },
  {
    id: 'northern-england',
    name: 'Northern England',
    twh: 0.25,
    pct: 3,
    notes: 'Some curtailment from downstream B6 congestion effects.',
    coords: [-2.1, 54.8],
    severity: 'moderate',
  },
  {
    id: 'east-anglia',
    name: 'East Anglia / Offshore',
    twh: 0.08,
    pct: 1,
    notes: 'Offshore wind. Occasional curtailment during high generation.',
    coords: [1.2, 52.5],
    severity: 'low',
  },
  {
    id: 'south-west',
    name: 'South West',
    twh: 0.07,
    pct: 1,
    notes: 'Solar curtailment growing as rooftop capacity increases.',
    coords: [-4.2, 50.8],
    severity: 'low',
  },
];

/* â”€â”€â”€ GeoJSON region name â†’ fill colour â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const CRITICAL_NAMES = new Set([
  'Highland', 'Argyll and Bute', 'Na h-Eileanan Siar',
  'Orkney Islands', 'Shetland Islands', 'Perth and Kinross',
  'Aberdeenshire', 'Moray',
]);
const HIGH_NAMES = new Set([
  'Dumfries and Galloway', 'Scottish Borders',
  'East Lothian', 'South Lanarkshire',
]);
const MODERATE_NAMES = new Set([
  'Cumbria', 'Northumberland', 'Durham',
]);

function geoFill(name: string): { fill: string; stroke: string } {
  if (CRITICAL_NAMES.has(name)) return { fill: 'rgba(255,64,32,0.7)',   stroke: 'rgba(255,64,32,0.9)' };
  if (HIGH_NAMES.has(name))     return { fill: 'rgba(255,140,0,0.6)',   stroke: 'rgba(255,140,0,0.8)' };
  if (MODERATE_NAMES.has(name)) return { fill: 'rgba(0,214,143,0.4)',   stroke: 'rgba(0,214,143,0.65)' };
  return                               { fill: 'rgba(0,214,143,0.12)',  stroke: 'rgba(0,214,143,0.18)' };
}

/* â”€â”€â”€ Marker colours â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function markerColor(severity: Region['severity']): string {
  if (severity === 'critical') return C.red;
  if (severity === 'moderate') return C.green;
  return `rgba(0,214,143,0.5)`;
}

function markerLabel(r: Region): string {
  return `${r.twh} TWh`;
}

/* â”€â”€â”€ Severity badge styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function severityStyle(s: Region['severity']): React.CSSProperties {
  const map: Record<Region['severity'], { color: string; bg: string }> = {
    critical: { color: C.red,    bg: 'rgba(255,64,32,0.12)' },
    high:     { color: C.orange, bg: 'rgba(255,140,0,0.12)' },
    moderate: { color: C.green,  bg: 'rgba(0,214,143,0.12)' },
    low:      { color: C.mist,   bg: 'rgba(168,163,179,0.1)' },
  };
  return {
    color: map[s].color,
    background: map[s].bg,
    border: `1px solid ${map[s].color}`,
  };
}

function barColor(s: Region['severity']): string {
  if (s === 'critical') return C.red;
  if (s === 'high')     return C.orange;
  if (s === 'moderate') return C.green;
  return C.mist;
}

/* â”€â”€â”€ Bottom stat cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const STATS = [
  { value: '8.3 TWh', label: 'Total curtailed',    sub: '2024 Â· Elexon' },
  { value: 'Â£393M',   label: 'Paid to curtail',    sub: 'UK consumer bills' },
  { value: '95%',     label: 'From Scotland',       sub: 'B6 constraint' },
  { value: '10 GW',   label: 'Constrained capacity',sub: 'Scotland grid limit' },
];

/* â”€â”€â”€ Pulsing marker component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const PulseMarker: React.FC<{
  region: Region;
  hovered: string | null;
  onEnter: (id: string) => void;
  onLeave: () => void;
}> = ({ region, hovered, onEnter, onLeave }) => {
  const color = markerColor(region.severity);
  const isHovered = hovered === region.id;

  return (
    <Marker
      coordinates={region.coords}
      onMouseEnter={() => onEnter(region.id)}
      onMouseLeave={onLeave}
    >
      {/* Outer pulse â€” framer-motion won't animate SVG elements directly,
          so we use a CSS animation via style tag inserted once */}
      <motion.circle
        r={12}
        fill="none"
        stroke={color}
        strokeWidth={1}
        initial={{ scale: 1, opacity: 0.4 }}
        animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '0 0' }}
      />
      {/* Inner solid dot */}
      <circle
        r={6}
        fill={color}
        stroke={isHovered ? C.cream : 'rgba(13,12,15,0.8)'}
        strokeWidth={isHovered ? 1.5 : 1}
        style={{ cursor: 'pointer', transition: 'stroke 0.2s' }}
      />
      {/* TWh label */}
      <text
        x={10}
        y={4}
        style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '8px',
          fill: isHovered ? C.cream : color,
          fontWeight: 600,
          pointerEvents: 'none',
          transition: 'fill 0.2s',
        }}
      >
        {markerLabel(region)}
      </text>
    </Marker>
  );
};

/* â”€â”€â”€ B6 boundary annotation line â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
/* Rendered as a Marker at mid-point with an SVG line extending left/right */
const B6BoundaryLine: React.FC = () => (
  <Marker coordinates={[-2.3, 55.05]}>
    {/* Dashed horizontal rule ~200px wide centered on the marker */}
    <line
      x1={-80} y1={0} x2={80} y2={0}
      stroke="rgba(255,140,0,0.55)"
      strokeWidth={1}
      strokeDasharray="4 3"
    />
    <text
      x={85}
      y={4}
      style={{
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '7px',
        fill: 'rgba(255,140,0,0.8)',
        fontWeight: 600,
        letterSpacing: '0.05em',
      }}
    >
      B6 BOUNDARY
    </text>
  </Marker>
);

/* â”€â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const CurtailmentMap: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  const hoveredRegion = regions.find(r => r.id === hovered) ?? null;

  return (
    <section
      id="map"
      style={{ background: C.bg, padding: '6rem 0', position: 'relative' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
            alignItems: 'start',
          }}
          className="lg:grid-cols-curtailment"
        >
          {/* â”€â”€ Left: Map â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'relative',
              background: C.card,
              border: `1px solid rgba(0,214,143,0.12)`,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ rotate: [0, 0, 0], scale: 5500, center: [-2, 55.5] }}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              viewBox="0 0 600 700"
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    const name: string =
                      geo.properties?.LAD13NM ||
                      geo.properties?.lad13nm ||
                      geo.properties?.name ||
                      '';
                    const { fill, stroke } = geoFill(name);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill,
                            stroke,
                            strokeWidth: 0.3,
                            outline: 'none',
                          },
                          hover: {
                            fill,
                            stroke,
                            strokeWidth: 0.6,
                            outline: 'none',
                          },
                          pressed: {
                            fill,
                            stroke,
                            outline: 'none',
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {/* B6 boundary dashed annotation */}
              <B6BoundaryLine />

              {/* Pulsing markers */}
              {regions.map(r => (
                <PulseMarker
                  key={r.id}
                  region={r}
                  hovered={hovered}
                  onEnter={setHovered}
                  onLeave={() => setHovered(null)}
                />
              ))}
            </ComposableMap>

            {/* Legend */}
            <div
              style={{
                position: 'absolute',
                bottom: 14,
                left: 14,
                background: 'rgba(13,12,15,0.88)',
                border: '1px solid rgba(0,214,143,0.12)',
                borderRadius: 6,
                padding: '10px 14px',
              }}
            >
              {(
                [
                  { label: 'Critical',  color: C.red },
                  { label: 'High',      color: C.orange },
                  { label: 'Moderate',  color: C.green },
                  { label: 'Low',       color: 'rgba(0,214,143,0.4)' },
                ] as const
              ).map(({ label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span
                    style={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: 10,
                      color: C.steel,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* â”€â”€ Right: Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Section label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 1, background: C.green }} />
              <span
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 11,
                  color: C.green,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                UK Curtailment Map
              </span>
            </div>

            {/* Heading */}
            <h2
              style={{
                fontFamily: '"IBM Plex Sans Condensed", sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(38px, 5vw, 64px)',
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                color: C.cream,
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              THE WASTE IS{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.green} 0%, #00FFB3 60%, #00D68F 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                CONCENTRATED.
              </span>
            </h2>

            {/* Description */}
            <p
              style={{
                fontFamily: 'IBM Plex Sans, sans-serif',
                fontWeight: 300,
                fontSize: '1.0625rem',
                color: C.mist,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Scotland alone accounts for 95% of all UK wind curtailment.
              Grid infrastructure built for coal cannot carry the volume of
              renewables now installed in the north. The energy exists â€” the
              wires cannot take it.
            </p>

            {/* Hover info card */}
            <AnimatePresence mode="wait">
              {hoveredRegion ? (
                <motion.div
                  key={hoveredRegion.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: C.card,
                    border: `1px solid ${barColor(hoveredRegion.severity)}`,
                    borderRadius: 10,
                    padding: '16px 18px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 10 }}>
                    <p
                      style={{
                        fontFamily: '"IBM Plex Sans Condensed", sans-serif',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: C.cream,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        margin: 0,
                      }}
                    >
                      {hoveredRegion.name}
                    </p>
                    <span
                      style={{
                        ...severityStyle(hoveredRegion.severity),
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: 10,
                        padding: '2px 8px',
                        borderRadius: 4,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        flexShrink: 0,
                      }}
                    >
                      {hoveredRegion.severity}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: 10 }}>
                    <div>
                      <span
                        style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: barColor(hoveredRegion.severity),
                        }}
                      >
                        {hoveredRegion.twh} TWh
                      </span>
                    </div>
                    <div>
                      <span
                        style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: C.mist,
                        }}
                      >
                        {hoveredRegion.pct}%
                      </span>
                      <span
                        style={{
                          fontFamily: 'IBM Plex Sans, sans-serif',
                          fontSize: '0.75rem',
                          color: C.steel,
                          marginLeft: 6,
                        }}
                      >
                        of total
                      </span>
                    </div>
                  </div>
                  <p
                    style={{
                      fontFamily: 'IBM Plex Sans, sans-serif',
                      fontSize: '0.85rem',
                      color: C.mist,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {hoveredRegion.notes}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: C.card,
                    border: '1px solid rgba(0,214,143,0.08)',
                    borderRadius: 10,
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: C.green,
                      opacity: 0.5,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: 11,
                      color: C.steel,
                      letterSpacing: '0.08em',
                    }}
                  >
                    Hover a marker to inspect region data
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {regions.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  onMouseEnter={() => setHovered(r.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: hovered === r.id ? 'rgba(0,214,143,0.04)' : 'transparent',
                    border: `1px solid ${hovered === r.id ? barColor(r.severity) : 'rgba(0,214,143,0.08)'}`,
                    borderRadius: 8,
                    padding: '10px 14px',
                    cursor: 'default',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'IBM Plex Sans, sans-serif',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        color: hovered === r.id ? C.cream : C.mist,
                        transition: 'color 0.2s',
                      }}
                    >
                      {r.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: 11,
                          color: barColor(r.severity),
                          fontWeight: 600,
                        }}
                      >
                        {r.twh} TWh
                      </span>
                      <span
                        style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: 10,
                          color: C.steel,
                        }}
                      >
                        {r.pct}%
                      </span>
                    </div>
                  </div>
                  {/* Bar track */}
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.06)',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${r.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        borderRadius: 2,
                        background: barColor(r.severity),
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stat cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                marginTop: '0.5rem',
              }}
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={s.value}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.2 + i * 0.07 }}
                  style={{
                    background: C.card,
                    border: '1px solid rgba(0,214,143,0.08)',
                    borderRadius: 8,
                    padding: '18px 20px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontWeight: 700,
                      fontSize: '1.15rem',
                      color: C.green,
                      margin: '0 0 4px',
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    style={{
                      fontFamily: 'IBM Plex Sans, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: C.cream,
                      margin: '0 0 2px',
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'IBM Plex Sans, sans-serif',
                      fontSize: '0.78rem',
                      color: C.steel,
                      margin: 0,
                    }}
                  >
                    {s.sub}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tailwind responsive helper â€” sets the two-column grid on large screens */}
      <style>{`
        @media (min-width: 1024px) {
          .lg\\:grid-cols-curtailment {
            grid-template-columns: 3fr 2fr !important;
          }
        }
      `}</style>
    </section>
  );
};

