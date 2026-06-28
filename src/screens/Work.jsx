import { useEffect, useRef } from 'react'
import { MONO } from '../lib/util.js'

const TAG_DARK = {
  fontFamily: MONO, fontSize: 11, color: '#D9CFC0',
  border: '1px solid rgba(243,237,227,0.22)',
  borderRadius: 999, padding: '6px 12px',
}

const PROJECTS = [
  {
    n: '01',
    meta: 'PyPI · 2026',
    title: 'Topolox',
    body: 'An MCP server giving AI agents deterministic memory of a codebase — graph + vector indexing across 14 languages.',
    stack: ['Python · MCP · tree-sitter', 'Kuzu · LanceDB'],
    delay: '.12s',
  },
  {
    n: '02',
    meta: 'Deep learning · 2025',
    title: 'Emotion → Music',
    body: 'A CNN trained on 10K+ images that reads facial expressions and recommends music to match the mood, live.',
    stack: ['TensorFlow · Keras', 'OpenCV'],
    delay: '.18s',
  },
  {
    n: '03',
    meta: 'Published · 2025',
    title: 'Anvaya',
    body: 'A drag-and-drop designer that turns REST API schemas into generated code — paper accepted at ICSSSD 2026.',
    stack: ['React · Node.js', 'Domain-specific languages'],
    delay: '.24s',
  },
]

