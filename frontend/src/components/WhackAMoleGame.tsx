import { useState, useEffect, useCallback, useRef } from 'react'

interface ActiveMole {
  industry: number
  spawnedAt: number
  timeout: ReturnType<typeof setTimeout>
}

const INDUSTRIES = [
  { name: 'Pest', emoji: '\u{1F41B}', color: '#E8005E', label: 'PestPac' },
  { name: 'Lawn', emoji: '\u{1F33F}', color: '#22c55e', label: 'RealGreen' },
  { name: 'Security', emoji: '\u{1F513}', color: '#264BEE', label: 'WinTeam' },
  { name: 'Janitorial', emoji: '\u{1F4A7}', color: '#8B3DFF', label: 'Joint' },
]

const GRID_SIZE = 16
const GAME_DURATION = 60

const TIERS = [
  { min: 301, label: 'Service Legend' },
  { min: 151, label: 'Field Service Hero' },
  { min: 51, label: 'Seasoned Pro' },
  { min: 0, label: 'Rookie' },
]

function getTier(score: number) {
  return TIERS.find(t => score >= t.min)?.label ?? 'Rookie'
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * Math.min(t, 1)
}

export default function WhackAMoleGame({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'over'>('ready')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [activeMoles, setActiveMoles] = useState<Map<number, ActiveMole>>(new Map())
  const [hitEffects, setHitEffects] = useState<Map<number, string>>(new Map())

  const spawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const molesRef = useRef(activeMoles)
  molesRef.current = activeMoles

  const clearTimers = useCallback(() => {
    if (spawnTimer.current) clearTimeout(spawnTimer.current)
    if (countdownTimer.current) clearInterval(countdownTimer.current)
    spawnTimer.current = null
    countdownTimer.current = null
  }, [])

  const endGame = useCallback(() => {
    clearTimers()
    // Clear all active mole timeouts
    molesRef.current.forEach(m => clearTimeout(m.timeout))
    setActiveMoles(new Map())
    setPhase('over')
  }, [clearTimers])

  const removeMole = useCallback((pos: number) => {
    setActiveMoles(prev => {
      const next = new Map(prev)
      next.delete(pos)
      return next
    })
  }, [])

  const spawnMole = useCallback(() => {
    setActiveMoles(prev => {
      const elapsed = GAME_DURATION - timeLeft
      const progress = Math.min(elapsed / GAME_DURATION, 1)
      const maxSimultaneous = Math.floor(lerp(1, 4, progress))
      if (prev.size >= maxSimultaneous) return prev

      const available: number[] = []
      for (let i = 0; i < GRID_SIZE; i++) {
        if (!prev.has(i)) available.push(i)
      }
      if (available.length === 0) return prev

      const pos = available[Math.floor(Math.random() * available.length)]
      const industry = Math.floor(Math.random() * INDUSTRIES.length)
      const visibleTime = lerp(1800, 700, progress)

      const timeout = setTimeout(() => removeMole(pos), visibleTime)
      const next = new Map(prev)
      next.set(pos, { industry, spawnedAt: Date.now(), timeout })
      return next
    })
  }, [timeLeft, removeMole])

  const scheduleSpawn = useCallback(() => {
    const elapsed = GAME_DURATION - timeLeft
    const progress = Math.min(elapsed / GAME_DURATION, 1)
    const interval = lerp(1200, 400, progress)

    spawnTimer.current = setTimeout(() => {
      spawnMole()
      scheduleSpawn()
    }, interval)
  }, [timeLeft, spawnMole])

  const startGame = useCallback(() => {
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setActiveMoles(new Map())
    setHitEffects(new Map())
    setPhase('playing')
  }, [])

  // Start countdown and spawning when playing
  useEffect(() => {
    if (phase !== 'playing') return

    countdownTimer.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Initial spawn
    spawnMole()
    scheduleSpawn()

    return () => {
      clearTimers()
      molesRef.current.forEach(m => clearTimeout(m.timeout))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleWhack = useCallback((pos: number) => {
    const mole = molesRef.current.get(pos)
    if (!mole) return

    clearTimeout(mole.timeout)
    const reactionTime = Date.now() - mole.spawnedAt
    const points = reactionTime < 200 ? 15 : 10

    setScore(prev => prev + points)
    setActiveMoles(prev => {
      const next = new Map(prev)
      next.delete(pos)
      return next
    })

    const color = INDUSTRIES[mole.industry].color
    setHitEffects(prev => {
      const next = new Map(prev)
      next.set(pos, color)
      return next
    })
    setTimeout(() => {
      setHitEffects(prev => {
        const next = new Map(prev)
        next.delete(pos)
        return next
      })
    }, 300)
  }, [])

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0A1128 0%, #1a1f3a 100%)' }}
    >
      <style>{`
        @keyframes mole-pop-in {
          0% { transform: scale(0) translateY(20px); opacity: 0; }
          50% { transform: scale(1.2) translateY(-4px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes hit-flash {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.8; }
          100% { transform: scale(0); opacity: 0; }
        }
        .mole-enter { animation: mole-pop-in 0.2s ease-out forwards; }
        .hit-effect { animation: hit-flash 0.3s ease-out forwards; }
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
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display">
            Field Service Frenzy
          </h2>
          <p className="text-gray-400 mb-2 text-sm sm:text-base max-w-md mx-auto">
            Problems are popping up across all four industries! Click or tap to solve them before they disappear.
          </p>
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            {INDUSTRIES.map(ind => (
              <span key={ind.name} className="text-sm" style={{ color: ind.color }}>
                {ind.emoji} {ind.label}
              </span>
            ))}
          </div>
          <button
            onClick={startGame}
            className="bg-magenta hover:bg-magenta-dark text-white font-bold px-8 py-3 rounded-xl text-lg transition-colors"
          >
            Start Game
          </button>
          <p className="text-gray-600 text-xs mt-4">Press Esc to close</p>
        </div>
      )}

      {phase === 'playing' && (
        <div className="text-center px-4">
          <div className="flex justify-between items-center mb-4 max-w-[400px] mx-auto">
            <div className="text-white font-bold text-lg">
              Score: <span className="text-magenta">{score}</span>
            </div>
            <div className={`text-white font-bold text-lg ${timeLeft <= 10 ? 'text-red-400' : ''}`}>
              {timeLeft}s
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-[400px] mx-auto">
            {Array.from({ length: GRID_SIZE }, (_, i) => {
              const mole = activeMoles.get(i)
              const hitColor = hitEffects.get(i)

              return (
                <button
                  key={i}
                  onClick={() => handleWhack(i)}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl border-2 border-white/10 bg-white/5 flex items-center justify-center relative overflow-hidden transition-colors hover:bg-white/10 cursor-pointer"
                  aria-label={mole ? `Whack ${INDUSTRIES[mole.industry].name} problem` : 'Empty hole'}
                >
                  {mole && (
                    <span
                      className="mole-enter text-2xl sm:text-3xl md:text-4xl select-none"
                      style={{ filter: `drop-shadow(0 0 8px ${INDUSTRIES[mole.industry].color})` }}
                    >
                      {INDUSTRIES[mole.industry].emoji}
                    </span>
                  )}
                  {hitColor && (
                    <div
                      className="hit-effect absolute inset-0 rounded-xl"
                      style={{ backgroundColor: hitColor, opacity: 0.4 }}
                    />
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
            Time&apos;s Up!
          </h2>
          <p className="text-6xl sm:text-7xl font-bold text-magenta mb-2 font-display">{score}</p>
          <p className="text-gray-400 mb-1 text-sm">points</p>
          <p className="text-xl font-bold text-white mb-6">
            {getTier(score)}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={startGame}
              className="bg-magenta hover:bg-magenta-dark text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
