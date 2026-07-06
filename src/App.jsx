import { useState, useEffect, useRef } from 'react';

const LOGO_PATH = `${import.meta.env.BASE_URL || '/'}logo.png`;
const INSTAGRAM_URL = 'https://www.instagram.com/haribalann?utm_source=qr';

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: #0f0f14;
    color: #f0ece6;
    font-family: 'DM Sans', sans-serif;
    cursor: none;
    overflow-x: hidden;
  }
  /* Restore native cursor on touch / mobile devices */
  @media (pointer: coarse) {
    body, a, button, input, textarea, * { cursor: auto !important; }
  }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0f0f14; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#dc2626, #fde047); }
  * { scrollbar-width: thin; scrollbar-color: #dc2626 #0f0f14; }

  /* Section container */
  .section-inner {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulseGlow {
    0%   { box-shadow: 0 0 30px rgba(220,38,38,0.3); }
    50%  { box-shadow: 0 0 70px rgba(220,38,38,0.6), 0 0 120px rgba(253,224,71,0.2); }
    100% { box-shadow: 0 0 30px rgba(220,38,38,0.3); }
  }
  @keyframes loadOut {
    from { opacity: 1; transform: scale(1); }
    to   { opacity: 0; transform: scale(1.04); }
  }
  @keyframes logoIn {
    from { letter-spacing: 0.8em; opacity: 0; }
    to   { letter-spacing: 0.12em; opacity: 1; }
  }
  @keyframes heroZoom {
    from { transform: scale(1); }
    to   { transform: scale(1.06); }
  }
  @keyframes floatUpDown {
    0%   { transform: translateY(0) rotate(0deg); }
    50%  { transform: translateY(-12px) rotate(1deg); }
    100% { transform: translateY(0) rotate(0deg); }
  }
  @keyframes borderPulse {
    0%   { border-color: rgba(220,38,38,0.3); }
    50%  { border-color: rgba(253,224,71,0.8); }
    100% { border-color: rgba(220,38,38,0.3); }
  }
  @keyframes barFill {
    from { width: 0; }
    to   { width: 100px; }
  }
  @keyframes logoPulse {
    0%   { filter: drop-shadow(0 0 16px rgba(220,38,38,0.5)) drop-shadow(0 0 32px rgba(253,224,71,0.15)); transform: scale(1); }
    50%  { filter: drop-shadow(0 0 40px rgba(220,38,38,0.9)) drop-shadow(0 0 80px rgba(253,224,71,0.35)); transform: scale(1.04); }
    100% { filter: drop-shadow(0 0 16px rgba(220,38,38,0.5)) drop-shadow(0 0 32px rgba(253,224,71,0.15)); transform: scale(1); }
  }
  @keyframes gridMove {
    from { background-position: 0 0; }
    to   { background-position: 60px 60px; }
  }
  @keyframes orbFloat1 {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(40px,-60px) scale(1.1); }
    66%  { transform: translate(-30px,40px) scale(0.95); }
    100% { transform: translate(0,0) scale(1); }
  }
  @keyframes orbFloat2 {
    0%   { transform: translate(0,0) scale(1); }
    33%  { transform: translate(-50px,30px) scale(1.08); }
    66%  { transform: translate(20px,-50px) scale(0.9); }
    100% { transform: translate(0,0) scale(1); }
  }
  @keyframes orbFloat3 {
    0%   { transform: translate(0,0); }
    50%  { transform: translate(30px,-40px); }
    100% { transform: translate(0,0); }
  }
  @keyframes instaGlow {
    0%   { box-shadow: 0 0 0 0 rgba(225, 48, 108, 0.5); }
    70%  { box-shadow: 0 0 0 14px rgba(225, 48, 108, 0); }
    100% { box-shadow: 0 0 0 0 rgba(225, 48, 108, 0); }
  }

  /* Reveal classes */
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-left {
    opacity: 0;
    transform: translateX(-60px);
    transition: opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal-left.visible { opacity: 1; transform: translateX(0); }
  .reveal-right {
    opacity: 0;
    transform: translateX(60px);
    transition: opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal-right.visible { opacity: 1; transform: translateX(0); }
  .reveal-scale {
    opacity: 0;
    transform: scale(0.88);
    transition: opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal-scale.visible { opacity: 1; transform: scale(1); }

  /* Button classes */
  .btn-primary {
    display: inline-block;
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: #fff;
    padding: 16px 40px;
    font-family: 'Oswald', sans-serif;
    font-size: 15px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border: none;
    border-radius: 0;
    cursor: none;
    text-decoration: none;
    transition: background 0.3s, box-shadow 0.3s, transform 0.2s;
    white-space: nowrap;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .btn-primary::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
    transition: left 0.4s ease;
  }
  .btn-primary:hover::after { left: 100%; }
  .btn-primary:hover {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    box-shadow: 0 8px 40px rgba(220,38,38,0.6), 0 0 20px rgba(220,38,38,0.3);
    transform: translateY(-3px);
  }
  .btn-primary:active { transform: scale(0.97); }

  .btn-ghost {
    display: inline-block;
    background: transparent;
    color: #f0ece6;
    padding: 16px 40px;
    font-family: 'Oswald', sans-serif;
    font-size: 15px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border: 1px solid rgba(240,236,230,0.3);
    border-radius: 0;
    cursor: none;
    text-decoration: none;
    transition: border-color 0.3s, color 0.3s, transform 0.2s, box-shadow 0.3s;
    white-space: nowrap;
    text-align: center;
  }
  .btn-ghost:hover {
    border-color: #dc2626;
    color: #dc2626;
    transform: translateY(-3px);
    box-shadow: 0 4px 20px rgba(220,38,38,0.2);
  }
  .btn-ghost:active { transform: scale(0.97); }

  .btn-silver {
    display: inline-block;
    background: linear-gradient(135deg, #777 0%, #ccc 50%, #777 100%);
    background-size: 200% auto;
    color: #07070a;
    padding: 16px 40px;
    font-family: 'Oswald', sans-serif;
    font-size: 15px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border: none;
    border-radius: 0;
    cursor: none;
    text-decoration: none;
    transition: background-position 0.4s, transform 0.2s, box-shadow 0.3s;
    white-space: nowrap;
    text-align: center;
  }
  .btn-silver:hover {
    background-position: right center;
    transform: translateY(-3px);
    box-shadow: 0 6px 24px rgba(200,200,200,0.3);
  }
  .btn-silver:active { transform: scale(0.97); }

  .nav-link {
    color: #aaa;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    text-decoration: none;
    position: relative;
    padding-bottom: 4px;
    transition: color 0.3s;
    cursor: none;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0; left: 50%;
    height: 1px;
    background: linear-gradient(90deg, #dc2626, #fde047);
    width: 0;
    transition: width 0.35s ease, left 0.35s ease;
  }
  .nav-link:hover { color: #fff; }
  .nav-link:hover::after { width: 100%; left: 0; }

  /* Card hover lift */
  .card-hover {
    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 30px rgba(220,38,38,0.12);
  }

  /* Mobile */
  @media (max-width: 768px) {
    .nav-center-links { display: none !important; }
    .hamburger-btn { display: flex !important; }
    .nav-cta { display: none !important; }
    .hero-headline { font-size: clamp(44px, 11vw, 76px) !important; }
    .contact-cols { flex-direction: column !important; gap: 40px !important; }
    .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
    .membership-cols { flex-direction: column !important; gap: 40px !important; }
    .hours-address-cols { flex-direction: column !important; gap: 40px !important; }
    .footer-bottom { flex-direction: column !important; text-align: center !important; }
    .equip-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }

  /* Equipment animations */
  @keyframes equipFloat {
    0%   { transform: translateY(0) rotate(0deg); }
    25%  { transform: translateY(-10px) rotate(2deg); }
    75%  { transform: translateY(6px) rotate(-1deg); }
    100% { transform: translateY(0) rotate(0deg); }
  }
  @keyframes equipSpin {
    0%   { transform: rotate(0deg) scale(1); }
    50%  { transform: rotate(180deg) scale(1.08); }
    100% { transform: rotate(360deg) scale(1); }
  }
  @keyframes equipPump {
    0%,100% { transform: scaleY(1) scaleX(1); }
    30%      { transform: scaleY(1.12) scaleX(0.94); }
    60%      { transform: scaleY(0.92) scaleX(1.06); }
  }
  @keyframes equipSwing {
    0%   { transform: rotate(-12deg); }
    50%  { transform: rotate(12deg); }
    100% { transform: rotate(-12deg); }
  }
  @keyframes equipPulse {
    0%,100% { filter: drop-shadow(0 0 6px rgba(220,38,38,0.4)); transform: scale(1); }
    50%     { filter: drop-shadow(0 0 24px rgba(220,38,38,0.9)); transform: scale(1.06); }
  }
  @keyframes equipBounce {
    0%,100% { transform: translateY(0); }
    40%     { transform: translateY(-14px); }
    60%     { transform: translateY(-8px); }
  }
  .equip-card {
    display: flex; flex-direction: column; align-items: center;
    gap: 16px; padding: 32px 20px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(220,38,38,0.15);
    border-radius: 2px;
    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s, border-color 0.35s;
    cursor: none;
  }
  .equip-card:hover {
    transform: translateY(-8px);
    border-color: rgba(220,38,38,0.5);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(220,38,38,0.15);
  }
  .equip-card:hover .equip-icon { animation-play-state: running; filter: drop-shadow(0 0 20px rgba(220,38,38,0.8)); }
  .equip-icon { animation-play-state: paused; transition: filter 0.3s; }

  /* Inputs */
  input, textarea {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #f0ece6;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    padding: 16px 20px;
    outline: none;
    width: 100%;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    cursor: none;
  }
  input:focus, textarea:focus {
    border-color: #dc2626;
    background: rgba(220, 38, 38, 0.04);
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.25);
  }
  input::placeholder, textarea::placeholder {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #666;
    letter-spacing: 0.04em;
  }
  textarea { resize: none; height: 110px; }
  a { cursor: none; }

  /* Instagram button */
  .btn-insta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
    color: #fff;
    padding: 14px 28px;
    font-family: 'Oswald', sans-serif;
    font-size: 14px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border: none;
    border-radius: 50px;
    cursor: none;
    text-decoration: none;
    transition: transform 0.3s, box-shadow 0.3s;
    white-space: nowrap;
    animation: instaGlow 2.5s ease infinite;
  }
  .btn-insta:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 12px 40px rgba(225,48,108,0.5);
  }

  .footer-nav-link {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    color: #444;
    text-decoration: none;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    transition: color 0.3s;
    cursor: none;
  }
  .footer-nav-link:hover { color: #dc2626; }
`;

/* ─────────────────────────────────────────
   CUSTOM HOOK: useReveal
───────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ─────────────────────────────────────────
   COMPONENT — INTERACTIVE PARTICLE CANVAS
───────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    const onMouseMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMouseMove);

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() < 0.65 ? '220,38,38' : '253,224,71',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((q) => {
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(220,38,38,${0.07 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        });
      });

      particles.forEach((p) => {
        const mdx = p.x - mouse.current.x;
        const mdy = p.y - mouse.current.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 110) {
          p.vx += (mdx / mdist) * 0.1;
          p.vy += (mdy / mdist) * 0.1;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0, opacity: 0.65,
    }} />
  );
}

/* ─────────────────────────────────────────
   COMPONENT 1 — CUSTOM CURSOR (Red Arrow)
───────────────────────────────────────── */
function Cursor() {
  const arrowRef = useRef(null);
  const glowRef = useRef(null);
  const pos = useRef({ x: -200, y: -200 });
  const isHovering = useRef(false);

  // Detect touch / mobile — skip custom cursor entirely on those devices
  const isTouchDevice =
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0);

  useEffect(() => {
    if (isTouchDevice) return; // no listeners needed on mobile
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (arrowRef.current) {
        arrowRef.current.style.left = e.clientX + 'px';
        arrowRef.current.style.top = e.clientY + 'px';
      }
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + 'px';
        glowRef.current.style.top = e.clientY + 'px';
      }
      const t = e.target;
      const hov = t.tagName === 'A' || t.tagName === 'BUTTON' ||
        t.classList.contains('btn-primary') || t.classList.contains('btn-ghost') ||
        t.classList.contains('btn-silver') || t.classList.contains('btn-insta') ||
        t.closest('a') || t.closest('button');
      isHovering.current = !!hov;
      if (arrowRef.current) {
        arrowRef.current.style.transform = hov ? 'scale(1.3)' : 'scale(1)';
      }
      if (glowRef.current) {
        glowRef.current.style.width = hov ? '80px' : '48px';
        glowRef.current.style.height = hov ? '80px' : '48px';
        glowRef.current.style.opacity = hov ? '0.6' : '0.35';
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [isTouchDevice]);

  // On touch/mobile — render nothing, native cursor remains
  if (isTouchDevice) return null;

  return (
    <>
      {/* Radial glow under cursor */}
      <div ref={glowRef} style={{
        position: 'fixed',
        width: 48, height: 48,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220,38,38,0.55) 0%, rgba(220,38,38,0.15) 50%, transparent 70%)',
        pointerEvents: 'none', zIndex: 9997,
        transform: 'translate(-50%, -50%)',
        left: '-200px', top: '-200px',
        transition: 'width 0.25s ease, height 0.25s ease, opacity 0.25s ease',
        opacity: 0.35,
        filter: 'blur(4px)',
      }} />
      {/* Arrow */}
      <div ref={arrowRef} style={{
        position: 'fixed',
        pointerEvents: 'none', zIndex: 9999,
        left: '-200px', top: '-200px',
        transition: 'transform 0.18s ease',
        transformOrigin: '0 0',
      }}>
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2L20 11L11 13L8 23L2 2Z" fill="#dc2626" stroke="#ff6b6b" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M11 13L8 23" stroke="#ff4444" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   INSTAGRAM SVG ICON
───────────────────────────────────────── */
const InstaIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

/* ─────────────────────────────────────────
   COMPONENT 2 — LOADING SCREEN
───────────────────────────────────────── */
function LoadingScreen({ loaded }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'radial-gradient(ellipse at center, #1a0010 0%, #0f0f14 70%)',
      zIndex: 9997, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
      animation: loaded ? 'loadOut 0.7s ease forwards' : 'none',
      pointerEvents: loaded ? 'none' : 'all',
    }}>
      <img
        src={LOGO_PATH} alt="MaxRep Logo"
        style={{
          width: 200, height: 'auto', marginBottom: 16,
          animation: 'logoPulse 2s ease-in-out infinite',
          filter: 'drop-shadow(0 0 30px rgba(220,38,38,0.7))',
        }}
      />
      <div style={{
        fontFamily: 'Oswald, sans-serif', fontSize: 52, fontWeight: 700,
        letterSpacing: '0.12em',
        animation: 'logoIn 1s ease forwards',
        background: 'linear-gradient(135deg, #fff 30%, #dc2626 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>MAXREP</div>
      <div style={{
        fontFamily: 'Bebas Neue, cursive', fontSize: 13,
        color: '#dc2626', letterSpacing: '0.38em',
      }}>FITNESS CENTRE</div>
      <div style={{
        width: 120, height: 2, background: '#1a1a24', marginTop: 12,
        overflow: 'hidden', borderRadius: 2,
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #dc2626, #fde047)',
          animation: 'barFill 1.6s ease forwards',
          width: 0,
        }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPONENT 3 — NAVBAR
───────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoHover, setLogoHover] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 70,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5vw', zIndex: 100,
        background: scrolled ? 'rgba(15,15,20,0.98)' : 'rgba(15,15,20,0.7)',
        borderBottom: scrolled ? '1px solid rgba(220,38,38,0.25)' : '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.5s ease',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
      }}>
        {/* Logo + Wordmark */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'none' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
        >
          <img
            src={LOGO_PATH} alt="MaxRep Logo"
            style={{
              height: 46, width: 'auto',
              transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1), filter 0.4s',
              transform: logoHover ? 'scale(1.12) rotate(-3deg)' : 'scale(1) rotate(0deg)',
              filter: logoHover
                ? 'drop-shadow(0 0 16px rgba(220,38,38,0.9))'
                : 'drop-shadow(0 0 6px rgba(220,38,38,0.4))',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
              <span style={{ color: 'white' }}>MAX</span>
              <span style={{ color: '#dc2626' }}>REP</span>
            </span>
            <span style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 9, color: '#888', letterSpacing: '0.3em', marginTop: 2 }}>
              FITNESS CENTRE
            </span>
          </div>
        </div>

        {/* Center links */}
        <div className="nav-center-links" style={{ display: 'flex', gap: 36 }}>
          {['offer', 'hours', 'address', 'contact'].map(id => (
            <a key={id} href={`#${id}`} className="nav-link"
              onClick={(e) => { e.preventDefault(); scrollTo(id); }}>
              {id}
            </a>
          ))}
        </div>

        {/* Right: Instagram + CTA */}
        <div className="nav-cta" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
            title="Follow on Instagram"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(225,48,108,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <InstaIcon size={18} />
          </a>
          <a href="tel:8608499128" className="btn-primary" style={{ padding: '10px 22px', fontSize: 12 }}>
            📞 Call Now
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(true)}
          style={{ display: 'none', background: 'none', border: 'none', flexDirection: 'column', gap: 5, cursor: 'none', padding: 4 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: 'block', width: 24, height: 2, background: '#f0ece6' }} />
          ))}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'radial-gradient(ellipse at center, #1a0010 0%, #0f0f14 80%)',
          zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 24,
          animation: 'fadeIn 0.3s ease',
        }}>
          <button onClick={() => setMenuOpen(false)} style={{
            position: 'absolute', top: 24, right: '5vw',
            background: 'none', border: 'none', color: '#f0ece6', fontSize: 32, cursor: 'none',
          }}>✕</button>
          {['offer', 'hours', 'address', 'contact'].map(id => (
            <a key={id} href={`#${id}`}
              onClick={(e) => { e.preventDefault(); scrollTo(id); }}
              style={{
                fontFamily: 'Oswald, sans-serif', fontSize: 32, color: '#888',
                textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#dc2626'}
              onMouseLeave={e => e.target.style.color = '#888'}>
              {id}
            </a>
          ))}
          <a href="tel:8608499128" className="btn-primary" style={{ padding: '12px 28px', fontSize: 14, marginTop: 16 }}>
            📞 Call: 8608499128
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-insta">
            <InstaIcon size={18} /> Instagram Page
          </a>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────
   COMPONENT 4 — HERO
───────────────────────────────────────── */
function Hero() {
  const bgRef = useRef(null);
  const [logoHovered, setLogoHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) bgRef.current.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const orbs = [
    { w: 600, h: 600, top: '5%', left: '8%', dur: '18s', color: 'rgba(220,38,38,0.11)', anim: 'orbFloat1' },
    { w: 500, h: 500, top: '45%', left: '55%', dur: '22s', color: 'rgba(253,224,71,0.07)', anim: 'orbFloat2' },
    { w: 350, h: 350, top: '65%', left: '3%', dur: '14s', color: 'rgba(139,92,246,0.06)', anim: 'orbFloat3' },
  ];

  return (
    <section style={{
      minHeight: 'calc(100vh - 70px)',
      marginTop: 70,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 5vw',
      textAlign: 'center',
    }}>
      {/* Parallax background */}
      <div ref={bgRef} style={{ position: 'absolute', inset: '-12%', background: 'radial-gradient(ellipse at 50% 40%, #260808 0%, #0f0f14 65%)' }}>
        {/* Moving grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(220,38,38,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          animation: 'gridMove 8s linear infinite',
        }} />
        {/* Scanlines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)',
        }} />
        {orbs.map((o, i) => (
          <div key={i} style={{
            position: 'absolute', width: o.w, height: o.h,
            borderRadius: '50%', top: o.top, left: o.left,
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            animation: `${o.anim} ${o.dur} ease-in-out infinite`,
            animationDelay: `${i * 2}s`,
          }} />
        ))}
      </div>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 25%, rgba(15,15,20,0.82) 85%)',
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 800,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 24,
      }}>
        {/* BIG Logo */}
        <div
          style={{ marginBottom: 8, cursor: 'none', perspective: '800px' }}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
        >
          <img
            src={LOGO_PATH} alt="MaxRep Logo"
            style={{
              width: logoHovered ? 220 : 200, height: 'auto',
              transition: 'width 0.5s cubic-bezier(0.22,1,0.36,1), filter 0.5s, transform 0.5s',
              animation: logoHovered ? 'none' : 'floatUpDown 5s ease-in-out infinite',
              filter: logoHovered
                ? 'drop-shadow(0 0 60px rgba(220,38,38,1)) drop-shadow(0 0 120px rgba(253,224,71,0.4))'
                : 'drop-shadow(0 0 24px rgba(220,38,38,0.6)) drop-shadow(0 0 50px rgba(220,38,38,0.2))',
              transform: logoHovered ? 'scale(1.08) rotateY(8deg)' : 'scale(1)',
            }}
          />
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, animation: 'fadeUp 0.9s ease both' }}>
          <h1 className="hero-headline" style={{
            fontFamily: 'Oswald, sans-serif',
            fontSize: 'clamp(56px, 9vw, 100px)',
            fontWeight: 700,
            textTransform: 'uppercase',
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0ece6 50%, #dc2626 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            JOIN <span style={{
              background: 'linear-gradient(135deg, #dc2626, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>NOW!</span>
          </h1>
          <div style={{
            fontFamily: 'Bebas Neue, cursive', fontSize: 18,
            color: '#fde047', letterSpacing: '0.35em', marginTop: 8,
            textShadow: '0 0 20px rgba(253,224,71,0.5)',
          }}>
            MEMBERSHIP OFFER
          </div>
        </div>

        {/* Price */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          animation: 'fadeUp 0.9s ease 0.2s both',
          width: '100%', maxWidth: 500,
        }}>
          <div className="card-hover" style={{
            background: 'linear-gradient(135deg, #0e1118 0%, #1a1f30 50%, #0e1118 100%)',
            border: '2px solid #fde047',
            padding: '18px 28px', width: '100%', textAlign: 'center', marginBottom: 2,
            boxShadow: '0 0 30px rgba(253,224,71,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}>
            <span style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 'clamp(24px, 3.5vw, 40px)',
              fontWeight: 700, color: '#fff', letterSpacing: '0.04em',
            }}>
              MONTHLY <span style={{ color: '#dc2626' }}>&#8377;400</span> ONLY
            </span>
          </div>
          <div style={{
            background: 'rgba(7,7,10,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '12px 28px', width: '100%', textAlign: 'center',
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{
              fontFamily: 'Oswald, sans-serif',
              fontSize: 'clamp(13px, 2vw, 18px)', color: '#aaa', letterSpacing: '0.05em',
            }}>
              FIRST MONTH ADVANCE &nbsp;
              <span style={{ color: '#666', fontStyle: 'italic', fontFamily: 'DM Sans' }}>(Joining Fees: 800)</span>
            </span>
          </div>
        </div>

        {/* Hours */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 14, fontFamily: 'Oswald, sans-serif',
          color: '#888', letterSpacing: '0.1em',
          animation: 'fadeUp 0.9s ease 0.4s both', marginTop: 4,
        }}>
          <span>&#128336;</span>
          <span>OPERATING HOURS:</span>
          <span style={{ color: '#fde047', fontWeight: 600, textShadow: '0 0 12px rgba(253,224,71,0.4)' }}>
            OPEN 24 HOURS &middot; EVERY DAY
          </span>
        </div>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap',
          justifyContent: 'center', marginTop: 8,
          animation: 'fadeUp 0.9s ease 0.6s both',
        }}>
          <a href="tel:8608499128" className="btn-primary">&#128222; Call: 8608499128</a>
          <a href="https://wa.me/918608499128" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            WhatsApp Us
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-insta">
            <InstaIcon size={16} /> Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   COMPONENT 5 — MEMBERSHIP
───────────────────────────────────────── */
function Membership() {
  const ref = useReveal();

  return (
    <section id="offer" ref={ref} style={{
      padding: '120px 5vw',
      background: 'linear-gradient(180deg, #0f0f14 0%, #141420 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        top: '-100px', right: '-100px',
        background: 'radial-gradient(circle, rgba(220,38,38,0.09) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="membership-cols section-inner" style={{ display: 'flex', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/* Left */}
        <div className="reveal-left" style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 12, color: '#dc2626', letterSpacing: '0.25em', marginBottom: 16 }}>
            EXCLUSIVE SPECIAL OFFER
          </div>
          <h2 style={{
            fontFamily: 'Oswald, sans-serif', fontSize: 'clamp(42px, 5vw, 64px)', fontWeight: 700,
            textTransform: 'uppercase', lineHeight: 0.95, marginBottom: 24,
            background: 'linear-gradient(135deg, #fff 40%, #aaa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            MEMBERSHIP<br />DETAILS
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: '#777', lineHeight: 1.9, marginBottom: 32 }}>
            Straightforward, transparent membership built around our official poster.
            24-hour access with absolutely no hidden charges.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '&#128170;', text: 'Full 24 Hours Access, 365 Days a Year.' },
              { icon: '&#8377;', text: 'Only &#8377;400 Monthly Membership rate.' },
              { icon: '&#9889;', text: 'First Month Advance acts as Joining Fee (&#8377;800 total).' },
            ].map((item, i) => (
              <div key={i} className="card-hover" style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(220,38,38,0.12)',
                padding: '14px 18px',
                borderLeft: '3px solid #dc2626',
              }}>
                <span style={{ fontSize: 20 }} dangerouslySetInnerHTML={{ __html: item.icon }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#bbb', fontWeight: 500 }}
                  dangerouslySetInnerHTML={{ __html: item.text }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="reveal-right" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div className="card-hover" style={{
            width: '100%', maxWidth: 440,
            background: 'linear-gradient(160deg, #0d0d15, #12141e)',
            border: '1px solid rgba(220,38,38,0.4)',
            animation: 'borderPulse 3.5s ease infinite',
            padding: '52px 44px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: '60%', height: 1,
              background: 'linear-gradient(90deg, transparent, #dc2626, transparent)',
            }} />
            <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 13, color: '#555', letterSpacing: '0.3em', marginBottom: 8 }}>
              MEMBERSHIP RATE
            </div>
            <div style={{
              fontFamily: 'Oswald, sans-serif', fontSize: 90, fontWeight: 700, lineHeight: 1,
              background: 'linear-gradient(135deg, #dc2626 0%, #ff6b6b 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              &#8377;400
            </div>
            <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 28, fontWeight: 600, color: 'white', marginBottom: 28 }}>
              MONTHLY ONLY
            </div>
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.4), transparent)', marginBottom: 28 }} />
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: '#bbb', marginBottom: 6 }}>
              JOINING FEES: &#8377;800
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#444', fontStyle: 'italic', marginBottom: 28 }}>
              (First Month Advance Payment)
            </div>
            <a href="tel:8608499128" className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center' }}>
              JOIN MEMBERSHIP NOW
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   COMPONENT 6 — HOURS & ADDRESS
───────────────────────────────────────── */
function HoursAddress() {
  const ref = useReveal();

  return (
    <section id="hours" ref={ref} style={{
      padding: '120px 5vw',
      background: 'linear-gradient(180deg, #141420 0%, #0f0f14 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', width: 500, height: 500, borderRadius: '50%',
        bottom: '-150px', left: '-100px',
        background: 'radial-gradient(circle, rgba(253,224,71,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="hours-address-cols section-inner" style={{ display: 'flex', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div className="reveal-left" style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 12, color: '#dc2626', letterSpacing: '0.25em', marginBottom: 16 }}>
            GYM ACCESSIBILITY
          </div>
          <h2 style={{
            fontFamily: 'Oswald, sans-serif', fontSize: 'clamp(42px, 5vw, 64px)', fontWeight: 700,
            textTransform: 'uppercase', lineHeight: 0.95, marginBottom: 28,
            background: 'linear-gradient(135deg, #fff 40%, #aaa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            OPERATING<br />HOURS
          </h2>
          <div className="card-hover" style={{
            background: 'linear-gradient(135deg, #0d0d15, #12141e)',
            borderLeft: '4px solid #dc2626',
            padding: '36px 32px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>&#128336;</div>
            <div style={{
              fontFamily: 'Oswald, sans-serif', fontSize: 28, fontWeight: 600,
              color: '#fde047', marginBottom: 10, textShadow: '0 0 20px rgba(253,224,71,0.3)',
            }}>
              OPEN 24 HOURS
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#666', lineHeight: 1.8 }}>
              Every Day &middot; 365 Days a Year.<br />Train on your schedule, day or night.
            </div>
          </div>
        </div>

        <div id="address" className="reveal-right" style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 12, color: '#dc2626', letterSpacing: '0.25em', marginBottom: 16 }}>
            GYM LOCATION
          </div>
          <h2 style={{
            fontFamily: 'Oswald, sans-serif', fontSize: 'clamp(42px, 5vw, 64px)', fontWeight: 700,
            textTransform: 'uppercase', lineHeight: 0.95, marginBottom: 28,
            background: 'linear-gradient(135deg, #fff 40%, #aaa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            GYM<br />ADDRESS
          </h2>
          <div className="card-hover" style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '36px 32px',
          }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>&#128205;</div>
            <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 20, color: 'white', fontWeight: 600, marginBottom: 14 }}>
              MAXREP FITNESS CENTRE
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#666', lineHeight: 1.9, marginBottom: 28 }}>
              Opposite to Indian Oil Petrol Bunk,<br />
              Bharathi Nagar, Green's Second Street,<br />
              Crawford, Trichy &ndash; 620012
            </div>
            <a href="https://maps.google.com/?q=Maxrep+fitness+Bharathi+Nagar+Trichy"
              target="_blank" rel="noopener noreferrer" className="btn-silver" style={{ display: 'inline-block' }}>
              OPEN IN GOOGLE MAPS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   COMPONENT 7 — CONTACT
───────────────────────────────────────── */
function Contact() {
  const ref = useReveal();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" ref={ref} style={{
      padding: '120px 5vw',
      background: 'linear-gradient(180deg, #0f0f14 0%, #12121a 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        top: '20%', right: '5%',
        background: 'radial-gradient(circle, rgba(220,38,38,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="section-inner" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 72, textAlign: 'center' }}>
          <div className="reveal" style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 12, color: '#dc2626', letterSpacing: '0.3em', marginBottom: 14 }}>
            GET IN TOUCH
          </div>
          <h2 className="reveal" style={{
            fontFamily: 'Oswald, sans-serif', fontSize: 'clamp(48px, 6vw, 72px)',
            fontWeight: 700, textTransform: 'uppercase', lineHeight: 0.95,
            background: 'linear-gradient(135deg, #fff 40%, #888 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            CONTACT US
          </h2>
        </div>

        <div className="contact-cols" style={{ display: 'flex', gap: 60 }}>
          <div className="reveal-left" style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 40 }}>
              <div style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(220,38,38,0.15)',
                borderLeft: '3px solid #dc2626', padding: '24px 20px',
              }}>
                <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 11, color: '#dc2626', letterSpacing: '0.22em', marginBottom: 12 }}>
                  CALL OR WHATSAPP
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['8608499128', '7094418255'].map(num => (
                    <a key={num} href={`tel:${num}`} style={{
                      fontFamily: 'Oswald, sans-serif', fontSize: 26, color: 'white',
                      textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 0.3s',
                    }}
                      onMouseEnter={e => e.target.style.color = '#dc2626'}
                      onMouseLeave={e => e.target.style.color = 'white'}>
                      &#128222; {num}
                    </a>
                  ))}
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(220,38,38,0.15)',
                borderLeft: '3px solid #dc2626', padding: '24px 20px',
              }}>
                <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 11, color: '#dc2626', letterSpacing: '0.22em', marginBottom: 12 }}>
                  FOLLOW &amp; MESSAGE
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a href="https://wa.me/918608499128" target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#777',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.3s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#25D366'}
                    onMouseLeave={e => e.currentTarget.style.color = '#777'}>
                    &#128172; WhatsApp Chat &rarr;
                  </a>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#777',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.3s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#e1306c'}
                    onMouseLeave={e => e.currentTarget.style.color = '#777'}>
                    <InstaIcon size={16} /> Follow on Instagram &rarr;
                  </a>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="tel:8608499128" className="btn-primary">CALL 8608499128</a>
              <a href="https://wa.me/918608499128" target="_blank" rel="noopener noreferrer" className="btn-ghost">WHATSAPP NOW</a>
            </div>
          </div>

          <div className="reveal-right" style={{ flex: 1 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <input type="text" placeholder="Your Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input type="email" placeholder="Your Email Address" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
              <textarea placeholder="Your Message" value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })} required />
              <button type="submit" className="btn-primary" style={{ width: 'fit-content' }}>
                {sent ? 'MESSAGE SENT ✓' : 'SEND MESSAGE →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}



/* ─────────────────────────────────────────
   COMPONENT 8 — FOOTER (Redesigned)
───────────────────────────────────────── */
function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #0c0c14 0%, #08080e 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Top accent */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, transparent, #dc2626 30%, #fde047 60%, #dc2626 80%, transparent)',
      }} />

      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        top: '-100px', left: '50%', transform: 'translateX(-50%)',
        background: 'radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ padding: '72px 5vw 56px', position: 'relative', zIndex: 1 }}>
        <div className="section-inner">
          {/* Brand center block */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <img
              src={LOGO_PATH} alt="MaxRep Logo"
              style={{
                width: 80, height: 'auto', marginBottom: 16,
                filter: 'drop-shadow(0 0 16px rgba(220,38,38,0.5))',
                transition: 'filter 0.4s, transform 0.4s', cursor: 'none',
              }}
              onMouseEnter={e => { e.target.style.filter = 'drop-shadow(0 0 30px rgba(220,38,38,0.9))'; e.target.style.transform = 'scale(1.08)'; }}
              onMouseLeave={e => { e.target.style.filter = 'drop-shadow(0 0 16px rgba(220,38,38,0.5))'; e.target.style.transform = 'scale(1)'; }}
            />
            <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: 36, fontWeight: 700 }}>
              <span style={{ color: 'white' }}>MAX</span>
              <span style={{ color: '#dc2626' }}>REP</span>
            </div>
            <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 11, color: '#444', letterSpacing: '0.38em', marginTop: 4 }}>
              FITNESS CENTRE
            </div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#444', lineHeight: 1.8, marginTop: 14, maxWidth: 360, margin: '14px auto 0' }}>
              Open 24 hours &middot; 365 days a year &middot; Bharathi Nagar, Trichy
            </p>
          </div>

          {/* Grid */}
          <div className="footer-grid" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 40, maxWidth: 820, margin: '0 auto',
          }}>
            {/* Address */}
            <div>
              <div style={{
                fontFamily: 'Bebas Neue, cursive', fontSize: 11, color: '#dc2626',
                letterSpacing: '0.28em', marginBottom: 18,
                borderBottom: '1px solid rgba(220,38,38,0.2)', paddingBottom: 10,
              }}>ADDRESS</div>
              {["Opp. Indian Oil Petrol Bunk", "Bharathi Nagar, Green's 2nd St", "Crawford Colony", "Trichy \u2013 620012"].map(line => (
                <div key={line} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#555', lineHeight: 2 }}>{line}</div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div style={{
                fontFamily: 'Bebas Neue, cursive', fontSize: 11, color: '#dc2626',
                letterSpacing: '0.28em', marginBottom: 18,
                borderBottom: '1px solid rgba(220,38,38,0.2)', paddingBottom: 10,
              }}>CONTACT</div>
              {['+91 8608499128', '+91 7094418255', 'WhatsApp Available', 'Open 24/7 \u00B7 365 Days'].map(line => (
                <div key={line} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#555', lineHeight: 2 }}>{line}</div>
              ))}
            </div>

            {/* Social */}
            <div>
              <div style={{
                fontFamily: 'Bebas Neue, cursive', fontSize: 11, color: '#dc2626',
                letterSpacing: '0.28em', marginBottom: 18,
                borderBottom: '1px solid rgba(220,38,38,0.2)', paddingBottom: 10,
              }}>FOLLOW US</div>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                className="btn-insta"
                style={{ display: 'inline-flex', marginBottom: 16, fontSize: 12, padding: '10px 20px' }}>
                <InstaIcon size={16} /> Instagram
              </a>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#444', lineHeight: 1.8 }}>
                Stay updated with our<br />latest offers &amp; events
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: 1, marginTop: 56, marginBottom: 28,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
          }} />

          {/* Bottom bar */}
          <div className="footer-bottom" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 16,
          }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#333' }}>
              &copy; 2025 MaxRep Fitness Centre &middot; Tiruchirappalli, Tamil Nadu
            </span>
            <div style={{ display: 'flex', gap: 24 }}>
              {['offer', 'hours', 'address', 'contact'].map(id => (
                <a key={id} href={`#${id}`} className="footer-nav-link"
                  onClick={e => { e.preventDefault(); scrollTo(id); }}>
                  {id.toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Credits */}
          <div style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: '1px solid rgba(255,255,255,0.04)',
            textAlign: 'center',
          }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#2a2a36' }}>
              Designed &amp; Developed by&nbsp;
            </span>
            <a
              href="https://santo-5406.github.io/SANTO-PORTFOLIO-NEW/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Oswald, sans-serif',
                fontSize: 11,
                color: '#444',
                textDecoration: 'none',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                transition: 'color 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
              onMouseLeave={e => e.currentTarget.style.color = '#444'}
            >
              Santo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   ROOT APP
───────────────────────────────────────── */
export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ParticleCanvas />
      <Cursor />
      {!loaded && <LoadingScreen loaded={false} />}
      {loaded && <LoadingScreen loaded={true} />}
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Membership />
        <HoursAddress />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
