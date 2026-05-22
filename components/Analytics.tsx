/**
 * Analytics — loads Microsoft Clarity + Google Analytics 4 only after
 * the user has accepted cookies. Consent is read from localStorage.
 *
 * Configure your IDs once in `src/analyticsConfig.ts` (or paste below).
 *
 *   MS Clarity project id  → looks like  abcd1234ef
 *   GA4 measurement id     → looks like  G-XXXXXXXXXX
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* ─── TODO: paste your real IDs here once you create the accounts ── */
export const CLARITY_PROJECT_ID = 'wuwrbeairf';                // clarity.microsoft.com
export const GA_MEASUREMENT_ID  = 'G-XXXXXXXXXX';              // analytics.google.com

const CONSENT_KEY = 'fluxero_cookie_consent';

export function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(CONSENT_KEY) === 'accepted';
}

export function setConsent(value: 'accepted' | 'rejected') {
  window.localStorage.setItem(CONSENT_KEY, value);
  // Fire a window event so the Analytics component re-checks.
  window.dispatchEvent(new Event('fluxero:consent'));
}

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/* Inject a <script> exactly once. */
function injectScript(id: string, src: string, inline?: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  if (src) s.src = src;
  s.async = true;
  if (inline) s.textContent = inline;
  document.head.appendChild(s);
}

function loadClarity() {
  if (!CLARITY_PROJECT_ID || CLARITY_PROJECT_ID.startsWith('CLARITY_PROJECT_ID')) return;
  injectScript('ms-clarity', '', `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
  `);
}

function loadGA() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;
  injectScript('ga-loader', `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
  injectScript('ga-init', '', `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
  `);
}

/**
 * Drop <Analytics /> once near the root. It:
 *   1. Loads Clarity + GA scripts when consent is granted (and on first mount if
 *      consent was previously accepted).
 *   2. Fires a GA page_view on every route change.
 */
export const Analytics: React.FC = () => {
  const { pathname } = useLocation();

  // Load scripts after consent.
  useEffect(() => {
    const apply = () => {
      if (!hasConsent()) return;
      loadClarity();
      loadGA();
    };
    apply();
    window.addEventListener('fluxero:consent', apply);
    return () => window.removeEventListener('fluxero:consent', apply);
  }, []);

  // Fire page_view on route change (only if GA is loaded).
  useEffect(() => {
    if (!hasConsent()) return;
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
    });
  }, [pathname]);

  return null;
};
