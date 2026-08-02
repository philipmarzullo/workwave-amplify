import { useState, useEffect, useCallback, useRef } from 'react'

const GRID_SIZE = 4
const MAX_MISSES = 5

interface Intruder {
  id: number
  position: number
  appearedAt: number
  visibleDuration: number
  phase: 'in' | 'visible' | 'out' | 'caught'
}

const TIERS = [
  { min: 201, label: 'Night Watch Legend' },
  { min: 121, label: 'Head of Security' },
  { min: 51, label: 'Floor Captain' },
  { min: 0, label: 'Lobby Guard' },
]

function getTier(score: number) {
  return TIERS.find(t => score >= t.min)?.label ?? 'Lobby Guard'
}

export default function NightWatch({ onClose, onBack }: { onClose: () => void; onBack: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'over'>('ready')
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [intruders, setIntruders] = useState<Intruder[]>([])
  const [catchEffects, setCatchEffects] = useState<Map<number, boolean>>(new Map())

  const nextId = useRef(0)
  const spawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const checkTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const gameStartTime = useRef(0)
  const missesRef = useRef(misses)
  const intrudersRef = useRef(intruders)
  missesRef.current = misses
  intrudersRef.current = intruders

  const clearTimers = useCallback(() => {
    if (spawnTimer.current) clearTimeout(spawnTimer.current)
    if (checkTimer.current) clearInterval(checkTimer.current)
    spawnTimer.current = null
    checkTimer.current = null
  }, [])

  const endGame = useCallback(() => {
    clearTimers()
    setIntruders([])
    setPhase('over')
  }, [clearTimers])

  const endGameRef = useRef(endGame)
  endGameRef.current = endGame

  const spawnIntruder = useCallback(() => {
    const elapsed = (Date.now() - gameStartTime.current) / 1000
    const progress = Math.min(elapsed / 45, 1)
    // Visible window: 1.5s at start, 0.6s at end
    const visibleDuration = 1500 - progress * 900

    // Find occupied positions
    const occupied = new Set(intrudersRef.current.map(i => i.position))
    const available: number[] = []
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      if (!occupied.has(i)) available.push(i)
    }
    if (available.length === 0) return

    const position = available[Math.floor(Math.random() * available.length)]
    const intruder: Intruder = {
      id: nextId.current++,
      position,
      appearedAt: Date.now(),
      visibleDuration,
      phase: 'in',
    }

    setIntruders(prev => [...prev, intruder])

    // Transition from 'in' to 'visible' after 300ms
    setTimeout(() => {
      setIntruders(prev =>
        prev.map(i => i.id === intruder.id ? { ...i, phase: 'visible' } : i)
      )
    }, 300)

    // Start fade out after visible duration
    setTimeout(() => {
      setIntruders(prev =>
        prev.map(i => i.id === intruder.id && i.phase === 'visible' ? { ...i, phase: 'out' } : i)
      )
    }, 300 + visibleDuration)

    // Remove and count miss after fade out
    setTimeout(() => {
      setIntruders(prev => {
        const target = prev.find(i => i.id === intruder.id)
        if (target && target.phase !== 'caught') {
          setMisses(prev => {
            const newMisses = prev + 1
            if (newMisses >= MAX_MISSES) {
              setTimeout(() => endGameRef.current(), 0)
            }
            return newMisses
          })
          return prev.filter(i => i.id !== intruder.id)
        }
        return prev.filter(i => i.id !== intruder.id)
      })
    }, 600 + visibleDuration)
  }, [])

  const scheduleSpawn = useCallback(() => {
    const elapsed = (Date.now() - gameStartTime.current) / 1000
    const progress = Math.min(elapsed / 45, 1)

    // Spawn interval: 2s at start, 0.8s at end
    const interval = 2000 - progress * 1200

    // Allow multiple simultaneous intruders as game progresses
    const maxSimultaneous = Math.floor(1 + progress * 2) // 1-3

    spawnTimer.current = setTimeout(() => {
      if (missesRef.current < MAX_MISSES) {
        const currentCount = intrudersRef.current.length
        if (currentCount < maxSimultaneous) {
          spawnIntruder()
        }
        scheduleSpawn()
      }
    }, interval)
  }, [spawnIntruder])

  const startGame = useCallback(() => {
    setScore(0)
    setMisses(0)
    setIntruders([])
    setCatchEffects(new Map())
    nextId.current = 0
    gameStartTime.current = Date.now()
    setPhase('playing')
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return

    spawnIntruder()
    scheduleSpawn()

    return () => clearTimers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleCatch = useCallback((intruderId: number) => {
    const intruder = intrudersRef.current.find(i => i.id === intruderId)
    if (!intruder || intruder.phase === 'out' || intruder.phase === 'caught') return

    const reactionTime = Date.now() - intruder.appearedAt
    const bonus = reactionTime < 500 ? 5 : 0
    const points = 10 + bonus

    setScore(prev => prev + points)
    setIntruders(prev =>
      prev.map(i => i.id === intruderId ? { ...i, phase: 'caught' as const } : i)
    )

    // Show catch effect
    setCatchEffects(prev => {
      const next = new Map(prev)
      next.set(intruder.position, true)
      return next
    })
    setTimeout(() => {
      setCatchEffects(prev => {
        const next = new Map(prev)
        next.delete(intruder.position)
        return next
      })
      setIntruders(prev => prev.filter(i => i.id !== intruderId))
    }, 400)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0A1128 0%, #0d1020 100%)' }}
    >
      <style>{`
        @keyframes intruder-in {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes intruder-out {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.5); }
        }
        @keyframes caught-flash {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
          100% { opacity: 0; transform: scale(0.8); }
        }
        @keyframes static-noise {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }
        .intruder-enter { animation: intruder-in 0.3s ease-out forwards; }
        .intruder-exit { animation: intruder-out 0.3s ease-in forwards; }
        .intruder-caught { animation: caught-flash 0.4s ease-out forwards; }
        .camera-static {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
          animation: static-noise 2s ease-in-out infinite;
        }
      `}</style>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        aria-label="Close game"
      >
        &times;
      </button>

      {phase === 'ready' && (
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display">
            Night Watch
          </h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base max-w-md mx-auto">
            Monitor the cameras! Click intruders before they vanish. 5 misses and you're done. Quick clicks earn bonus points.
          </p>
          <button
            onClick={startGame}
            className="text-white font-bold px-8 py-3 rounded-xl text-lg transition-colors cursor-pointer"
            style={{ backgroundColor: '#264BEE' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Start Watch
          </button>
          <div className="mt-4">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">
              ← Back to Arcade
            </button>
          </div>
        </div>
      )}

      {phase === 'playing' && (
        <div className="text-center px-4">
          <div className="flex justify-between items-center mb-3 max-w-[400px] mx-auto">
            <div className="text-white font-bold text-lg">
              Score: <span style={{ color: '#264BEE' }}>{score}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: MAX_MISSES }, (_, i) => (
                <span
                  key={i}
                  className="text-lg"
                  style={{ opacity: i < misses ? 1 : 0.2 }}
                >
                  {i < misses ? '❌' : '⬜'}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 max-w-[400px] mx-auto">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
              const intruder = intruders.find(int => int.position === i)
              const caught = catchEffects.get(i)

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (intruder) handleCatch(intruder.id)
                  }}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer"
                  style={{
                    backgroundColor: '#0d1117',
                    border: caught ? '2px solid #264BEE' : '1px solid #1a2332',
                    boxShadow: caught ? '0 0 12px rgba(38, 75, 238, 0.5)' : 'none',
                  }}
                  aria-label={intruder ? 'Click to catch intruder' : 'Camera feed'}
                >
                  {/* Static effect overlay */}
                  <div className="camera-static absolute inset-0 pointer-events-none" />

                  {/* Camera number */}
                  <span className="absolute top-0.5 left-1 text-[8px] text-gray-700 select-none font-mono">
                    CAM-{(i + 1).toString().padStart(2, '0')}
                  </span>

                  {intruder && intruder.phase !== 'caught' && (
                    <span
                      className={`text-2xl sm:text-3xl select-none ${
                        intruder.phase === 'in' ? 'intruder-enter' :
                        intruder.phase === 'out' ? 'intruder-exit' : ''
                      }`}
                    >
                      🥷
                    </span>
                  )}

                  {caught && (
                    <div className="intruder-caught absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold" style={{ color: '#264BEE' }}>CAUGHT</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {phase === 'over' && (
        <div className="text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display">
            Shift Over!
          </h2>
          <p className="text-6xl sm:text-7xl font-bold mb-2 font-display" style={{ color: '#264BEE' }}>
            {score}
          </p>
          <p className="text-gray-400 mb-1 text-sm">points</p>
          <p className="text-xl font-bold text-white mb-6">{getTier(score)}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={startGame}
              className="text-white font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
              style={{ backgroundColor: '#264BEE' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Play Again
            </button>
            <button
              onClick={onBack}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Back to Arcade
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
