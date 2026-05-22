import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState('');
  const navigate   = useNavigate();
  const location   = useLocation();
  const isCalcPage = location.pathname === '/calculator';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (isCalcPage) return;
    const sections = ['problem', 'solution', 'tech', 'team', 'contact'];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.4 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [isCalcPage]);

  const links = [
    { label: 'Problem',    href: '#problem'  },
    { label: 'Solution',   href: '#solution' },
    { label: 'Technology', href: '#tech'     },
    { label: 'Team',       href: '#team'     },
    { label: 'Contact',    href: '#contact'  },
  ];

  const handleAnchor = (href: string) => {
    if (isCalcPage) {
      navigate('/');
      setTimeout(() => {
        document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    } else {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    }
    setOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 inset-x-0 z-50"
      style={{
        background: scrolled ? 'rgba(7,6,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,214,143,0.08)' : 'none',
        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {scrolled && (
        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,214,143,0.4), transparent)' }} />
      )}

      <div
        className="max-w-7xl mx-auto flex items-center justify-between"
        style={{ padding: scrolled ? '14px 32px' : '22px 32px', transition: 'padding 0.5s ease' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" style={{ textDecoration: 'none' }}>
          <img
            src="/logo.png"
            alt="Fluxero"
            className="h-8 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
            onError={e => {
              (e.target as HTMLImageElement).style.display = 'none';
              const el = document.createElement('span');
              el.style.cssText = 'font-family:"IBM Plex Sans Condensed",sans-serif;font-weight:900;font-size:20px;letter-spacing:0.18em;color:#F0EBE0;';
              el.textContent = 'FLUXERO';
              (e.target as HTMLImageElement).parentElement!.appendChild(el);
            }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: '#00D68F', boxShadow: '0 0 6px rgba(59,130,246,0.8)' }}
          />
        </Link>

        {/* Desktop pill nav */}
        <div
          className="hidden md:flex items-center transition-all duration-400"
          style={{
            background: scrolled ? 'rgba(255,255,255,0.03)' : 'transparent',
            border: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
            borderRadius: 999,
            padding: scrolled ? '5px 6px' : '0',
            gap: scrolled ? 2 : 24,
          }}
        >
          {links.map(l => {
            const isActive = !isCalcPage && active === l.href.slice(1);
            return (
              <button
                key={l.label}
                onClick={() => handleAnchor(l.href)}
                className="relative font-body font-medium transition-all duration-200"
                style={{
                  fontSize: 13,
                  letterSpacing: '0.04em',
                  color: isActive ? '#00D68F' : 'rgba(148,163,184,0.9)',
                  padding: scrolled ? '7px 16px' : '4px 0',
                  borderRadius: scrolled ? 999 : 0,
                  background: isActive && scrolled ? 'rgba(0,214,143,0.1)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = '#F0EBE0';
                    if (scrolled) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(148,163,184,0.9)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                {l.label}
                {!scrolled && (
                  <span className="absolute -bottom-1 left-0 h-px rounded-full transition-all duration-300"
                    style={{ background: '#00D68F', width: isActive ? '100%' : '0%' }} />
                )}
              </button>
            );
          })}

          {/* Calculator link */}
          <Link
            to="/calculator"
            className="font-body font-semibold transition-all duration-200"
            style={{
              fontSize: 13,
              letterSpacing: '0.04em',
              color: isCalcPage ? '#00D68F' : 'rgba(148,163,184,0.9)',
              padding: scrolled ? '7px 16px' : '4px 0',
              borderRadius: scrolled ? 999 : 0,
              background: isCalcPage && scrolled ? 'rgba(0,214,143,0.1)' : 'transparent',
              textDecoration: 'none',
            }}
          >
            Calculator
          </Link>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{ background: 'rgba(0,214,143,0.06)', border: '1px solid rgba(0,214,143,0.18)' }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#00D68F' }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#00D68F' }} />
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: '#00D68F' }}>Pilot Active</span>
          </div>
          <button
            onClick={() => handleAnchor('#contact')}
            className="font-body font-semibold text-xs px-5 py-2.5 rounded-full tracking-wide transition-all"
            style={{
              background: 'linear-gradient(135deg, #00A86B, #00D68F)',
              color: '#F0EBE0',
              letterSpacing: '0.06em',
              boxShadow: '0 0 20px rgba(0,214,143,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(0,214,143,0.45), inset 0 1px 0 rgba(255,255,255,0.15)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0,214,143,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
            }}
          >
            Contact us
          </button>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2" aria-label="Menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <div className="flex flex-col gap-1.5">
            <span className="block h-px w-6 transition-all duration-300"
              style={{ background: '#F0EBE0', transform: open ? 'translateY(9px) rotate(45deg)' : 'none' }} />
            <span className="block h-px w-4 transition-all duration-300"
              style={{ background: '#00D68F', opacity: open ? 0 : 1 }} />
            <span className="block h-px w-6 transition-all duration-300"
              style={{ background: '#F0EBE0', transform: open ? 'translateY(-9px) rotate(-45deg)' : 'none' }} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'rgba(7,6,8,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,214,143,0.08)' }}
          >
            <div className="px-6 py-8 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.button key={l.label}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleAnchor(l.href)}
                  className="font-display font-bold text-2xl py-3 border-b text-left flex items-center gap-4 transition-colors"
                  style={{
                    color: active === l.href.slice(1) ? '#00D68F' : '#F0EBE0',
                    borderColor: 'rgba(255,255,255,0.05)',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                  }}>
                  <span className="font-mono text-xs" style={{ color: '#64748B' }}>0{i + 1}</span>
                  {l.label}
                </motion.button>
              ))}

              {/* Calculator mobile link */}
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <Link
                  to="/calculator"
                  onClick={() => setOpen(false)}
                  className="font-display font-bold text-2xl py-3 flex items-center gap-4"
                  style={{ color: isCalcPage ? '#00D68F' : '#F0EBE0', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <span className="font-mono text-xs" style={{ color: '#64748B' }}>06</span>
                  Calculator
                </Link>
              </motion.div>

              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                onClick={() => handleAnchor('#contact')}
                className="mt-5 text-center font-body font-semibold py-4 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #00A86B, #00D68F)',
                  color: '#F0EBE0',
                  border: 'none',
                  cursor: 'pointer',
                }}>
                Contact us
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

