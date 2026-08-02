import { useState, useEffect, lazy, Suspense } from 'react'

const BugBlaster = lazy(() => import('./games/BugBlaster'))
const MowMaster = lazy(() => import('./games/MowMaster'))
const NightWatch = lazy(() => import('./games/NightWatch'))
const SpillSquad = lazy(() => import('./games/SpillSquad'))

type GameId = 'pest' | 'lawn' | 'security' | 'janitorial'

const GAMES: {
  id: GameId
  name: string
  emoji: string
  platform: string
  tagline: string
  color: string
}[] = [
  {
    id: 'pest',
    name: 'Bug Blaster',
    emoji: '🪲',
    platform: 'PestPac',
    tagline: 'Squash bugs before they reach the house!',
    color: '#E8005E',
  },
  {
    id: 'lawn',
    name: 'Mow Master',
    emoji: '🌿',
    platform: 'RealGreen',
    tagline: 'Keep every lawn perfectly trimmed.',
    color: '#22c55e',
  },
  {
    id: 'security',
    name: 'Night Watch',
    emoji: '🔒',
    platform: 'WinTeam',
    tagline: 'Spot intruders on the camera feeds.',
    color: '#264BEE',
  },
  {
    id: 'janitorial',
    name: 'Spill Squad',
    emoji: '🧹',
    platform: 'Joint',
    tagline: 'Mop spills before they spread!',
    color: '#8B3DFF',
  },
]

export default function GameArcade({ onClose }: { onClose: () => void }) {
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedGame) {
          setSelectedGame(null)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, selectedGame])

  const handleBack = () => setSelectedGame(null)

  if (selectedGame) {
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
        {selectedGame === 'pest' && <BugBlaster onClose={onClose} onBack={handleBack} />}
        {selectedGame === 'lawn' && <MowMaster onClose={onClose} onBack={handleBack} />}
        {selectedGame === 'security' && <NightWatch onClose={onClose} onBack={handleBack} />}
        {selectedGame === 'janitorial' && <SpillSquad onClose={onClose} onBack={handleBack} />}
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
          Pick your industry. Play your game.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {GAMES.map(game => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className="group relative rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: `2px solid ${game.color}33`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = game.color
                e.currentTarget.style.boxShadow = `0 0 20px ${game.color}22`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = `${game.color}33`
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="text-3xl sm:text-4xl mb-2">{game.emoji}</div>
              <div className="font-bold text-white text-sm sm:text-base">{game.name}</div>
              <div className="text-xs font-semibold mt-0.5" style={{ color: game.color }}>
                {game.platform}
              </div>
              <div className="text-gray-500 text-xs mt-1.5 leading-snug">
                {game.tagline}
              </div>
            </button>
          ))}
        </div>

        <p className="text-gray-600 text-xs mt-6">Press Esc to close</p>
      </div>
    </div>
  )
}
