import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { H2Calculator } from './components/H2Calculator';

export default function CalculatorPage() {
  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', paddingTop: '5rem' }}>
      {/* Page header */}
      <div style={{ borderBottom: '1px solid rgba(0,214,143,0.12)', padding: '2rem 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#94A3B8',
              fontSize: '0.875rem',
              textDecoration: 'none',
              marginBottom: '1.5rem',
            }}
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
            <h1
              style={{
                fontFamily: '"IBM Plex Sans Condensed", sans-serif',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#F1F5F9',
                textTransform: 'uppercase',
              }}
            >
              Hâ‚‚ Potential{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #00A86B 0%, #00D68F 50%, #00E5B8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Calculator
              </span>
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                color: '#00D68F',
                background: 'rgba(0,214,143,0.1)',
                border: '1px solid rgba(0,214,143,0.25)',
                borderRadius: '4px',
                padding: '2px 8px',
                fontFamily: '"IBM Plex Mono", monospace',
                textTransform: 'uppercase',
              }}
            >
              Physics-based model
            </span>
          </div>

          <p
            style={{
              marginTop: '0.5rem',
              color: '#94A3B8',
              fontSize: '1rem',
              maxWidth: '600px',
              fontWeight: 300,
            }}
          >
            Model your site's green hydrogen output using real UK solar, wind, and hydro data.
            Enter your postcode and energy source details to get annual Hâ‚‚ production estimates,
            revenue projections, and payback analysis.
          </p>
        </div>
      </div>

      {/* Calculator */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <H2Calculator />
      </div>
    </div>
  );
}


