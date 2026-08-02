import { useState, useEffect, useCallback, useRef } from 'react'

interface Bug {
  id: number
  emoji: string
  x: number
  y: number
  targetX: number
  targetY: number
  startTime: number
  duration: number
}

const BUG_EMOJIS = ['🐛', '🪲', '🐜', '🕷️', '🪳']
const GAME_DURATION = 30
const CENTER = 50 // percentage
const CENTER_ZONE = 12 // percentage radius for "reached center"

const TIERS = [
  { min: 301, label: 'Pest Control Legend' },
  { min: 201, label: 'Senior Exterminator' },
  { min: 101, label: 'Licensed Tech' },
  { min: 0, label: 'Trainee' },
]

function getTier(score: number) {
  return TIERS.find(t => score >= t.min)?.label ?? 'Trainee'
}

function randomEdgePosition(): { x: number; y: number } {
  const side = Math.floor(Math.random() * 4)
  switch (side) {
    case 0: return { x: Math.random() * 100, y: -5 } // top
    case 1: return { x: 105, y: Math.random() * 100 } // right
    case 2: return { x: Math.random() * 100, y: 105 } // bottom
    default: return { x: -5, y: Math.random() * 100 } // left
  }
}

export default function BugBlaster({ onClose, onBack }: { onClose: () => void; onBack: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'over'>('ready')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [lives, setLives] = useState(3)
  const [bugs, setBugs] = useState<Bug[]>([])
  const [splats, setSplats] = useState<{ id: number; x: number; y: number }[]>([])

  const nextId = useRef(0)
  const spawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const frameRef = useRef<number | null>(null)
  const livesRef = useRef(lives)
  const bugsRef = useRef(bugs)
  const gameStartTime = useRef(0)
  livesRef.current = lives
  bugsRef.current = bugs

  const clearTimers = useCallback(() => {
    if (spawnTimer.current) clearTimeout(spawnTimer.current)
    if (countdownTimer.current) clearInterval(countdownTimer.current)
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    spawnTimer.current = null
    countdownTimer.current = null
    frameRef.current = null
  }, [])

  const endGame = useCallback(() => {
    clearTimers()
    setBugs([])
    setPhase('over')
  }, [clearTimers])

  const endGameRef = useRef(endGame)
  endGameRef.current = endGame

  // Animation loop: update bug positions and check if they reached center
  const animate = useCallback(() => {
    const now = Date.now()
    setBugs(prev => {
      let lostLife = false
      const remaining = prev.filter(bug => {
        const elapsed = now - bug.startTime
        const progress = Math.min(elapsed / bug.duration, 1)
        if (progress >= 1) {
          lostLife = true
          return false
        }
        return true
      })

      if (lostLife) {
        setLives(prev => {
          const newLives = prev - 1
          if (newLives <= 0) {
            setTimeout(() => endGameRef.current(), 0)
            return 0
          }
          return newLives
        })
      }

      return remaining
    })

    frameRef.current = requestAnimationFrame(animate)
  }, [])

  const spawnBug = useCallback(() => {
    const { x, y } = randomEdgePosition()
    const emoji = BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)]
    const elapsed = (Date.now() - gameStartTime.current) / 1000
    const progress = Math.min(elapsed / GAME_DURATION, 1)
    // Crawl duration: 4s at start, 2s at end
    const duration = 4000 - progress * 2000

    const bug: Bug = {
      id: nextId.current++,
      emoji,
      x,
      y,
      targetX: CENTER + (Math.random() - 0.5) * CENTER_ZONE,
      targetY: CENTER + (Math.random() - 0.5) * CENTER_ZONE,
      startTime: Date.now(),
      duration,
    }
    setBugs(prev => [...prev, bug])
  }, [])

  const scheduleSpawn = useCallback(() => {
    const elapsed = (Date.now() - gameStartTime.current) / 1000
    const progress = Math.min(elapsed / GAME_DURATION, 1)
    // Spawn interval: 1.5s at start, 0.4s at end
    const interval = 1500 - progress * 1100

    spawnTimer.current = setTimeout(() => {
      if (livesRef.current > 0) {
        spawnBug()
        scheduleSpawn()
      }
    }, interval)
  }, [spawnBug])

  const startGame = useCallback(() => {
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setLives(3)
    setBugs([])
    setSplats([])
    nextId.current = 0
    gameStartTime.current = Date.now()
    setPhase('playing')
  }, [])

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

    spawnBug()
    scheduleSpawn()
    frameRef.current = requestAnimationFrame(animate)

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

  const handleSquash = useCallback((bugId: number) => {
    const bug = bugsRef.current.find(b => b.id === bugId)
    if (!bug) return

    const now = Date.now()
    const elapsed = now - bug.startTime
    const progress = Math.min(elapsed / bug.duration, 1)
    const currentX = bug.x + (bug.targetX - bug.x) * progress
    const currentY = bug.y + (bug.targetY - bug.y) * progress

    setScore(prev => prev + 10)
    setBugs(prev => prev.filter(b => b.id !== bugId))

    const splatId = bugId
    setSplats(prev => [...prev, { id: splatId, x: currentX, y: currentY }])
    setTimeout(() => {
      setSplats(prev => prev.filter(s => s.id !== splatId))
    }, 400)
  }, [])

  const now = Date.now()

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0A1128 0%, #1a1f3a 100%)' }}
    >
      <style>{`
        @keyframes splat {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .splat-effect { animation: splat 0.4s ease-out forwards; }
        @keyframes pulse-heart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
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
          <div className="text-6xl mb-4">🪲</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display">
            Bug Blaster
          </h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base max-w-md mx-auto">
            Bugs are invading! Tap them before they reach the house. You have 3 lives and 30 seconds. Go!
          </p>
          <button
            onClick={startGame}
            className="text-white font-bold px-8 py-3 rounded-xl text-lg transition-colors cursor-pointer"
            style={{ backgroundColor: '#E8005E' }}
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
        <div className="w-full h-full flex flex-col items-center justify-center px-4">
          <div className="flex justify-between items-center mb-2 w-full max-w-[400px]">
            <div className="text-white font-bold text-lg">
              Score: <span style={{ color: '#E8005E' }}>{score}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 3 }, (_, i) => (
                <span key={i} className="text-xl" style={{ opacity: i < lives ? 1 : 0.2 }}>
                  ❤️
                </span>
              ))}
            </div>
            <div className={`text-white font-bold text-lg ${timeLeft <= 10 ? 'text-red-400' : ''}`}>
              {timeLeft}s
            </div>
          </div>

          <div
            className="relative rounded-2xl border-2 overflow-hidden"
            style={{
              width: 'min(90vw, 400px)',
              height: 'min(90vw, 400px)',
              borderColor: '#E8005E33',
              background: 'radial-gradient(circle at center, #1a2a1a 0%, #0A1128 70%)',
            }}
          >
            {/* House in center */}
            <div
              className="absolute text-4xl select-none"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.3))',
              }}
            >
              🏠
            </div>

            {/* Center danger zone indicator */}
            <div
              className="absolute rounded-full"
              style={{
                left: '50%',
                top: '50%',
                width: `${CENTER_ZONE * 2}%`,
                height: `${CENTER_ZONE * 2}%`,
                transform: 'translate(-50%, -50%)',
                border: '1px dashed rgba(232, 0, 94, 0.2)',
              }}
            />

            {/* Bugs */}
            {bugs.map(bug => {
              const elapsed = now - bug.startTime
              const progress = Math.min(elapsed / bug.duration, 1)
              const currentX = bug.x + (bug.targetX - bug.x) * progress
              const currentY = bug.y + (bug.targetY - bug.y) * progress

              return (
                <button
                  key={bug.id}
                  onClick={() => handleSquash(bug.id)}
                  className="absolute cursor-pointer hover:scale-125 transition-transform"
                  style={{
                    left: `${currentX}%`,
                    top: `${currentY}%`,
                    transform: 'translate(-50%, -50%)',
                    fontSize: 'clamp(1.5rem, 6vw, 2rem)',
                    zIndex: 10,
                    background: 'none',
                    border: 'none',
                    padding: '8px',
                    lineHeight: 1,
                  }}
                  aria-label={`Squash bug`}
                >
                  {bug.emoji}
                </button>
              )
            })}

            {/* Splat effects */}
            {splats.map(splat => (
              <div
                key={splat.id}
                className="splat-effect absolute pointer-events-none"
                style={{
                  left: `${splat.x}%`,
                  top: `${splat.y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: '2rem',
                }}
              >
                💥
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'over' && (
        <div className="text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display">
            {lives === 0 ? 'Overrun!' : "Time's Up!"}
          </h2>
          <p className="text-6xl sm:text-7xl font-bold mb-2 font-display" style={{ color: '#E8005E' }}>
            {score}
          </p>
          <p className="text-gray-400 mb-1 text-sm">points</p>
          <p className="text-xl font-bold text-white mb-6">{getTier(score)}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={startGame}
              className="text-white font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
              style={{ backgroundColor: '#E8005E' }}
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
