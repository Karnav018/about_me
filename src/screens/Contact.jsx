import { useEffect, useRef } from 'react'
import { MONO } from '../lib/util.js'

const LINKS = [
  { kind: 'Email', label: 'karnav.p.018@gmail.com', href: 'mailto:karnav.p.018@gmail.com' },
  { kind: 'LinkedIn', label: 'in/karnav-prajapati', href: 'https://www.linkedin.com/in/karnav-prajapati-29009632b', ext: true },
  { kind: 'GitHub', label: '@Karnav018', href: 'https://github.com/Karnav018', ext: true },
  { kind: 'Phone', label: '+91 93133 43975', href: 'tel:+919313343975' },
]

export default function Contact({ accent, mouseRef, reduce }) {
  const mainRef = useRef(null)

  useEffect(() => {
    if (reduce) return
    const main = mainRef.current
    if (!main) return
    const cards = Array.from(main.querySelectorAll('[data-fx="cc"]')).map((el) => ({ el, cx: 0, cy: 0, ox: 0, oy: 0, s: 1 }))
    const shine = main.querySelector('[data-fx="shine"]')

    const measure = () => {
      cards.forEach((c) => {
        const r = c.el.getBoundingClientRect()
        c.cx = r.left + r.width / 2 - c.ox
        c.cy = r.top + r.height / 2 - c.oy
      })
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)

    if (shine) {
      shine.style.backgroundImage = 'linear-gradient(100deg, #211C16 0%, #211C16 42%, #9C8A72 50%, #211C16 58%, #211C16 100%)'
      shine.style.backgroundSize = '260% 100%'
      shine.style.webkitBackgroundClip = 'text'
      shine.style.backgroundClip = 'text'
      shine.style.color = 'transparent'
      shine.style.webkitTextFillColor = 'transparent'
    }

    let best = -1
    const E = 0.16
    let raf = null
    const m = mouseRef.current
    const loop = () => {
      const now = window.performance && performance.now ? performance.now() : Date.now()
      if (shine) {
        const p = ((now / 26) % 360) - 60
        shine.style.backgroundPosition = `${p.toFixed(1)}% 0`
      }
      let bI = -1, bD = 170
      if (m.active) {
        for (let i = 0; i < cards.length; i++) {
          const c = cards[i]
          const d = Math.hypot(m.rx - c.cx, m.ry - c.cy)
          if (d < bD) { bD = d; bI = i }
        }
      }
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i]
        let tx = 0, ty = 0, ts = 1
        if (m.active) {
          const dx = m.rx - c.cx, dy = m.ry - c.cy
          const d = Math.hypot(dx, dy) || 1
          if (d < 170) {
            const f = 1 - d / 170
            tx = (dx / d) * f * 12
            ty = (dy / d) * f * 12
            ts = 1 + f * 0.03
          }
        }
        c.ox += (tx - c.ox) * E
        c.oy += (ty - c.oy) * E
        c.s += (ts - c.s) * E
        c.el.style.transform = `translate3d(${c.ox.toFixed(2)}px, ${c.oy.toFixed(2)}px, 0) scale(${c.s.toFixed(3)})`
      }
      if (bI !== best) {
        cards.forEach((c, i) => { c.el.style.borderColor = i === bI ? accent : 'rgba(33,28,22,0.18)' })
        best = bI
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
      cards.forEach((c) => { c.el.style.transform = ''; c.el.style.borderColor = 'rgba(33,28,22,0.18)' })
      if (shine) {
        shine.style.color = ''
        shine.style.webkitTextFillColor = ''
        shine.style.backgroundImage = ''
        shine.style.webkitBackgroundClip = ''
        shine.style.backgroundClip = ''
      }
    }
  }, [mouseRef, reduce, accent])

  return (
    <main ref={mainRef} data-screen-label="Contact" style={{
      maxWidth: 1140, margin: '0 auto', padding: '72px 32px 80px',
      minHeight: 'calc(100vh - 70px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      animation: 'fadeIn .4s both',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 24,
        animation: 'riseIn .55s cubic-bezier(.2,.7,.2,1) both',
      }}>
        <span style={{
          width: 9, height: 9, borderRadius: '50%',
          background: accent, animation: 'pulse 2.2s infinite',
        }} />
        <span style={{
          fontFamily: MONO, fontSize: 12,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#7C7164',
        }}>Available · AI Engineer roles &amp; internships</span>
      </div>

      <h2 data-fx="shine" style={{
        margin: 0, fontWeight: 500,
        fontSize: 'clamp(44px, 8vw, 104px)',
        lineHeight: 0.94, letterSpacing: '-0.02em',
        animation: 'riseIn .55s cubic-bezier(.2,.7,.2,1) both',
        animationDelay: '.06s',
      }}>
        Let's build<br />something that <span style={{ fontStyle: 'italic' }}>ships</span>.
      </h2>

      <p style={{
        margin: '28px 0 44px', maxWidth: '30em',
        fontSize: 20, lineHeight: 1.5, color: '#3A332B',
        animation: 'riseIn .55s cubic-bezier(.2,.7,.2,1) both',
        animationDelay: '.12s',
      }}>
        The fastest way to reach me is email — I reply quickly. Always up for talking agents, latency, and shipping AI that people actually use.
      </p>

      <div data-ccgrid style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 14,
        animation: 'riseIn .55s cubic-bezier(.2,.7,.2,1) both',
        animationDelay: '.18s',
      }}>
        {LINKS.map((l) => (
          <a
            key={l.kind}
            data-fx="cc"
            href={l.href}
            target={l.ext ? '_blank' : undefined}
            rel={l.ext ? 'noopener noreferrer' : undefined}
            style={{
              textDecoration: 'none', color: '#211C16',
              border: '1px solid rgba(33,28,22,0.18)',
              borderRadius: 8, padding: '20px 22px',
              display: 'block', willChange: 'transform',
            }}
          >
            <div style={{
              fontFamily: MONO, fontSize: 11,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#9A8F80', marginBottom: 8,
            }}>{l.kind} ↗</div>
            <div style={{ fontSize: 18 }}>{l.label}</div>
          </a>
        ))}
      </div>

      <div style={{
        marginTop: 56, paddingTop: 22,
        borderTop: '1px solid rgba(33,28,22,0.12)',
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'space-between', gap: 14,
        fontFamily: MONO, fontSize: 11, color: '#9A8F80',
      }}>
        <span>Designed &amp; built by Karnav Prajapati · 2026</span>
        <span>Ahmedabad / Anand, India</span>
      </div>
    </main>
  )
}
