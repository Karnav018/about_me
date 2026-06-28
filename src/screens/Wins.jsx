import { useEffect, useRef } from 'react'
import { MONO } from '../lib/util.js'

const KICKER = {
  fontFamily: MONO, fontSize: 11,
  letterSpacing: '0.14em', textTransform: 'uppercase',
  color: '#9A8F80', marginBottom: 6,
}

const CERT = {
  fontFamily: MONO, fontSize: 11, color: '#3A332B',
  border: '1px solid rgba(33,28,22,0.18)',
  borderRadius: 999, padding: '6px 12px',
}

const HACKATHONS = [
  ['Smart India Hackathon — ', 'College Finalist', "'24 · '25"],
  ['NEXOTHON — 24-Hour Hackathon', null, '2025'],
  ['Odoo × Mindbend, SVNIT Surat', null, '2025'],
]

export default function Wins({ accent, accentRgb, reduce }) {
  const mainRef = useRef(null)

  useEffect(() => {
    if (reduce) return
    const main = mainRef.current
    if (!main) return
    const blobs = Array.from(main.querySelectorAll('[data-fx="blob"]'))
    const cfg = [
      { tint: accentRgb, a: 0.22, amp: [42, 30], sp: [0.055, 0.045], ph: 0.0 },
      { tint: '33,28,22', a: 0.07, amp: [54, 40], sp: [0.045, 0.062], ph: 2.1 },
      { tint: accentRgb, a: 0.16, amp: [34, 48], sp: [0.065, 0.04], ph: 4.0 },
    ]
    blobs.forEach((b, i) => {
      const k = cfg[i % cfg.length]
      b.style.background = `radial-gradient(circle, rgba(${k.tint},${k.a}), rgba(${k.tint},0) 68%)`
    })
    let raf = null
    const loop = () => {
      const t = (window.performance && performance.now ? performance.now() : Date.now()) / 1000
      for (let i = 0; i < blobs.length; i++) {
        const k = cfg[i % cfg.length]
        const x = Math.sin(t * k.sp[0] + k.ph) * k.amp[0]
        const y = Math.cos(t * k.sp[1] + k.ph) * k.amp[1]
        const s = 1 + Math.sin(t * 0.05 + k.ph) * 0.07
        blobs[i].style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(3)})`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      blobs.forEach((b) => { b.style.transform = '' })
    }
  }, [accentRgb, reduce])

  return (
    <main ref={mainRef} data-screen-label="Wins" style={{
      maxWidth: 1140, margin: '0 auto', padding: '72px 32px 96px',
      position: 'relative', overflow: 'hidden',
      animation: 'fadeIn .4s both',
    }}>
      <div data-fx="bg" style={{
        position: 'absolute', inset: 0, zIndex: -1,
        overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div data-fx="blob" style={{
          position: 'absolute', width: 560, height: 560,
          left: -40, top: 10, borderRadius: '50%',
          filter: 'blur(26px)', willChange: 'transform',
        }} />
        <div data-fx="blob" style={{
          position: 'absolute', width: 640, height: 640,
          right: -160, top: 140, borderRadius: '50%',
          filter: 'blur(30px)', willChange: 'transform',
        }} />
        <div data-fx="blob" style={{
          position: 'absolute', width: 480, height: 480,
          left: '34%', bottom: -200, borderRadius: '50%',
          filter: 'blur(26px)', willChange: 'transform',
        }} />
      </div>

      <h2 style={{
        margin: '0 0 40px', fontWeight: 500,
        fontSize: 'clamp(38px, 6vw, 76px)',
        lineHeight: 0.95, letterSpacing: '-0.02em',
        animation: 'riseIn .55s cubic-bezier(.2,.7,.2,1) both',
      }}>
        Wins &amp; <span style={{ fontStyle: 'italic' }}>recognition</span>
      </h2>

      <article style={{
        border: '1px solid rgba(33,28,22,0.16)',
        borderRadius: 6,
        padding: 'clamp(26px, 4vw, 42px)',
        marginBottom: 30,
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 20, alignItems: 'flex-start',
        animation: 'riseIn .55s cubic-bezier(.2,.7,.2,1) both',
        animationDelay: '.06s',
      }}>
        <div style={{ maxWidth: '34em' }}>
          <div style={{
            fontFamily: MONO, fontSize: 11,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: accent, marginBottom: 14,
          }}>Publication</div>
          <h3 style={{
            margin: 0, fontWeight: 500,
            fontSize: 'clamp(24px, 3.4vw, 34px)',
            lineHeight: 1.15, fontStyle: 'italic',
          }}>Anvaya — Visual REST API Builder Using Domain-Specific Languages</h3>
          <p style={{ margin: '14px 0 0', fontSize: 17, color: '#4A4239' }}>
            Research paper accepted at the International Conference on Smart Systems &amp; Sustainable Development.
          </p>
        </div>
        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: MONO, fontSize: 13, color: '#211C16' }}>ICSSSD 2026</div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: '#7C7164', marginTop: 4 }}>✓ Accepted</div>
        </div>
      </article>

      <div data-grid2 style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: 30,
      }}>
        <div style={{
          animation: 'riseIn .55s cubic-bezier(.2,.7,.2,1) both',
          animationDelay: '.12s',
        }}>
          <div style={KICKER}>Hackathons</div>
          {HACKATHONS.map(([a, em, year], i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', gap: 16,
              padding: '18px 0',
              borderBottom: i < HACKATHONS.length - 1 ? '1px solid rgba(33,28,22,0.12)' : 'none',
            }}>
              <span style={{ fontSize: 18 }}>
                {a}
                {em && <span style={{ fontStyle: 'italic' }}>{em}</span>}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 12, color: '#7C7164', whiteSpace: 'nowrap' }}>{year}</span>
            </div>
          ))}
        </div>

        <div style={{
          animation: 'riseIn .55s cubic-bezier(.2,.7,.2,1) both',
          animationDelay: '.18s',
        }}>
          <div style={KICKER}>Education</div>
          <div style={{ padding: '18px 0', borderBottom: '1px solid rgba(33,28,22,0.12)' }}>
            <div style={{ fontSize: 18 }}>A D Patel Institute of Technology</div>
            <div style={{ fontSize: 15, color: '#4A4239', marginTop: 3 }}>
              B.Tech, Information Technology · CGPA 8.09 · SGPA 8.90
            </div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: '#9A8F80', marginTop: 5 }}>
              2024 — 2027 · Anand
            </div>
          </div>
          <div style={{ padding: '18px 0' }}>
            <div style={{ fontSize: 18 }}>R.C. Technical Institute</div>
            <div style={{ fontSize: 15, color: '#4A4239', marginTop: 3 }}>Diploma, Information Technology</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: '#9A8F80', marginTop: 5 }}>2023 · Ahmedabad</div>
          </div>

          <div style={{ ...KICKER, margin: '22px 0 12px' }}>Certifications</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span style={CERT}>Claude Code 101 · Anthropic</span>
            <span style={CERT}>Python · Udemy</span>
            <span style={CERT}>Machine Learning · Pearson</span>
          </div>
        </div>
      </div>
    </main>
  )
}
