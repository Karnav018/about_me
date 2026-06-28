import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Home from './screens/Home.jsx'
import Work from './screens/Work.jsx'
import About from './screens/About.jsx'
import Wins from './screens/Wins.jsx'
import Contact from './screens/Contact.jsx'
import Header from './components/Header.jsx'
import WipeOverlay from './components/WipeOverlay.jsx'
import { hexToRgb, useReducedMotion } from './lib/util.js'

const ACCENT = '#ff4800'
const CURSOR_PLAY = true
const SHOW_STATUS = true

const LABEL = { home: 'Home', work: 'Work', about: 'About', wins: 'Wins', contact: 'Contact' }

export default function App() {
  const [page, setPage] = useState('home')
  const [wipe, setWipe] = useState({ active: false, label: '' })
  const reduce = useReducedMotion()

  const pageRef = useRef(page)
  const wipeActiveRef = useRef(false)
  useEffect(() => { pageRef.current = page }, [page])
  useEffect(() => { wipeActiveRef.current = wipe.active }, [wipe.active])

  // Shared mouse-position ref — every FX reads from this, mutated by a single global listener.
  const mouseRef = useRef({ tx: 0, ty: 0, cx: 0, cy: 0, rx: 0, ry: 0, active: false })

  useEffect(() => {
    if (!CURSOR_PLAY || reduce) return
    const onMove = (e) => {
      const m = mouseRef.current
      m.tx = (e.clientX / window.innerWidth) * 2 - 1
      m.ty = (e.clientY / window.innerHeight) * 2 - 1
      m.rx = e.clientX
      m.ry = e.clientY
      m.active = true
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduce])

  const wipeTimers = useRef({})
  const nav = useCallback((target) => {
    if (target === pageRef.current || wipeActiveRef.current) return
    setWipe({ active: true, label: LABEL[target] || '' })
    clearTimeout(wipeTimers.current.swap)
    clearTimeout(wipeTimers.current.end)
    wipeTimers.current.swap = setTimeout(() => {
      setPage(target)
      try { window.scrollTo(0, 0) } catch {}
    }, 410)
    wipeTimers.current.end = setTimeout(() => setWipe({ active: false, label: '' }), 900)
  }, [])

  useEffect(() => () => {
    clearTimeout(wipeTimers.current.swap)
    clearTimeout(wipeTimers.current.end)
  }, [])

  const accentRgb = useMemo(() => hexToRgb(ACCENT), [])

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <Header page={page} accent={ACCENT} showStatus={SHOW_STATUS} onNav={nav} />

      {page === 'home' && (
        <Home accent={ACCENT} accentRgb={accentRgb} mouseRef={mouseRef} reduce={reduce} onNav={nav} />
      )}
      {page === 'work' && (
        <Work accent={ACCENT} accentRgb={accentRgb} mouseRef={mouseRef} reduce={reduce} />
      )}
      {page === 'about' && (
        <About accent={ACCENT} mouseRef={mouseRef} reduce={reduce} />
      )}
      {page === 'wins' && (
        <Wins accent={ACCENT} accentRgb={accentRgb} reduce={reduce} />
      )}
      {page === 'contact' && (
        <Contact accent={ACCENT} mouseRef={mouseRef} reduce={reduce} />
      )}

      {wipe.active && (
        <WipeOverlay label={wipe.label} onEnd={() => setWipe({ active: false, label: '' })} />
      )}
    </div>
  )
}