export default function Work({ accent, accentRgb, mouseRef, reduce }) {
  const mainRef = useRef(null)
  const glowRef = useRef(null)
  const featRef = useRef(null)
  const cardsWrapRef = useRef(null)

  useEffect(() => {
    if (reduce) return
    const mainEl = mainRef.current
    if (!mainEl) return
    const glow = glowRef.current
    const featured = featRef.current
    const cardsWrap = cardsWrapRef.current
    const cards = cardsWrap
      ? Array.from(cardsWrap.children).map((el) => ({ el, x: 0, y: 0, w: 1, h: 1, rx: 0, ry: 0, lift: 0, s: 1 }))
      : []
    cards.forEach((c) => { c.el.style.transform = ''; c.el.style.transformStyle = 'preserve-3d' })

    let fRect = null
    const measure = () => {
      cards.forEach((c) => { const r = c.el.getBoundingClientRect(); c.x = r.left; c.y = r.top; c.w = r.width; c.h = r.height })
      fRect = featured ? featured.getBoundingClientRect() : null
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)

    let glowO = 0
    const E = 0.14
    let raf = null
    const m = mouseRef.current
    const loop = () => {
      if (glow && fRect) {
        const lx = m.rx - fRect.left, ly = m.ry - fRect.top
        const inside = m.active && lx >= 0 && lx <= fRect.width && ly >= 0 && ly <= fRect.height
        glowO += ((inside ? 1 : 0) - glowO) * 0.12
        if (glowO > 0.01) {
          glow.style.background = `radial-gradient(380px circle at ${lx.toFixed(0)}px ${ly.toFixed(0)}px, rgba(${accentRgb},0.24), rgba(${accentRgb},0) 60%)`
          glow.style.opacity = glowO.toFixed(3)
        } else {
          glow.style.opacity = '0'
        }
      }
      for (const c of cards) {
        const over = m.active && m.rx >= c.x && m.rx <= c.x + c.w && m.ry >= c.y && m.ry <= c.y + c.h
        let trY = 0, trX = 0, tl = 0, ts = 1
        if (over) {
          const relX = (m.rx - c.x) / c.w - 0.5
          const relY = (m.ry - c.y) / c.h - 0.5
          trY = relX * 13; trX = -relY * 13; tl = -8; ts = 1.025
        }
        c.ry += (trY - c.ry) * E
        c.rx += (trX - c.rx) * E
        c.lift += (tl - c.lift) * E
        c.s += (ts - c.s) * E
        c.el.style.transform = `perspective(900px) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg) translateY(${c.lift.toFixed(2)}px) scale(${c.s.toFixed(3)})`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
      cards.forEach((c) => { c.el.style.transform = '' })
      if (glow) glow.style.opacity = '0'
    }
  }, [mouseRef, reduce, accentRgb])

  return (
    <main ref={mainRef} data-screen-label="Work" style={{
      maxWidth: 1140, margin: '0 auto', padding: '72px 32px 96px',
      animation: 'fadeIn .4s both',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 24, marginBottom: 40,
        animation: 'riseIn .55s cubic-bezier(.2,.7,.2,1) both',
      }}>
        <h2 style={{
          margin: 0, fontWeight: 500,
          fontSize: 'clamp(38px, 6vw, 76px)',
          lineHeight: 0.95, letterSpacing: '-0.02em',
        }}>
          Selected <span style={{ fontStyle: 'italic' }}>work</span>
        </h2>
        <span style={{
          fontFamily: MONO, fontSize: 12,
          letterSpacing: '0.10em', color: '#9A8F80',
          whiteSpace: 'nowrap', paddingBottom: 10,
        }}>04 — projects</span>
      </div>

      <article ref={featRef} data-fx="featured" style={{
        position: 'relative', overflow: 'hidden',
        background: '#211C16', color: '#F3EDE3',
        borderRadius: 6,
        padding: 'clamp(28px, 4vw, 52px)',
        marginBottom: 22,
        animation: 'riseIn .55s cubic-bezier(.2,.7,.2,1) both',
        animationDelay: '.06s',
      }}>
        <div ref={glowRef} data-fx="glow" style={{
          position: 'absolute', inset: 0, zIndex: 0,
          pointerEvents: 'none', opacity: 0,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            gap: 14, marginBottom: 22,
          }}>
            <span style={{
              fontFamily: MONO, fontSize: 11,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#C9B79E',
            }}>★ Flagship</span>
            <span style={{
              fontFamily: MONO, fontSize: 11,
              letterSpacing: '0.06em', color: '#8C8174',
            }}>TechNooka LLP · SDE Intern · 2026</span>
          </div>
          <h3 style={{
            margin: 0, fontWeight: 500,
            fontSize: 'clamp(30px, 4.4vw, 52px)',
            lineHeight: 1.0,
          }}>SuperTonic</h3>
          <p style={{
            margin: '16px 0 0', maxWidth: '34em',
            fontSize: 19, lineHeight: 1.5, color: '#D9CFC0',
          }}>
            A bilingual voice AI agent for university admissions — real-time speech→LLM→speech over FastAPI &amp; WebSockets, with sentence-level token streaming, barge-in detection, and a tiered multi-agent arbiter persisting leads to async PostgreSQL.
          </p>
          <div style={{
            marginTop: 24,
            display: 'flex', flexWrap: 'wrap', gap: 8,
          }}>
            <span style={TAG_DARK}>FastAPI</span>
            <span style={TAG_DARK}>WebSockets</span>
            <span style={TAG_DARK}>Llama 3.1 · Groq</span>
            <span style={TAG_DARK}>PostgreSQL</span>
            <span style={TAG_DARK}>Jenkins CI/CD</span>
          </div>
        </div>
      </article>

      <div ref={cardsWrapRef} data-fx="cards" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 22,
      }}>
        {PROJECTS.map((p) => (
          <article key={p.n} className="proj-card" style={{
            background: '#ECE4D7',
            border: '1px solid rgba(33,28,22,0.10)',
            borderRadius: 6, padding: 28,
            transition: 'transform .25s ease, border-color .25s ease',
            animation: 'riseIn .55s cubic-bezier(.2,.7,.2,1) both',
            animationDelay: p.delay,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', marginBottom: 14,
            }}>
              <span style={{ fontFamily: MONO, fontSize: 12, color: accent }}>{p.n}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#9A8F80' }}>{p.meta}</span>
            </div>
            <h3 style={{ margin: 0, fontWeight: 500, fontSize: 27 }}>{p.title}</h3>
            <p style={{
              margin: '10px 0 0', fontSize: 17, lineHeight: 1.5, color: '#4A4239',
            }}>{p.body}</p>
            <div style={{
              marginTop: 18,
              fontFamily: MONO, fontSize: 11,
              color: '#7C7164', lineHeight: 1.7,
            }}>
              {p.stack.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
