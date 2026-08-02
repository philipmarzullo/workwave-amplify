import { useState, useEffect, useCallback, useRef } from 'react'

const GRID_SIZE = 5
const GAME_DURATION = 30
const COVERAGE_LIMIT = 0.6 // 60% = game over

interface Spill {
  type: 'coffee' | 'water' | 'juice'
  clusterId: number
}

const SPILL_CONFIG = {
  coffee: { emoji: '☕', color: '#92400e' },
  water: { emoji: '💧', color: '#3b82f6' },
  juice: { emoji: '🧃', color: '#f97316' },
}

const SPILL_TYPES = ['coffee', 'water', 'juice'] as const

const TIERS = [
  { min: 251, label: 'Spill Squad Legend' },
  { min: 161, label: 'Sanitation Pro' },
  { min: 81, label: 'Floor Tech' },
  { min: 0, label: 'Trainee Cleaner' },
]

function getTier(score: number) {
  return TIERS.find(t => score >= t.min)?.label ?? 'Trainee Cleaner'
}

function getAdjacentIndices(index: number): number[] {
  const row = Math.floor(index / GRID_SIZE)
  const col = index % GRID_SIZE
  const adj: number[] = []
  if (row > 0) adj.push(index - GRID_SIZE)
  if (row < GRID_SIZE - 1) adj.push(index + GRID_SIZE)
  if (col > 0) adj.push(index - 1)
  if (col < GRID_SIZE - 1) adj.push(index + 1)
  return adj
}

