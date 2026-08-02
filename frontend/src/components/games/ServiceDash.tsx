import { useState, useEffect, useCallback, useRef } from 'react'

const GAME_COLOR = '#22c55e'
const PLAY_W = 340
const PLAY_H = 520
const LANES = 3
const LANE_W = PLAY_W / LANES
const VAN_Y = PLAY_H - 70

const OBSTACLES = ['🪲', '🌿', '🔦', '🚽']
const TICKET = '⭐'

const TIERS = [
  { min: 2000, label: 'Fleet Commander' },
  { min: 1000, label: 'Route Pro' },
  { min: 500, label: 'Dispatcher' },
  { min: 0, label: 'Trainee' },
]

interface Item {
  id: number
  lane: number
  y: number
  type: 'obstacle' | 'ticket'
  emoji: string
  hit: boolean
}

function getTier(s: number) {
  return TIERS.find(t => s >= t.min)?.label ?? 'Trainee'
}

export default function ServiceDash({
  onClose,
  onBack,
}: {
  onClose: () => void
  onBack: () => void
}) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'over'>('ready')
  const [displayScore, setDisplayScore] = useState(0)
  const [displayLives, setDisplayLives] = useState(3)
  const [lane, setLane] = useState(1)
  const [items, setItems] = useState<Item[]>([])
  const [hitFlash, setHitFlash] = useState(false)
  const [collectFlash, setCollectFlash] = useState(false)
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('serviceDashHi') || '0', 10)
    } catch {
      return 0
    }
  })

  const frameRef = useRef(0)
  const laneRef = useRef(1)
  const livesRef = useRef(3)
  const scoreRef = useRef(0)
  const itemsRef = useRef<Item[]>([])
  const nextIdRef = useRef(0)
  const gameStartRef = useRef(0)
  const lastSpawnRef = useRef(0)
  const lastFrameRef = useRef(0)
  const phaseRef = useRef(phase)
  const invulnUntilRef = useRef(0)

  laneRef.current = lane
  phaseRef.current = phase

  const clearGame = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
  }, [])

  const endGame = useCallback(() => {
    clearGame()
    const finalScore = scoreRef.current
    setDisplayScore(finalScore)
    setPhase('over')
    try {
      const prev = parseInt(localStorage.getItem('serviceDashHi') || '0', 10)
      if (finalScore > prev) {
        localStorage.setItem('serviceDashHi', String(finalScore))
        setHighScore(finalScore)
      }
    } catch {
      /* ignore */
    }
  }, [clearGame])

  const endGameRef = useRef(endGame)
  endGameRef.current = endGame

  const gameLoop = useCallback(() => {
    const now = Date.now()
    const dt = Math.min(now - lastFrameRef.current, 33) / 1000
    lastFrameRef.current = now

    const elapsed = (now - gameStartRef.current) / 1000
    const progress = Math.min(elapsed / 90, 1)
    const speed = 180 + progress * 280
    const spawnInterval = 1100 - progress * 700

    // Spawn
    if (now - lastSpawnRef.current > spawnInterval) {
      lastSpawnRef.current = now
      const isTicket = Math.random() < 0.22
      itemsRef.current.push({
        id: nextIdRef.current++,
        lane: Math.floor(Math.random() * LANES),
        y: -40,
        type: isTicket ? 'ticket' : 'obstacle',
        emoji: isTicket ? TICKET : OBSTACLES[Math.floor(Math.random() * OBSTACLES.length)],
        hit: false,
      })
    }

    // Move and check collisions
    const playerLane = laneRef.current
    let lostLife = false
    let collected = false

    for (const item of itemsRef.current) {
      item.y += speed * dt

      if (
        !item.hit &&
        item.lane === playerLane &&
        Math.abs(item.y - VAN_Y) < 28
      ) {
        item.hit = true
        if (item.type === 'obstacle' && now > invulnUntilRef.current) {
          livesRef.current--
          invulnUntilRef.current = now + 500
          lostLife = true
          if (livesRef.current <= 0) {
            setTimeout(() => endGameRef.current(), 0)
            setDisplayLives(0)
            setItems([...itemsRef.current])
            return
          }
        } else if (item.type === 'ticket') {
          scoreRef.current += 25
          collected = true
        }
      }
    }

    // Remove off-screen items
    itemsRef.current = itemsRef.current.filter(i => i.y < PLAY_H + 50)

    // Distance score
    scoreRef.current += 1

    // Sync to React state
    setItems([...itemsRef.current])
    setDisplayScore(scoreRef.current)
    if (lostLife) {
      setDisplayLives(livesRef.current)
      setHitFlash(true)
      setTimeout(() => setHitFlash(false), 200)
    }
    if (collected) {
      setCollectFlash(true)
      setTimeout(() => setCollectFlash(false), 150)
    }

    frameRef.current = requestAnimationFrame(gameLoop)
  }, [])

  const startGame = useCallback(() => {
    clearGame()
    scoreRef.current = 0
    livesRef.current = 3
    itemsRef.current = []
    nextIdRef.current = 0
    invulnUntilRef.current = 0
    gameStartRef.current = Date.now()
    lastSpawnRef.current = Date.now()
    lastFrameRef.current = Date.now()
    setDisplayScore(0)
    setDisplayLives(3)
    setLane(1)
    laneRef.current = 1
    setItems([])
    setHitFlash(false)
    setCollectFlash(false)
    setPhase('playing')
  }, [clearGame])

  useEffect(() => {
    if (phase !== 'playing') return
    frameRef.current = requestAnimationFrame(gameLoop)
    return () => clearGame()
  }, [phase, gameLoop, clearGame])

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (phaseRef.current !== 'playing') return
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault()
        setLane(prev => {
          const n = Math.max(0, prev - 1)
          laneRef.current = n
          return n
        })
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault()
        setLane(prev => {
          const n = Math.min(LANES - 1, prev + 1)
          laneRef.current = n
          return n
        })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Touch / click
  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (phaseRef.current !== 'playing') return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    if (clientX - rect.left < rect.width / 2) {
      setLane(prev => {
        const n = Math.max(0, prev - 1)
        laneRef.current = n
        return n
      })
    } else {
      setLane(prev => {
        const n = Math.min(LANES - 1, prev + 1)
        laneRef.current = n
        return n
      })
    }
  }, [])

  const vanX = lane * LANE_W + LANE_W / 2

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0A1128 0%, #1a1f3a 100%)' }}
    >
      <style>{`
        @keyframes road-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 60px; }
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
          <div className="text-6xl mb-4">🚐</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display">
            Service Dash
          </h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base max-w-md mx-auto">
            Dodge pests 🪲, overgrowth 🌿, flashlights 🔦, and toilets 🚽 as your service van
            races through the field. Collect ⭐ for bonus points!
          </p>
          <button
            onClick={startGame}
            className="text-white font-bold px-8 py-3 rounded-xl text-lg transition-colors cursor-pointer"
            style={{ backgroundColor: GAME_COLOR }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Start Game
          </button>
          {highScore > 0 && <p className="text-gray-500 text-sm mt-3">Best: {highScore}</p>}
          <div className="mt-4">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer"
            >
              ← Back to Arcade
            </button>
          </div>
        </div>
      )}

      {phase === 'playing' && (
        <div className="w-full h-full flex flex-col items-center justify-center px-4">
          <div
            className="flex justify-between items-center mb-2 w-full"
            style={{ maxWidth: `${PLAY_W}px` }}
          >
            <div className="text-white font-bold text-lg">
              <span style={{ color: GAME_COLOR }}>{displayScore}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 3 }, (_, i) => (
                <span key={i} className="text-lg" style={{ opacity: i < displayLives ? 1 : 0.2 }}>
                  ❤️
                </span>
              ))}
            </div>
            {highScore > 0 && <div className="text-gray-500 text-sm">HI: {highScore}</div>}
          </div>

          <div
            className="relative rounded-2xl overflow-hidden select-none"
            style={{
              width: `min(92vw, ${PLAY_W}px)`,
              height: `min(120vw, ${PLAY_H}px)`,
              border: hitFlash
                ? '2px solid #ef4444'
                : collectFlash
                  ? `2px solid ${GAME_COLOR}`
                  : '2px solid #ffffff11',
              background: '#111827',
              transition: 'border-color 0.1s',
            }}
            onClick={handleTap}
          >
            {/* Lane dividers */}
            {[1, 2].map(i => (
              <div
                key={i}
                className="absolute top-0 h-full"
                style={{
                  left: `${(i / LANES) * 100}%`,
                  width: '2px',
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, #ffffff22 0px, #ffffff22 20px, transparent 20px, transparent 40px)',
                  animation: 'road-scroll 0.4s linear infinite',
                }}
              />
            ))}

            {/* Items */}
            {items.map(item => (
              <div
                key={item.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${((item.lane * LANE_W + LANE_W / 2) / PLAY_W) * 100}%`,
                  top: `${(item.y / PLAY_H) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: item.type === 'ticket' ? '1.5rem' : '1.8rem',
                  opacity: item.hit ? 0.3 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {item.emoji}
              </div>
            ))}

            {/* Van */}
            <div
              className="absolute"
              style={{
                left: `${((vanX) / PLAY_W) * 100}%`,
                top: `${(VAN_Y / PLAY_H) * 100}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: '2.2rem',
                transition: 'left 0.1s ease-out',
                filter: hitFlash ? 'brightness(2) saturate(0)' : 'none',
              }}
            >
              🚐
            </div>
          </div>

          <div className="text-gray-600 text-xs mt-2">← → or tap to dodge</div>
        </div>
      )}

      {phase === 'over' && (
        <div className="text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display">
            Game Over!
          </h2>
          <p
            className="text-6xl sm:text-7xl font-bold mb-2 font-display"
            style={{ color: GAME_COLOR }}
          >
            {displayScore}
          </p>
          <p className="text-gray-400 mb-1 text-sm">
            {displayScore > 0 && displayScore >= highScore ? 'New best!' : 'points'}
          </p>
          <p className="text-xl font-bold text-white mb-6">{getTier(displayScore)}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={startGame}
              className="text-white font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
              style={{ backgroundColor: GAME_COLOR }}
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
