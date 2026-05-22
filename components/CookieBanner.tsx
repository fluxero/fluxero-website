/**
 * CookieBanner — bottom-right consent strip. Required because we use
 * cookie-based analytics (Microsoft Clarity + Google Analytics).
 *
 * Once accepted/rejected the choice is persisted to localStorage and the
 * banner does not show again. Reset by clearing fluxero_cookie_consent.
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { setConsent } from './Analytics';

const CONSENT_KEY = 'fluxero_cookie_consent';

export const CookieBanner: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show only if no decision yet
    const t = setTimeout(() => {
      if (!window.localStorage.getItem(CONSENT_KEY)) setShow(true);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const decide = (v: 'accepted' | 'rejected') => {
    setConsent(v);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          exit={{    y: 60, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            left: 20,
            maxWidth: 460,
            marginLeft: 'auto',
            zIndex: 100,
            background: 'rgba(13, 12, 15, 0.96)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(0, 214, 143, 0.18)',
            borderRadius: 14,
            padding: '18px 20px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
            color: '#F0EBE0',
          }}
          role="dialog"
          aria-label="Cookie preferences"
        >
          <p style={{
            fontFamily: '"IBM Plex Sans", sans-serif',
            fontSize: 13,
            lineHeight: 1.55,
            color: '#A8A3B3',
            margin: 0,
            marginBottom: 14,
          }}>
            We use cookies for analytics &amp; to understand how visitors use Fluxero.
            No marketing, no third parties beyond Microsoft Clarity and Google Analytics.
            See our{' '}
            <a href="/privacy" style={{ color: '#00D68F', textDecoration: 'underline' }}>privacy policy</a>.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => decide('accepted')}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #00A86B, #00D68F)',
                color: '#0D0C0F',
                border: 'none',
                borderRadius: 8,
                padding: '10px 18px',
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.03em',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(0, 214, 143, 0.3)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
            >
              Accept
            </button>
            <button
              onClick={() => decide('rejected')}
              style={{
                flex: 1,
                background: 'transparent',
                color: '#A8A3B3',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 8,
                padding: '10px 18px',
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.03em',
                cursor: 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.3)'; (e.currentTarget as HTMLButtonElement).style.color = '#F0EBE0'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#A8A3B3'; }}
            >
              Reject
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
