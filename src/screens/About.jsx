import { useEffect, useRef } from 'react'
import { MONO } from '../lib/util.js'

const CHIP = {
  fontFamily: MONO, fontSize: 11, color: '#3A332B',
  border: '1px solid rgba(33,28,22,0.18)',
  borderRadius: 999, padding: '5px 11px',
}

const GROUPS = [
  { label: 'GenAI / LLMs', chips: ['Llama 3.1', 'Groq', 'OpenAI SDK', 'Multi-agent', 'MCP / FastMCP', 'Prompt eng.'] },
  { label: 'AI / ML', chips: ['Deep Learning', 'CNNs', 'TensorFlow', 'Scikit-learn', 'OpenCV'] },
  { label: 'Web & APIs', chips: ['React.js', 'Node.js', 'FastAPI', 'REST · WebSockets'] },
  { label: 'Data & DevOps', chips: ['PostgreSQL', 'Redis', 'Kuzu · LanceDB', 'GitHub Actions', 'Jenkins'] },
  { label: 'Languages', chips: ['Python', 'SQL', 'JavaScript'] },
]

export default function About({ accent, mouseRef, reduce }) {
  const mainRef = useRef(null)

  // Cascade reveal followed by magnetic-chip field.
  useEffect(() => {
    const main = mainRef.current
    if (!main) return
    if (reduce) return

    const order = []
    const left = main.querySelector('[data-col="left"]')
    if (left) Array.from(left.children).forEach((c) => order.push(c))
    const right = main.querySelector('[data-col="right"]')
    if (right) {
      if (right.children[0]) order.push(right.children[0])
      const groups = right.children[1]
      if (groups) Array.from(groups.children).forEach((g) => {
        if (g.children[0]) order.push(g.children[0])
        const chips = g.children[1]
        if (chips) Array.from(chips.children).forEach((ch) => order.push(ch))
      })
    }

    const items = order.map((el, i) => ({ el, delay: i * 36 }))
    items.forEach(({ el }) => {
      el.style.transition = 'none'
      el.style.opacity = '0'
      el.style.transform = 'translateY(14px)'
    })

    const dur = 460
    const ease = (p) => 1 - Math.pow(1 - p, 3)
    const nowFn = () => (window.performance && performance.now ? performance.now() : Date.now())
    const base = nowFn()
    let raf = null
    let fieldRaf = null
    let onResize = null
    const fieldChips = []
    let hl = null

    const measureField = () => {
      for (const c of fieldChips) {
        const r = c.el.getBoundingClientRect()
        c.cx = r.left + r.width / 2 - c.ox
        c.cy = r.top + r.height / 2 - c.oy
      }
    }

    const aboutField = () => {
      const now = nowFn() / 1000
      const m = mouseRef.current
      const R = 150
      let best = -1, bestD = R
      if (m.active) {
        for (let i = 0; i < fieldChips.length; i++) {
          const c = fieldChips[i]
          const d = Math.hypot(m.rx - c.cx, m.ry - c.cy)
          if (d < bestD) { bestD = d; best = i }
        }
      }
      for (let i = 0; i < fieldChips.length; i++) {
        const c = fieldChips[i]
        let tx = Math.cos(now * 0.9 + c.phase) * 1.2
        let ty = Math.sin(now * 1.15 + c.phase) * 1.8
        let ts = 1
        if (m.active) {
          const dx = c.cx - m.rx, dy = c.cy - m.ry
          const d = Math.hypot(dx, dy) || 1
          if (d < R) {
            const f = 1 - d / R
            tx += (dx / d) * f * 20
            ty += (dy / d) * f * 20 - f * 7
            ts += f * 0.16
          }
        }
        c.ox += (tx - c.ox) * 0.15
        c.oy += (ty - c.oy) * 0.15
        c.s += (ts - c.s) * 0.15
        c.el.style.transform = `translate3d(${c.ox.toFixed(2)}px, ${c.oy.toFixed(2)}px, 0) scale(${c.s.toFixed(3)})`
      }
      if (best !== hl) {
        if (hl != null && fieldChips[hl]) {
          const e = fieldChips[hl].el
          e.style.background = ''; e.style.borderColor = 'rgba(33,28,22,0.18)'; e.style.color = '#3A332B'
        }
        if (best !== -1) {
          const e = fieldChips[best].el
          e.style.background = accent; e.style.borderColor = accent; e.style.color = '#F6F1E8'
        }
        hl = best
      }
      fieldRaf = requestAnimationFrame(aboutField)
    }

    const startField = () => {
      const r = main.querySelector('[data-col="right"]')
      if (!r || !r.children[1]) return
      Array.from(r.children[1].children).forEach((g) => {
        const wrap = g.children[1]
        if (wrap) Array.from(wrap.children).forEach((el) => {
          fieldChips.push({ el, cx: 0, cy: 0, ox: 0, oy: 0, s: 1, phase: Math.random() * 6.283 })
        })
      })
      measureField()
      onResize = () => measureField()
      window.addEventListener('resize', onResize)
      window.addEventListener('scroll', onResize, true)
      fieldRaf = requestAnimationFrame(aboutField)
    }

    const step = () => {
      const now = nowFn()
      let done = true
      for (const it of items) {
        const t = now - base - it.delay
        let p
        if (t <= 0) { p = 0; done = false }
        else if (t >= dur) { p = 1 }
        else { p = ease(t / dur); done = false }
        it.el.style.opacity = String(p)
        it.el.style.transform = `translateY(${(14 * (1 - p)).toFixed(2)}px)`
      }
      if (done) {
        raf = null
        startField()
      } else {
        raf = requestAnimationFrame(step)
      }
    }
    raf = requestAnimationFrame(step)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (fieldRaf) cancelAnimationFrame(fieldRaf)
      if (onResize) {
        window.removeEventListener('resize', onResize)
        window.removeEventListener('scroll', onResize, true)
      }
      if (hl != null && fieldChips[hl]) {
        const e = fieldChips[hl].el
        e.style.background = ''; e.style.borderColor = 'rgba(33,28,22,0.18)'; e.style.color = '#3A332B'
      }
    }
  }, [mouseRef, reduce, accent])

  return (
    <main ref={mainRef} data-screen-label="About" style={{
      maxWidth: 1140, margin: '0 auto', padding: '72px 32px 96px',
      animation: 'fadeIn .4s both',
    }}>
      <div data-grid2 style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
        gap: 'clamp(32px, 6vw, 84px)',
        alignItems: 'start',
      }}>
        <div data-col="left" style={{ animation: 'riseIn .55s cubic-bezier(.2,.7,.2,1) both' }}>
          <h2 style={{
            margin: '0 0 26px', fontWeight: 500,
            fontSize: 'clamp(38px, 6vw, 76px)',
            lineHeight: 0.95, letterSpacing: '-0.02em',
          }}>
            A little <span style={{ fontStyle: 'italic' }}>about me</span>
          </h2>
          <p style={{
            margin: '0 0 22px', fontSize: 21, lineHeight: 1.55, color: '#322C24',
          }}>
            I'm Karnav — an AI-focused IT student from Ahmedabad who likes building systems that feel alive: agents that listen, reason out loud, and respond before you've finished your sentence.
          </p>
          <p style={{ margin: 0, fontSize: 21, lineHeight: 1.55, color: '#322C24' }}>
            My happy place is the messy middle of an AI pipeline — streaming tokens, orchestrating agents, and trimming latency until a demo feels like magic. Hackathon finalist, published author, and a relentlessly quick learner.
          </p>
          <div style={{
            marginTop: 30,
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '12px 18px',
            background: '#ECE4D7',
            border: '1px solid rgba(33,28,22,0.12)',
            borderRadius: 8,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: accent, animation: 'pulse 2.2s infinite',
            }} />
            <span style={{ fontFamily: MONO, fontSize: 12, color: '#4A4239' }}>
              Currently exploring → LangChain &amp; deeper agent orchestration
            </span>
          </div>
        </div>

        <div data-col="right" style={{
          animation: 'riseIn .55s cubic-bezier(.2,.7,.2,1) both',
          animationDelay: '.10s',
        }}>
          <div style={{
            fontFamily: MONO, fontSize: 12,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#9A8F80', marginBottom: 18,
          }}>The toolkit</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {GROUPS.map((g) => (
              <div key={g.label}>
                <div style={{
                  fontSize: 15, fontStyle: 'italic',
                  color: '#211C16', marginBottom: 9,
                }}>{g.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {g.chips.map((c) => (
                    <span key={c} style={CHIP}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
