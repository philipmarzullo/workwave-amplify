import { useState, useEffect, useCallback, useRef } from 'react'

const GAME_COLOR = '#22c55e'
const PLAY_SIZE = 400
const STOP_RADIUS = 18
const MIN_STOP_DISTANCE = 60
const ROUND_END_DURATION = 2500
const ROUNDS = [
  { round: 1, stops: 4, time: 15 },
  { round: 2, stops: 5, time: 15 },
  { round: 3, stops: 6, time: 15 },
  { round: 4, stops: 7, time: 15 },
  { round: 5, stops: 8, time: 15 },
]

const TIERS = [
  { min: 500, label: 'Fleet Commander' },
  { min: 350, label: 'Route Pro' },
  { min: 200, label: 'Dispatcher' },
  { min: 0, label: 'Trainee' },
]

interface Stop {
  id: number
  x: number
  y: number
}

const DEPOT = { x: PLAY_SIZE / 2, y: PLAY_SIZE - 30 }

function getTier(score: number) {
  return TIERS.find(t => score >= t.min)?.label ?? 'Trainee'
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function totalRouteDistance(route: Stop[], depot: { x: number; y: number }) {
  if (route.length === 0) return 0
  let d = distance(depot, route[0])
  for (let i = 1; i < route.length; i++) {
    d += distance(route[i - 1], route[i])
  }
  d += distance(route[route.length - 1], depot)
  return d
}

function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr]
  const result: T[][] = []
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
    for (const perm of permutations(rest)) {
      result.push([arr[i], ...perm])
    }
  }
  return result
}

function findOptimalRoute(stops: Stop[], depot: { x: number; y: number }): Stop[] {
  let bestRoute = stops
  let bestDist = Infinity
  for (const perm of permutations(stops)) {
    const d = totalRouteDistance(perm, depot)
    if (d < bestDist) {
      bestDist = d
      bestRoute = perm
    }
  }
  return bestRoute
}

function generateStops(count: number): Stop[] {
  const stops: Stop[] = []
  const margin = 30
  const maxAttempts = 200
  for (let i = 0; i < count; i++) {
    let attempts = 0
    while (attempts < maxAttempts) {
      const x = margin + Math.random() * (PLAY_SIZE - margin * 2)
      const y = margin + Math.random() * (PLAY_SIZE - margin * 2 - 40) // leave room for depot
      const tooClose =
        stops.some(s => distance(s, { x, y }) < MIN_STOP_DISTANCE) ||
        distance({ x, y }, DEPOT) < MIN_STOP_DISTANCE
      if (!tooClose) {
        stops.push({ id: i, x, y })
        break
      }
      attempts++
    }
    if (stops.length <= i) {
      // fallback: just place it
      stops.push({
        id: i,
        x: margin + Math.random() * (PLAY_SIZE - margin * 2),
        y: margin + Math.random() * (PLAY_SIZE - margin * 2 - 40),
      })
    }
  }
  return stops
}

