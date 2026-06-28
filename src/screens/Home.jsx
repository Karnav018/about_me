import { useEffect, useRef } from 'react'
import { MONO } from '../lib/util.js'

const PHRASES = [
  'LLM-powered multi-agent systems.',
  'real-time voice AI pipelines.',
  'agents that listen & reply.',
  'things that actually ship.',
]

const labelKicker = {
  fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em',
  textTransform: 'uppercase', color: '#9A8F80', marginBottom: 6,
}

export default function Home({ accent, accentRgb, mouseRef, reduce, onNav }) {
  const typedRef = useRef(null)
  const spotRef = useRef(null)
  const l1Ref = useRef(null)
  const l2Ref = useRef(null)
  const l3Ref = useRef(null)
  const l4Ref = useRef(null)

  // Typewriter
  useEffect(() => {
    let pi = 0, ci = 0, deleting = false, timer = null
    const write = (s) => {
      const el = typedRef.current
      if (el) el.textContent = s
    }
    const tick = () => {
      const full = PHRASES[pi]
      if (!deleting) {
        ci++
        if (ci >= full.length) {
          deleting = true
          write(full)
          timer = setTimeout(tick, 1500)
          return
        }
      } else {
        ci--
        if (ci <= 0) {
          ci = 0
          deleting = false
          pi = (pi + 1) % PHRASES.length
          write('')
          timer = setTimeout(tick, 320)
          return
        }
      }
      write(full.slice(0, ci))
      timer = setTimeout(tick, deleting ? 38 : 62)
    }
    tick()
    return () => clearTimeout(timer)
  }, [])

  // Parallax + cursor spotlight
  useEffect(() => {
    if (reduce) return
    let raf = null
    const m = mouseRef.current
    const set = (ref, amt) => {
      const el = ref.current
      if (el) el.style.transform = `translate3d(${(m.cx * amt).toFixed(2)}px, ${(m.cy * amt).toFixed(2)}px, 0)`
    }
    const loop = () => {
      m.cx += (m.tx - m.cx) * 0.09
      m.cy += (m.ty - m.cy) * 0.09
      set(l1Ref, 22)
      set(l2Ref, 12)
      set(l3Ref, 16)
      set(l4Ref, 28)
      const sp = spotRef.current
      if (sp && m.active) {
        const r = sp.getBoundingClientRect()
        const x = (m.rx - r.left).toFixed(0)
        const y = (m.ry - r.top).toFixed(0)
        sp.style.background = `radial-gradient(440px circle at ${x}px ${y}px, rgba(${accentRgb},0.14), rgba(${accentRgb},0) 62%)`
        sp.style.opacity = '1'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => raf && cancelAnimationFrame(raf)
  }, [mouseRef, reduce, accentRgb])

  return (
    <main data-screen-label="Home" style={{
      maxWidth: 1140, margin: '0 auto', padding: '72px 32px 96px',
      position: 'relative', overflow: 'hidden',
      animation: 'fadeIn .4s both',
    }}>
      <div ref={spotRef} style={{
        position: 'absolute', inset: 0, zIndex: 0,
        pointerEvents: 'none', opacity: 0,
        transition: 'opacity .5s ease',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ animation: 'riseIn .6s cubic-bezier(.2,.7,.2,1) both' }}>
          <div ref={l1Ref} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 30, willChange: 'transform',
          }}>
            <span style={{ width: 9, height: 9, background: accent }} />
            <span style={{
              fontFamily: MONO, fontSize: 12,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#7C7164',
            }}>AI Engineer · ADIT '27 · Ahmedabad, India</span>
          </div>
          <h1 ref={l2Ref} data-hero style={{
            margin: 0, fontWeight: 500,
            fontSize: 'clamp(52px, 9.4vw, 134px)',
            lineHeight: 0.92, letterSpacing: '-0.02em',
            willChange: 'transform',
          }}>
            Karnav<br />
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Prajapati</span>
          </h1>
        </div>

        <div ref={l3Ref} style={{
          marginTop: 34,
          fontSize: 'clamp(22px, 3.6vw, 40px)',
          lineHeight: 1.18, maxWidth: '18em',
          willChange: 'transform',
          animation: 'riseIn .6s cubic-bezier(.2,.7,.2,1) both',
          animationDelay: '.10s',
        }}>
          <span style={{ color: '#4A4239' }}>I build </span>
          <span ref={typedRef} style={{ fontStyle: 'italic' }} />
          <span style={{
            display: 'inline-block', width: 3, height: '0.95em',
            marginLeft: 3, verticalAlign: '-0.12em',
            background: accent,
            animation: 'blink 1s step-end infinite',
          }} />
        </div>

        <p style={{
          margin: '34px 0 0', maxWidth: '30em',
          fontSize: 20, lineHeight: 1.55, color: '#3A332B',
          animation: 'riseIn .6s cubic-bezier(.2,.7,.2,1) both',
          animationDelay: '.18s',
        }}>
          Final-year IT student turning language models into real-time systems that talk, reason, and ship. Right now I own the AI stack behind a bilingual voice agent — streaming speech to LLM to speech over WebSockets.
        </p>

        <div ref={l4Ref} style={{
          marginTop: 40,
          display: 'flex', flexWrap: 'wrap', gap: 14,
          willChange: 'transform',
          animation: 'riseIn .6s cubic-bezier(.2,.7,.2,1) both',
          animationDelay: '.26s',
        }}>
          <button onClick={() => onNav('work')} className="cta-dark" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: '#211C16', color: '#F3EDE3',
            border: 'none', cursor: 'pointer',
            padding: '15px 26px', borderRadius: 999,
            fontFamily: MONO, fontSize: 12, letterSpacing: '0.10em',
            textTransform: 'uppercase',
            transition: 'transform .2s ease, background .2s ease',
          }}>View my work →</button>
          <button onClick={() => onNav('contact')} className="cta-ghost" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'none', color: '#211C16',
            border: '1px solid rgba(33,28,22,0.28)',
            cursor: 'pointer',
            padding: '15px 26px', borderRadius: 999,
            fontFamily: MONO, fontSize: 12, letterSpacing: '0.10em',
            textTransform: 'uppercase',
            transition: 'border-color .2s ease, transform .2s ease',
          }}>Get in touch</button>
        </div>

        <div style={{
          marginTop: 84, paddingTop: 26,
          borderTop: '1px solid rgba(33,28,22,0.12)',
          display: 'flex', flexWrap: 'wrap', gap: 36,
          animation: 'riseIn .6s cubic-bezier(.2,.7,.2,1) both',
          animationDelay: '.34s',
        }}>
          <div>
            <div style={labelKicker}>Focus</div>
            <div style={{ fontSize: 18 }}>LLMs · Multi-agent systems</div>
          </div>
          <div>
            <div style={labelKicker}>Studying</div>
            <div style={{ fontSize: 18 }}>B.Tech IT · CGPA 8.09</div>
          </div>
          <div>
            <div style={labelKicker}>Status</div>
            <div style={{ fontSize: 18 }}>Open to AI Engineer roles</div>
          </div>
        </div>
      </div>
    </main>
  )
}
