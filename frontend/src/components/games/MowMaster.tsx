import { useState, useEffect, useCallback, useRef } from 'react'

const GRID_SIZE = 5
const GAME_DURATION = 30

// Growth stages: 1=freshly mowed, 2=growing, 3=tall (needs mowing), 4=overgrown/dead
type Stage = 1 | 2 | 3 | 4

const STAGE_COLORS: Record<Stage, string> = {
  1: '#86efac', // light green
  2: '#22c55e', // medium green
  3: '#15803d', // dark green
  4: '#92400e', // brown/dead
}

const STAGE_GRASS: Record<Stage, string> = {
  1: '·',
  2: '🌱',
  3: '🌿',
  4: '🍂',
}

const TIERS = [
  { min: 251, label: 'Lawn Legend' },
  { min: 151, label: 'Turf Master' },
  { min: 76, label: 'Crew Lead' },
  { min: 0, label: 'Weekend Warrior' },
]

function getTier(score: number) {
  return TIERS.find(t => score >= t.min)?.label ?? 'Weekend Warrior'
}

export default function MowMaster({ onClose, onBack }: { onClose: () => void; onBack: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'over'>('ready')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [grid, setGrid] = useState<Stage[]>(() => Array(GRID_SIZE * GRID_SIZE).fill(1))
  const [deadCount, setDeadCount] = useState(0)
  const [mowEffects, setMowEffects] = useState<Set<number>>(new Set())

  const growTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const gameStartTime = useRef(0)

  const clearTimers = useCallback(() => {
    if (growTimer.current) clearInterval(growTimer.current)
    if (countdownTimer.current) clearInterval(countdownTimer.current)
    growTimer.current = null
    countdownTimer.current = null
  }, [])

  const startGame = useCallback(() => {
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setGrid(Array(GRID_SIZE * GRID_SIZE).fill(1))
    setDeadCount(0)
    setMowEffects(new Set())
    gameStartTime.current = Date.now()
    setPhase('playing')
  }, [])

  // Grow grass on a dynamic interval
  useEffect(() => {
    if (phase !== 'playing') return

    let growTimeout: ReturnType<typeof setTimeout> | null = null

    const scheduleGrow = () => {
      const elapsed = (Date.now() - gameStartTime.current) / 1000
      const progress = Math.min(elapsed / GAME_DURATION, 1)
      // Growth interval: 3s at start, 1.2s at end
      const interval = 3000 - progress * 1800

      growTimeout = setTimeout(() => {
        setGrid(prev => {
          const next = [...prev]
          // Pick a random subset of tiles to grow (3-5 tiles)
          const count = 3 + Math.floor(Math.random() * 3)
          for (let i = 0; i < count; i++) {
            const idx = Math.floor(Math.random() * next.length)
            if (next[idx] < 4) {
              next[idx] = (next[idx] + 1) as Stage
              if (next[idx] === 4) {
                setDeadCount(prev => prev + 1)
                setScore(prev => prev - 5)
              }
            }
          }
          return next
        })
        scheduleGrow()
      }, interval)
    }

    scheduleGrow()

    return () => {
      if (growTimeout) clearTimeout(growTimeout)
    }
  }, [phase])

  // Countdown
  useEffect(() => {
    if (phase !== 'playing') return

    countdownTimer.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimers()
          setPhase('over')
          return 0
        }
        return prev - 1
      })
    }, 1000)

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

  const handleMow = useCallback((index: number) => {
    setGrid(prev => {
      const stage = prev[index]
      if (stage === 1 || stage === 4) return prev // Can't mow freshly mowed or dead

      const next = [...prev]
      next[index] = 1
      const points = stage === 2 ? 5 : 10 // stage 3 = 10 pts
      setScore(prev => prev + points)

      // Show mow effect
      setMowEffects(prev => {
        const next = new Set(prev)
        next.add(index)
        return next
      })
      setTimeout(() => {
        setMowEffects(prev => {
          const next = new Set(prev)
          next.delete(index)
          return next
        })
      }, 300)

      return next
    })
  }, [])

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0A1128 0%, #1a1f3a 100%)' }}
    >
      <style>{`
        @keyframes mow-flash {
          0% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        .mow-effect { animation: mow-flash 0.3s ease-out forwards; }
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
          <div className="text-6xl mb-4">🌿</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display">
            Mow Master
          </h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base max-w-md mx-auto">
            Keep the lawn tidy! Mow tiles before they overgrow. Stage 3 tiles earn more points. Don't let them die!
          </p>
          <button
            onClick={startGame}
            className="text-white font-bold px-8 py-3 rounded-xl text-lg transition-colors cursor-pointer"
            style={{ backgroundColor: '#22c55e' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Start Game
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
          <div className="flex justify-between items-center mb-3 max-w-[350px] mx-auto">
            <div className="text-white font-bold text-lg">
              Score: <span style={{ color: '#22c55e' }}>{score}</span>
            </div>
            <div className="text-gray-400 text-sm">
              Dead: <span className="text-red-400">{deadCount}</span>
            </div>
            <div className={`text-white font-bold text-lg ${timeLeft <= 10 ? 'text-red-400' : ''}`}>
              {timeLeft}s
            </div>
          </div>

          <div className="grid gap-1.5 sm:gap-2 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, maxWidth: '350px' }}>
            {grid.map((stage, i) => (
              <button
                key={i}
                onClick={() => handleMow(i)}
                disabled={stage === 1 || stage === 4}
                className="relative aspect-square rounded-lg flex items-center justify-center text-xl sm:text-2xl transition-all duration-200 cursor-pointer disabled:cursor-default overflow-hidden"
                style={{
                  backgroundColor: STAGE_COLORS[stage],
                  opacity: stage === 4 ? 0.6 : 1,
                  border: stage === 3 ? '2px solid #fbbf24' : '2px solid transparent',
                  boxShadow: stage === 3 ? '0 0 8px rgba(251, 191, 36, 0.4)' : 'none',
                }}
                aria-label={`Tile ${i + 1}, stage ${stage}`}
              >
                <span className="select-none" style={{ transform: `scale(${0.6 + stage * 0.2})` }}>
                  {STAGE_GRASS[stage]}
                </span>
                {mowEffects.has(i) && (
                  <div className="mow-effect absolute inset-0 rounded-lg bg-white/40" />
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: STAGE_COLORS[1] }} /> Mowed</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: STAGE_COLORS[2] }} /> Growing</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: STAGE_COLORS[3] }} /> Tall</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: STAGE_COLORS[4] }} /> Dead</span>
          </div>
        </div>
      )}

      {phase === 'over' && (
        <div className="text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display">
            Time's Up!
          </h2>
          <p className="text-6xl sm:text-7xl font-bold mb-2 font-display" style={{ color: '#22c55e' }}>
            {score}
          </p>
          <p className="text-gray-400 mb-1 text-sm">points ({deadCount} dead tiles)</p>
          <p className="text-xl font-bold text-white mb-6">{getTier(score)}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={startGame}
              className="text-white font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
              style={{ backgroundColor: '#22c55e' }}
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
