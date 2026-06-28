import { MONO } from '../lib/util.js'
import Logo from './Logo.jsx'

const navBtn = {
  position: 'relative',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '8px 12px',
  fontFamily: MONO,
  fontSize: 12,
  letterSpacing: '0.10em',
  textTransform: 'uppercase',
  color: '#211C16',
}

function NavBtn({ label, active, accent, onClick }) {
  return (
    <button onClick={onClick} className="nav-btn" style={navBtn}>
      {label}
      {active && (
        <span style={{
          position: 'absolute',
          left: 12, right: 12, bottom: 2,
          height: 2,
          background: accent,
        }} />
      )}
    </button>
  )
}

export default function Header({ page, accent, showStatus, onNav }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(243,237,227,0.82)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(33,28,22,0.10)',
    }}>
      <div data-bar style={{
        maxWidth: 1140, margin: '0 auto',
        padding: '0 32px', height: 70,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
      }}>
        <button onClick={() => onNav('home')} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <Logo size={30} />
          <span data-logo-text style={{
            fontFamily: MONO, fontSize: 12, letterSpacing: '0.04em', color: '#211C16',
          }}>karnav</span>
        </button>

        <nav data-nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <NavBtn label="Home" active={page === 'home'} accent={accent} onClick={() => onNav('home')} />
          <NavBtn label="Work" active={page === 'work'} accent={accent} onClick={() => onNav('work')} />
          <NavBtn label="About" active={page === 'about'} accent={accent} onClick={() => onNav('about')} />
          <NavBtn label="Wins" active={page === 'wins'} accent={accent} onClick={() => onNav('wins')} />
          <NavBtn label="Contact" active={page === 'contact'} accent={accent} onClick={() => onNav('contact')} />
        </nav>

        {showStatus && (
          <div data-status style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 13px',
            border: '1px solid rgba(33,28,22,0.16)',
            borderRadius: 999,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: accent,
              animation: 'pulse 2.2s infinite',
            }} />
            <span style={{
              fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', color: '#4A4239',
            }}>Open to roles</span>
          </div>
        )}
      </div>
    </header>
  )
}
