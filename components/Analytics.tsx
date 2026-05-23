/**
 * Analytics — loads Microsoft Clarity + Google Analytics 4 only after
 * the user has accepted cookies. Consent is read from localStorage.
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const CLARITY_PROJECT_ID = 'wuwrbeairf';   // clarity.microsoft.com
export const GA_MEASUREMENT_ID  = 'G-D1K5HC0ZRW'; // analytics.google.com

const CONSENT_KEY = 'fluxero_cookie_consent';

export function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(CONSENT_KEY) === 'accepted';
}

export function setConsent(value: 'accepted' | 'rejected') {
  window.localStorage.setItem(CONSENT_KEY, value);
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
    console.log('[fluxero] clarity loaded');
  `);
}

function loadGA() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;
  injectScript('ga-loader', `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
  // NOTE: NO `send_page_view: false` — let GA auto-fire the initial page_view
  // for the landing URL. Manual page_view (below) only fires on SUBSEQUENT
  // route changes, skipping the first to avoid duplicates.
  injectScript('ga-init', '', `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
    console.log('[fluxero] gtag loaded — initial page_view fired');
  `);
}

/**
 * Drop <Analytics /> once near the root.
 *   1. Loads Clarity + GA scripts whenever consent is granted
 *      (and on first mount if previously accepted).
 *   2. Fires a manual GA page_view on every SPA route change after
 *      the first (the first is auto-fired by GA's own config).
 */
export const Analytics: React.FC = () => {
  const { pathname } = useLocation();
  const firstRouteRef = useRef(true);

  // Load scripts after consent (and on mount if already accepted).
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

  // SPA page_view on subsequent route changes only.
  useEffect(() => {
    if (firstRouteRef.current) {
      firstRouteRef.current = false;
      return; // GA's own config fires the initial page_view
    }
    if (!hasConsent()) return;
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
    console.log('[fluxero] page_view ' + pathname);
  }, [pathname]);

  return null;
};
