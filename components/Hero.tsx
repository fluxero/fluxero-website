import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/* â”€â”€â”€ GLSL shaders â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const VERT = /* glsl */`
  attribute float aSize;
  attribute vec3  aColor;
  attribute float aAlpha;
  varying vec3    vColor;
  varying float   vAlpha;
  void main() {
    vColor     = aColor;
    vAlpha     = aAlpha;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (320.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const FRAG = /* glsl */`
  varying vec3  vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.04, d) * vAlpha;
    gl_FragColor = vec4(vColor, a);
  }
`;

/* â”€â”€â”€ Particle types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
type Phase = 'source' | 'waste' | 'captured' | 'converting' | 'h2';

interface PState {
  phase:     Phase;
  vx:        number;
  vy:        number;
  vz:        number;
  life:      number;
  maxLife:   number;
  phaseLife: number;
  decided:   boolean;
}

/* â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ENERGY_COUNT = 5800;
const STAR_COUNT   = 2200;
const CAPTURE_RATE = 0.28;
const BARRIER_X    = -2;
const NODE_X       =  14;
const NODE_Y       =  0;
const CAM_Z        =  60;

/* â”€â”€â”€ Three.js background â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    /* renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 500);
    camera.position.set(0, 0, CAM_Z);

    /* visible world half-extents at z=0 */
    const halfH = Math.tan(THREE.MathUtils.degToRad(30)) * CAM_Z; // â‰ˆ34.6
    const halfW = halfH * (W / H);                                 // â‰ˆ61 @16:9

    /* â”€ star field â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    {
      const p = new Float32Array(STAR_COUNT * 3);
      const c = new Float32Array(STAR_COUNT * 3);
      const s = new Float32Array(STAR_COUNT);
      const a = new Float32Array(STAR_COUNT);
      for (let i = 0; i < STAR_COUNT; i++) {
        p[i*3]   = (Math.random() - 0.5) * halfW * 2.5;
        p[i*3+1] = (Math.random() - 0.5) * halfH * 2.5;
        p[i*3+2] = -12 - Math.random() * 30;
        const v = 0.35 + Math.random() * 0.65;
        const isBlue = Math.random() > 0.6;
        c[i*3]   = v * (isBlue ? 0.60 : 1.0);
        c[i*3+1] = v * (isBlue ? 0.78 : 1.0);
        c[i*3+2] = v;
        s[i] = 0.35 + Math.random() * 0.75;
        a[i] = 0.06 + Math.random() * 0.20;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
      geo.setAttribute('aColor',   new THREE.BufferAttribute(c, 3));
      geo.setAttribute('aSize',    new THREE.BufferAttribute(s, 1));
      geo.setAttribute('aAlpha',   new THREE.BufferAttribute(a, 1));
      scene.add(new THREE.Points(geo, new THREE.ShaderMaterial({
        vertexShader: VERT, fragmentShader: FRAG,
        transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending,
      })));
    }

    /* â”€ energy particles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const pos   = new Float32Array(ENERGY_COUNT * 3);
    const col   = new Float32Array(ENERGY_COUNT * 3);
    const siz   = new Float32Array(ENERGY_COUNT);
    const alp   = new Float32Array(ENERGY_COUNT);
    const state: PState[] = [];

    const spawnParticle = (i: number, scatter = false) => {
      const i3 = i * 3;
      const sx  = -halfW * 0.90 + Math.random() * halfW * 0.50;
      const sy  = (Math.random() - 0.5) * halfH * 1.75;
      const sz  = (Math.random() - 0.5) * 7;
      pos[i3]   = scatter ? (-halfW * 0.90 + Math.random() * halfW * 1.65) : sx;
      pos[i3+1] = sy;
      pos[i3+2] = sz;
      col[i3]   = 0.98; col[i3+1] = 0.62; col[i3+2] = 0.07; // amber
      siz[i]    = 1.0 + Math.random() * 1.3;
      alp[i]    = scatter ? Math.random() * 0.55 : 0;
      state[i] = {
        phase:     'source',
        vx:         0.07 + Math.random() * 0.11,
        vy:        (Math.random() - 0.5) * 0.04,
        vz:        (Math.random() - 0.5) * 0.012,
        life:       scatter ? Math.floor(Math.random() * 200) : 0,
        maxLife:    260 + Math.random() * 130,
        phaseLife:  0,
        decided:    false,
      };
    };

    for (let i = 0; i < ENERGY_COUNT; i++) spawnParticle(i, true);

    const energyGeo = new THREE.BufferGeometry();
    energyGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    energyGeo.setAttribute('aColor',   new THREE.BufferAttribute(col, 3));
    energyGeo.setAttribute('aSize',    new THREE.BufferAttribute(siz, 1));
    energyGeo.setAttribute('aAlpha',   new THREE.BufferAttribute(alp, 1));

    scene.add(new THREE.Points(energyGeo, new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
    })));

    const posAttr = energyGeo.attributes.position as THREE.BufferAttribute;
    const colAttr = energyGeo.attributes.aColor   as THREE.BufferAttribute;
    const alpAttr = energyGeo.attributes.aAlpha   as THREE.BufferAttribute;
    const sizAttr = energyGeo.attributes.aSize    as THREE.BufferAttribute;

    /* â”€ SMHP wireframe node â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const nodeGroup = new THREE.Group();
    nodeGroup.position.set(NODE_X, NODE_Y, -5);
    scene.add(nodeGroup);

    // Inner icosahedron
    nodeGroup.add(new THREE.Mesh(
      new THREE.IcosahedronGeometry(5.5, 1),
      new THREE.MeshBasicMaterial({ color: 0x3B82F6, wireframe: true, opacity: 0.16, transparent: true }),
    ));

    // Orbital rings
    nodeGroup.add(new THREE.Mesh(
      new THREE.TorusGeometry(8.2, 0.06, 4, 80),
      new THREE.MeshBasicMaterial({ color: 0x60A5FA, opacity: 0.13, transparent: true }),
    ));
    nodeGroup.add(new THREE.Mesh(
      new THREE.TorusGeometry(10.8, 0.04, 4, 80),
      new THREE.MeshBasicMaterial({ color: 0x38BDF8, opacity: 0.08, transparent: true }),
    ));

    // Glow sphere
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x1D4ED8, transparent: true, opacity: 0.03 });
    nodeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(8, 16, 16), glowMat));

    /* â”€ mouse parallax â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const mouse    = { x: 0, y: 0 };
    const camSmooth = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x =  (e.clientX / window.innerWidth  - 0.5);
      mouse.y = -(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    /* â”€ resize â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const onResize = () => {
      const nW = mount.clientWidth, nH = mount.clientHeight;
      renderer.setSize(nW, nH);
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    /* â”€ colour lerp helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const lerpCol = (i3: number, tr: number, tg: number, tb: number, t: number) => {
      col[i3]   += (tr - col[i3])   * t;
      col[i3+1] += (tg - col[i3+1]) * t;
      col[i3+2] += (tb - col[i3+2]) * t;
    };

    /* â”€ particle tick â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    const tickParticles = () => {
      for (let i = 0; i < ENERGY_COUNT; i++) {
        const s  = state[i];
        const i3 = i * 3;
        s.life++;
        s.phaseLife++;

        let x = pos[i3], y = pos[i3+1], z = pos[i3+2];

        if (s.phase === 'source') {
          s.vx += 0.0014;
          s.vy += Math.sin(s.life * 0.08 + x * 0.09) * 0.004;
          s.vx  = Math.min(s.vx, 0.22);
          s.vx *= 0.988; s.vy *= 0.97;
          alp[i] = Math.min(alp[i] + 0.022, 0.62);

          if (x >= BARRIER_X && !s.decided) {
            s.decided = true;
            if (Math.random() < CAPTURE_RATE) {
              s.phase = 'captured'; s.phaseLife = 0;
              const dx = NODE_X - x, dy = NODE_Y - y;
              const d  = Math.sqrt(dx*dx + dy*dy) || 1;
              s.vx = (dx / d) * 0.15; s.vy = (dy / d) * 0.15;
            } else {
              s.phase = 'waste'; s.phaseLife = 0;
              s.vx = 0.015 + Math.random() * 0.03;
              s.vy = -(0.11 + Math.random() * 0.09);
            }
          }
        }

        else if (s.phase === 'waste') {
          s.vy -= 0.007; s.vx *= 0.968; s.vy *= 0.982;
          alp[i] = Math.max(alp[i] - 0.007, 0);
          lerpCol(i3, 0.94, 0.20, 0.10, 0.055);
          if (y < -halfH * 1.5 || alp[i] <= 0) spawnParticle(i);
        }

        else if (s.phase === 'captured') {
          const dx = NODE_X - x, dy = NODE_Y - y;
          const d  = Math.sqrt(dx*dx + dy*dy) || 1;
          s.vx += (dx / d) * 0.014; s.vy += (dy / d) * 0.014;
          s.vx *= 0.972; s.vy *= 0.972;
          alp[i] = Math.min(alp[i] + 0.018, 0.85);
          lerpCol(i3, 0.23, 0.51, 0.97, 0.065);
          if (d < 4.5) {
            s.phase = 'converting'; s.phaseLife = 0;
            s.vx = 0.05 + Math.random() * 0.03;
            s.vy = (Math.random() - 0.5) * 0.04;
          }
        }

        else if (s.phase === 'converting') {
          const dx = x - NODE_X, dy = y - NODE_Y;
          const d  = Math.sqrt(dx*dx + dy*dy) || 1;
          const angle = Math.atan2(dy, dx) + 0.065;
          const nr = Math.max(d - 0.10, 2.5);
          s.vx = (Math.cos(angle) * nr + NODE_X - x) * 0.16;
          s.vy = (Math.sin(angle) * nr + NODE_Y - y) * 0.16;
          alp[i] = Math.min(alp[i] + 0.016, 0.94);
          siz[i] = Math.min(siz[i] + 0.016, 2.7);
          lerpCol(i3, 0.20, 0.76, 0.98, 0.078); // → cyan
          if (s.phaseLife > 55 + Math.random() * 30) {
            s.phase = 'h2'; s.phaseLife = 0;
            s.vx = 0.19 + Math.random() * 0.09;
            s.vy = (Math.random() - 0.5) * 0.04;
          }
        }

        else if (s.phase === 'h2') {
          s.vx  = Math.max(s.vx - 0.0008, 0.16);
          s.vy += Math.sin(s.life * 0.11) * 0.002; s.vy *= 0.978;
          if (x > halfW * 0.52) alp[i] = Math.max(alp[i] - 0.009, 0);
          if (x > halfW * 1.08 || alp[i] <= 0) spawnParticle(i);
        }

        x += s.vx; y += s.vy; z += s.vz;
        pos[i3] = x; pos[i3+1] = y; pos[i3+2] = z;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      alpAttr.needsUpdate = true;
      sizAttr.needsUpdate = true;
    };

    /* â”€ render loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
    let raf = 0, frame = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      frame++;

      /* camera parallax */
      camSmooth.x += (mouse.x * 5   - camSmooth.x) * 0.045;
      camSmooth.y += (mouse.y * 3   - camSmooth.y) * 0.045;
      camera.position.x = camSmooth.x;
      camera.position.y = camSmooth.y;
      camera.lookAt(5, 0, 0);

      /* node rotation */
      nodeGroup.rotation.y += 0.004;
      nodeGroup.rotation.x += 0.002;
      (nodeGroup.children[1] as THREE.Mesh).rotation.z += 0.0032;
      (nodeGroup.children[2] as THREE.Mesh).rotation.x += 0.0022;
      glowMat.opacity = Math.sin(frame * 0.022) * 0.013 + 0.028;

      tickParticles();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
};

/* â”€â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">

      {/* WebGL canvas layer */}
      <div className="absolute inset-0" style={{ background: '#080E1C' }}>
        <ThreeBackground />
      </div>

      {/* Depth vignette â€” keeps left text area readable */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 58% 68% at 26% 50%, transparent 22%, rgba(8,14,28,0.88) 82%)' }} />
      <div className="absolute bottom-0 inset-x-0 h-52 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #080E1C, transparent)' }} />
      <div className="absolute top-0 inset-x-0 h-36 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #080E1C, transparent)' }} />

      {/* Text content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-16" style={{ maxWidth: '55%' }}>


        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="font-display font-black leading-none mb-8"
          style={{ fontSize: 'clamp(36px, 9vw, 120px)', letterSpacing: '-0.01em', lineHeight: 0.92, color: '#F1F5F9' }}
        >
          ENERGY<br />
          <span style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            GETS WASTED.
          </span>
          <br />
          WE CAPTURE IT.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="font-body text-lg md:text-xl font-light leading-relaxed mb-12"
          style={{ color: '#94A3B8', maxWidth: '480px' }}
        >
          Fluxero builds Small Modular Hydrogen Plants that convert curtailed wind,
          solar, and hydro into green hydrogen â€” at the source, before the grid
          can reject it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <button
            onClick={() => navigate('/calculator')}
            className="font-body font-semibold px-8 py-4 rounded text-base tracking-wide transition-all"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              color: '#F1F5F9',
              boxShadow: '0 0 30px rgba(59,130,246,0.28)',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 54px rgba(59,130,246,0.50)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(59,130,246,0.28)';
            }}
          >
            Calculate your site's H₂ potential →
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-wrap gap-6 mt-16 text-sm"
        >
          {[
            { v: '8.3 TWh',  l: 'UK wind curtailed 2024' },
            { v: '1.5 TWh',  l: 'solar curtailed 2024' },
            { v: '£393M',    l: 'paid to waste it' },
            { v: '£8–12/kg', l: 'green H₂ price' },
          ].map(s => (
            <div key={s.v} className="flex items-baseline gap-2">
              <span className="font-mono font-bold text-base" style={{ color: '#3B82F6' }}>{s.v}</span>
              <span className="font-body text-xs" style={{ color: '#475569' }}>{s.l}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Desktop legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-12 right-8 hidden lg:flex flex-col gap-2"
        style={{ zIndex: 20 }}
      >
        {[
          { color: 'rgba(251,160,20,0.75)',  label: 'Curtailed energy (source)' },
          { color: 'rgba(239,68,68,0.65)',   label: 'Grid-rejected (wasted)'    },
          { color: 'rgba(59,130,246,0.85)',  label: 'SMHP captured'             },
          { color: 'rgba(56,189,248,0.75)',  label: 'Green hydrogen output'     },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
            <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: '#475569' }}>{l.label}</span>
          </div>
        ))}
      </motion.div>

    </section>
  );
};