export default function RouteRunner({
  onClose,
  onBack,
}: {
  onClose: () => void
  onBack: () => void
}) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'roundEnd' | 'over'>('ready')
  const [totalScore, setTotalScore] = useState(0)
  const [roundIndex, setRoundIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [stops, setStops] = useState<Stop[]>([])
  const [visited, setVisited] = useState<Stop[]>([])
  const [optimalRoute, setOptimalRoute] = useState<Stop[]>([])
  const [roundScore, setRoundScore] = useState(0)
  const [roundEfficiency, setRoundEfficiency] = useState(0)

  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const roundEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const endingRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (countdownTimer.current) clearInterval(countdownTimer.current)
    if (roundEndTimer.current) clearTimeout(roundEndTimer.current)
    countdownTimer.current = null
    roundEndTimer.current = null
  }, [])

  const endRound = useCallback(
    (visitedStops: Stop[], allStops: Stop[], currentRoundIndex: number) => {
      if (endingRef.current) return
      endingRef.current = true
      clearTimers()

      const optimal = findOptimalRoute(allStops, DEPOT)
      setOptimalRoute(optimal)

      const playerDist = totalRouteDistance(visitedStops, DEPOT)
      const optimalDist = totalRouteDistance(optimal, DEPOT)

      const completionRatio = visitedStops.length / allStops.length
      const efficiency =
        visitedStops.length === 0
          ? 0
          : optimalDist > 0
            ? Math.min(1, optimalDist / playerDist)
            : 1
      const basePoints = Math.round(efficiency * completionRatio * 100)
      const timeBonus = Math.round(
        (countdownTimer.current !== null ? 0 : 1) * 20 * (visitedStops.length === allStops.length ? 1 : 0)
      )
      const points = basePoints + timeBonus

      setRoundScore(points)
      setRoundEfficiency(Math.round(efficiency * completionRatio * 100))
      setTotalScore(prev => prev + points)
      setPhase('roundEnd')

      roundEndTimer.current = setTimeout(() => {
        if (currentRoundIndex >= ROUNDS.length - 1) {
          setPhase('over')
        } else {
          setRoundIndex(currentRoundIndex + 1)
          endingRef.current = false
        }
      }, ROUND_END_DURATION)
    },
    [clearTimers]
  )

  const endRoundRef = useRef(endRound)
  endRoundRef.current = endRound

  const startRound = useCallback(
    (rIndex: number) => {
      clearTimers()
      endingRef.current = false
      const config = ROUNDS[rIndex]
      const newStops = generateStops(config.stops)
      setStops(newStops)
      setVisited([])
      setOptimalRoute([])
      setTimeLeft(config.time)
      setPhase('playing')
    },
    [clearTimers]
  )

  // Start round when roundIndex changes during play
  useEffect(() => {
    if (phase === 'playing' || phase === 'roundEnd') {
      // Only start if transitioning from roundEnd
    }
    if (phase !== 'over' && phase !== 'ready' && !endingRef.current) {
      startRound(roundIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex])

  // Countdown timer
  useEffect(() => {
    if (phase !== 'playing') return

    countdownTimer.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up — end round with current visited stops
          setTimeout(() => {
            endRoundRef.current(
              visitedRef.current,
              stopsRef.current,
              roundIndexRef.current
            )
          }, 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (countdownTimer.current) clearInterval(countdownTimer.current)
      countdownTimer.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, roundIndex])

  const visitedRef = useRef(visited)
  visitedRef.current = visited
  const stopsRef = useRef(stops)
  stopsRef.current = stops
  const roundIndexRef = useRef(roundIndex)
  roundIndexRef.current = roundIndex

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleStopClick = useCallback(
    (stop: Stop) => {
      if (phase !== 'playing') return
      // Can't click already visited
      if (visitedRef.current.some(v => v.id === stop.id)) return

      const newVisited = [...visitedRef.current, stop]
      setVisited(newVisited)

      // If all stops visited, end round
      if (newVisited.length === stopsRef.current.length) {
        endRoundRef.current(newVisited, stopsRef.current, roundIndexRef.current)
      }
    },
    [phase]
  )

  const startGame = useCallback(() => {
    setTotalScore(0)
    setRoundIndex(0)
    endingRef.current = false
    startRound(0)
  }, [startRound])

  // Build route path points for SVG
  const buildPathPoints = (route: Stop[], depot: { x: number; y: number }) => {
    if (route.length === 0) return ''
    const points = [depot, ...route, depot]
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  }

  const playerPath = buildPathPoints(visited, DEPOT)
  const optimalPath = buildPathPoints(optimalRoute, DEPOT)

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0A1128 0%, #1a1f3a 100%)' }}
    >
      <style>{`
        @keyframes pop-in {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          70% { transform: translate(-50%, -50%) scale(1.1); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        .stop-appear { animation: pop-in 0.3s ease-out forwards; }
        @keyframes dash-draw {
          to { stroke-dashoffset: 0; }
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
            Route Runner
          </h2>
          <p className="text-gray-400 mb-6 text-sm sm:text-base max-w-md mx-auto">
            Plan the shortest service route! Click job stops in order to build your path. 5 rounds,
            increasing stops. Beat the optimal route for max points.
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
          <div className="flex justify-between items-center mb-2 w-full" style={{ maxWidth: `${PLAY_SIZE}px` }}>
            <div className="text-white font-bold text-lg">
              Score: <span style={{ color: GAME_COLOR }}>{totalScore}</span>
            </div>
            <div className="text-white font-bold text-sm">
              Round {roundIndex + 1}/{ROUNDS.length}
            </div>
            <div className={`text-white font-bold text-lg ${timeLeft <= 5 ? 'text-red-400' : ''}`}>
              {timeLeft}s
            </div>
          </div>

          <div
            className="relative rounded-2xl border-2 overflow-hidden"
            style={{
              width: `min(90vw, ${PLAY_SIZE}px)`,
              height: `min(90vw, ${PLAY_SIZE}px)`,
              borderColor: `${GAME_COLOR}33`,
              background: 'radial-gradient(circle at center, #111827 0%, #0A1128 70%)',
            }}
          >
            {/* SVG overlay for route lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${PLAY_SIZE} ${PLAY_SIZE}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {playerPath && (
                <path
                  d={playerPath}
                  fill="none"
                  stroke={GAME_COLOR}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.8"
                />
              )}
            </svg>

            {/* Depot marker */}
            <div
              className="absolute select-none text-2xl"
              style={{
                left: `${(DEPOT.x / PLAY_SIZE) * 100}%`,
                top: `${(DEPOT.y / PLAY_SIZE) * 100}%`,
                transform: 'translate(-50%, -50%)',
                filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
              }}
            >
              🏢
            </div>

            {/* Job stops */}
            {stops.map((stop, i) => {
              const isVisited = visited.some(v => v.id === stop.id)
              const visitOrder = visited.findIndex(v => v.id === stop.id)
              return (
                <button
                  key={stop.id}
                  onClick={() => handleStopClick(stop)}
                  disabled={isVisited}
                  className="stop-appear absolute cursor-pointer disabled:cursor-default"
                  style={{
                    left: `${(stop.x / PLAY_SIZE) * 100}%`,
                    top: `${(stop.y / PLAY_SIZE) * 100}%`,
                    transform: 'translate(-50%, -50%) scale(1)',
                    width: `${STOP_RADIUS * 2}px`,
                    height: `${STOP_RADIUS * 2}px`,
                    borderRadius: '50%',
                    backgroundColor: isVisited ? `${GAME_COLOR}44` : GAME_COLOR,
                    border: isVisited ? `2px solid ${GAME_COLOR}66` : '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    transition: 'background-color 0.2s, border-color 0.2s',
                    animationDelay: `${i * 0.05}s`,
                  }}
                  aria-label={`Job stop ${i + 1}`}
                >
                  <span
                    className="text-xs font-bold select-none"
                    style={{ color: isVisited ? '#ffffff66' : 'white' }}
                  >
                    {isVisited ? visitOrder + 1 : i + 1}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="text-gray-500 text-xs mt-2">
            Click stops to build your route · {visited.length}/{stops.length} visited
          </div>
        </div>
      )}

      {phase === 'roundEnd' && (
        <div className="w-full h-full flex flex-col items-center justify-center px-4">
          <h3 className="text-2xl font-bold text-white mb-3 font-display">Round Complete</h3>

          <div
            className="relative rounded-2xl border-2 overflow-hidden mb-4"
            style={{
              width: `min(70vw, 300px)`,
              height: `min(70vw, 300px)`,
              borderColor: `${GAME_COLOR}33`,
              background: 'radial-gradient(circle at center, #111827 0%, #0A1128 70%)',
            }}
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${PLAY_SIZE} ${PLAY_SIZE}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Optimal route — dashed white */}
              {optimalPath && (
                <path
                  d={optimalPath}
                  fill="none"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {/* Player route — solid green */}
              {playerPath && (
                <path
                  d={playerPath}
                  fill="none"
                  stroke={GAME_COLOR}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
              )}
            </svg>

            {/* Depot */}
            <div
              className="absolute select-none text-lg"
              style={{
                left: `${(DEPOT.x / PLAY_SIZE) * 100}%`,
                top: `${(DEPOT.y / PLAY_SIZE) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              🏢
            </div>

            {/* Stops */}
            {stops.map((stop, i) => (
              <div
                key={stop.id}
                className="absolute"
                style={{
                  left: `${(stop.x / PLAY_SIZE) * 100}%`,
                  top: `${(stop.y / PLAY_SIZE) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: `${GAME_COLOR}88`,
                  border: '1px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="text-[8px] font-bold text-white select-none">{i + 1}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-6 text-center mb-2">
            <div>
              <div className="text-3xl font-bold" style={{ color: GAME_COLOR }}>
                {roundEfficiency}%
              </div>
              <div className="text-gray-500 text-xs">Efficiency</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">+{roundScore}</div>
              <div className="text-gray-500 text-xs">Points</div>
            </div>
          </div>

          <div className="flex gap-4 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <span className="inline-block w-4 h-0.5 rounded" style={{ backgroundColor: GAME_COLOR }} /> Your route
            </span>
            <span className="flex items-center gap-1">
              <span
                className="inline-block w-4 h-0.5 rounded"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0, rgba(255,255,255,0.4) 4px, transparent 4px, transparent 6px)',
                }}
              />{' '}
              Optimal
            </span>
          </div>
        </div>
      )}

      {phase === 'over' && (
        <div className="text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display">
            Routes Complete!
          </h2>
          <p
            className="text-6xl sm:text-7xl font-bold mb-2 font-display"
            style={{ color: GAME_COLOR }}
          >
            {totalScore}
          </p>
          <p className="text-gray-400 mb-1 text-sm">points</p>
          <p className="text-xl font-bold text-white mb-6">{getTier(totalScore)}</p>
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