export default function SpillSquad({ onClose, onBack }: { onClose: () => void; onBack: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'over'>('ready')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [grid, setGrid] = useState<(Spill | null)[]>(() => Array(GRID_SIZE * GRID_SIZE).fill(null))
  const [sparkles, setSparkles] = useState<Set<number>>(new Set())
  const [gameOverReason, setGameOverReason] = useState<'time' | 'overflow'>('time')

  const nextClusterId = useRef(0)
  const spawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const spreadTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const gameStartTime = useRef(0)
  const gridRef = useRef(grid)
  gridRef.current = grid

  const clearTimers = useCallback(() => {
    if (spawnTimer.current) clearTimeout(spawnTimer.current)
    if (spreadTimer.current) clearInterval(spreadTimer.current)
    if (countdownTimer.current) clearInterval(countdownTimer.current)
    spawnTimer.current = null
    spreadTimer.current = null
    countdownTimer.current = null
  }, [])

  const endGame = useCallback((reason: 'time' | 'overflow') => {
    clearTimers()
    setGameOverReason(reason)
    setPhase('over')
  }, [clearTimers])

  const endGameRef = useRef(endGame)
  endGameRef.current = endGame

  const spawnSpill = useCallback(() => {
    setGrid(prev => {
      const emptyIndices = prev.map((cell, i) => cell === null ? i : -1).filter(i => i >= 0)
      if (emptyIndices.length === 0) return prev

      const position = emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
      const type = SPILL_TYPES[Math.floor(Math.random() * SPILL_TYPES.length)]
      const clusterId = nextClusterId.current++

      const next = [...prev]
      next[position] = { type, clusterId }
      return next
    })
  }, [])

  const scheduleSpawn = useCallback(() => {
    const elapsed = (Date.now() - gameStartTime.current) / 1000
    const progress = Math.min(elapsed / GAME_DURATION, 1)
    // Spawn interval: 3s at start, 1s at end
    const interval = 3000 - progress * 2000

    spawnTimer.current = setTimeout(() => {
      spawnSpill()
      scheduleSpawn()
    }, interval)
  }, [spawnSpill])

  const startGame = useCallback(() => {
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setGrid(Array(GRID_SIZE * GRID_SIZE).fill(null))
    setSparkles(new Set())
    setGameOverReason('time')
    nextClusterId.current = 0
    gameStartTime.current = Date.now()
    setPhase('playing')
  }, [])

  // Spread existing spills
  useEffect(() => {
    if (phase !== 'playing') return

    spreadTimer.current = setInterval(() => {
      setGrid(prev => {
        const next = [...prev]
        let changed = false

        // Group tiles by cluster
        const clusters = new Map<number, number[]>()
        prev.forEach((cell, i) => {
          if (cell) {
            const existing = clusters.get(cell.clusterId) || []
            existing.push(i)
            clusters.set(cell.clusterId, existing)
          }
        })

        // Each cluster can spread to one adjacent tile (max 3 tiles per cluster)
        clusters.forEach((tiles, clusterId) => {
          if (tiles.length >= 3) return // Max cluster size

          // Find all adjacent empty tiles
          const adjacentEmpty: number[] = []
          tiles.forEach(tileIdx => {
            getAdjacentIndices(tileIdx).forEach(adj => {
              if (next[adj] === null && !adjacentEmpty.includes(adj)) {
                adjacentEmpty.push(adj)
              }
            })
          })

          if (adjacentEmpty.length > 0) {
            const spreadTo = adjacentEmpty[Math.floor(Math.random() * adjacentEmpty.length)]
            const sourceCell = prev[tiles[0]]!
            next[spreadTo] = { type: sourceCell.type, clusterId }
            changed = true
          }
        })

        if (changed) {
          // Check coverage
          const spillCount = next.filter(c => c !== null).length
          const totalTiles = GRID_SIZE * GRID_SIZE
          if (spillCount / totalTiles >= COVERAGE_LIMIT) {
            setTimeout(() => endGameRef.current('overflow'), 0)
          }
        }

        return changed ? next : prev
      })
    }, 2000)

    return () => {
      if (spreadTimer.current) clearInterval(spreadTimer.current)
    }
  }, [phase])

  // Countdown and spawning
  useEffect(() => {
    if (phase !== 'playing') return

    countdownTimer.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame('time')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Initial spills
    spawnSpill()
    setTimeout(() => spawnSpill(), 500)
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

  const handleMop = useCallback((index: number) => {
    const cell = gridRef.current[index]
    if (!cell) return

    setScore(prev => prev + 10)
    setGrid(prev => {
      const next = [...prev]
      next[index] = null
      return next
    })

    // Sparkle effect
    setSparkles(prev => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
    setTimeout(() => {
      setSparkles(prev => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
    }, 400)
  }, [])

  const spillCount = grid.filter(c => c !== null).length
  const coveragePercent = Math.round((spillCount / (GRID_SIZE * GRID_SIZE)) * 100)

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0A1128 0%, #1a1f3a 100%)' }}
    >
      <style>{`
        @keyframes sparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.3) rotate(180deg); opacity: 0.8; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        .sparkle-effect { animation: sparkle 0.4s ease-out forwards; }
        @keyframes spill-appear {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .spill-enter { animation: spill-appear 0.3s ease-out forwards; }
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
          <div className="text-6xl mb-4">🧹</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display">
            Spill Squad
          </h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base max-w-md mx-auto">
            Spills are spreading! Mop them up before they cover 60% of the floor. Clean fast, clean smart!
          </p>
          <button
            onClick={startGame}
            className="text-white font-bold px-8 py-3 rounded-xl text-lg transition-colors cursor-pointer"
            style={{ backgroundColor: '#8B3DFF' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Start Cleaning
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
              Score: <span style={{ color: '#8B3DFF' }}>{score}</span>
            </div>
            <div className={`text-sm font-bold ${coveragePercent >= 40 ? 'text-red-400' : 'text-gray-400'}`}>
              {coveragePercent}% covered
            </div>
            <div className={`text-white font-bold text-lg ${timeLeft <= 10 ? 'text-red-400' : ''}`}>
              {timeLeft}s
            </div>
          </div>

          {/* Coverage bar */}
          <div className="max-w-[350px] mx-auto mb-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${coveragePercent}%`,
                backgroundColor: coveragePercent >= 40 ? '#ef4444' : '#8B3DFF',
              }}
            />
          </div>

          <div className="grid gap-1.5 sm:gap-2 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, maxWidth: '350px' }}>
            {grid.map((cell, i) => (
              <button
                key={i}
                onClick={() => handleMop(i)}
                disabled={!cell}
                className="relative aspect-square rounded-lg flex items-center justify-center text-xl sm:text-2xl transition-all duration-200 cursor-pointer disabled:cursor-default overflow-hidden"
                style={{
                  backgroundColor: cell ? SPILL_CONFIG[cell.type].color + '33' : '#1e293b',
                  border: cell ? `2px solid ${SPILL_CONFIG[cell.type].color}55` : '1px solid #334155',
                }}
                aria-label={cell ? `Mop ${cell.type} spill` : 'Clean tile'}
              >
                {/* Tile pattern for clean tiles */}
                {!cell && (
                  <span className="text-gray-700/30 text-xs select-none">◻</span>
                )}

                {cell && (
                  <span className="spill-enter select-none">
                    {SPILL_CONFIG[cell.type].emoji}
                  </span>
                )}

                {sparkles.has(i) && (
                  <div className="sparkle-effect absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'over' && (
        <div className="text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display">
            {gameOverReason === 'overflow' ? 'Floor Flooded!' : "Time's Up!"}
          </h2>
          <p className="text-6xl sm:text-7xl font-bold mb-2 font-display" style={{ color: '#8B3DFF' }}>
            {score}
          </p>
          <p className="text-gray-400 mb-1 text-sm">points</p>
          <p className="text-xl font-bold text-white mb-6">{getTier(score)}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={startGame}
              className="text-white font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
              style={{ backgroundColor: '#8B3DFF' }}
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
