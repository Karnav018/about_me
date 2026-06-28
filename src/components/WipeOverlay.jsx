import { SERIF } from '../lib/util.js'

export default function WipeOverlay({ label, onEnd }) {
  return (
    <div
      onAnimationEnd={onEnd}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: '#211C16', color: '#F3EDE3',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: 'translateX(-101%)',
        animation: 'wipe .82s cubic-bezier(.76,0,.24,1) forwards',
        willChange: 'transform',
      }}
    >
      <span style={{
        fontFamily: SERIF,
        fontStyle: 'italic',
        fontSize: 'clamp(40px, 7vw, 86px)',
        fontWeight: 400,
        opacity: 0.92,
      }}>{label}</span>
    </div>
  )
}
