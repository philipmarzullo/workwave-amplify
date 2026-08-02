import { useState, useEffect, lazy, Suspense } from 'react'

const ServiceDash = lazy(() => import('./games/ServiceDash'))

export default function GameArcade({ onClose }: { onClose: () => void }) {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (playing) {
          setPlaying(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, playing])

  const handleBack = () => setPlaying(false)

  if (playing) {
    return (
      <Suspense
        fallback={
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0A1128 0%, #1a1f3a 100%)' }}
          >
            <div className="text-white text-lg">Loading...</div>
          </div>
        }
      >
        <ServiceDash onClose={onClose} onBack={handleBack} />
      </Suspense>
    )
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto"
      style={{ background: 'linear-gradient(135deg, #0A1128 0%, #1a1f3a 100%)' }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors z-10"
        aria-label="Close arcade"
      >
        &times;
      </button>

      <div className="text-center px-4 py-8 max-w-lg mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display">
          AMPLIFY Arcade
        </h2>
        <p className="text-gray-400 mb-8 text-sm sm:text-base">
          How far can you go?
        </p>

        <button
          onClick={() => setPlaying(true)}
          className="group relative rounded-2xl p-6 sm:p-8 text-center transition-all duration-200 cursor-pointer w-full max-w-sm mx-auto block"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '2px solid #22c55e33',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#22c55e'
            e.currentTarget.style.boxShadow = '0 0 20px #22c55e22'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#22c55e33'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div className="text-5xl sm:text-6xl mb-3">🚐</div>
          <div className="font-bold text-white text-xl sm:text-2xl mb-1">Service Dash</div>
          <div className="text-sm font-semibold" style={{ color: '#22c55e' }}>
            Endless Runner
          </div>
          <div className="text-gray-500 text-sm mt-2 leading-snug">
            Dodge pests, overgrowth, and more across all four industries. Grab power-ups, survive special hazards, and see how far you can go.
          </div>
        </button>

        <p className="text-gray-600 text-xs mt-6">Press Esc to close</p>
      </div>
    </div>
  )
}
