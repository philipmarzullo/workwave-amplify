import { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'

const API_URL = import.meta.env.PROD
  ? 'https://workwave-amplify-backend.onrender.com/api/poll'
  : 'http://localhost:10000/api/poll'

const STORAGE_KEY = 'amplify-poll-voted'

interface PollData {
  question: string
  options: string[]
  votes: number[]
  total: number
}

export default function LivePoll() {
  const [poll, setPoll] = useState<PollData | null>(null)
  const [hasVoted, setHasVoted] = useState(() => localStorage.getItem(STORAGE_KEY) !== null)
  const [votedIndex, setVotedIndex] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored !== null ? parseInt(stored, 10) : -1
  })
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then(data => {
        setPoll(data)
        // If localStorage says we voted but server has no votes,
        // the server was restarted and lost data — let the user vote again
        if (hasVoted && data.total === 0) {
          localStorage.removeItem(STORAGE_KEY)
          setHasVoted(false)
          setVotedIndex(-1)
        }
      })
      .catch(() => {})
  }, [])

  async function vote(index: number) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIndex: index }),
      })
      const data = await res.json()
      setPoll(prev => prev ? { ...prev, votes: data.votes, total: data.total } : prev)
      setVotedIndex(index)
      setHasVoted(true)
      localStorage.setItem(STORAGE_KEY, String(index))
      setAnimating(true)
      setTimeout(() => setAnimating(false), 700)
    } catch {
      // Silently fail — poll is non-critical
    }
  }

  if (!poll) return null

  const maxVotes = Math.max(...poll.votes, 1)

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border-2 border-accent/20 shadow-lg p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-xl font-bold text-navy">{poll.question}</h3>
      </div>

      {!hasVoted ? (
        <div className="space-y-3">
          {poll.options.map((option, i) => (
            <button
              key={i}
              onClick={() => vote(i)}
              className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-200 hover:border-accent hover:bg-accent/5 transition-all font-medium text-navy"
            >
              {option}
            </button>
          ))}
          {poll.total > 0 && (
            <p className="text-xs text-gray-400 text-center mt-2">{poll.total} vote{poll.total !== 1 ? 's' : ''} so far</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {poll.options.map((option, i) => {
            const pct = poll.total > 0 ? Math.round((poll.votes[i] / poll.total) * 100) : 0
            const barWidth = poll.total > 0 ? (poll.votes[i] / maxVotes) * 100 : 0
            const isSelected = votedIndex === i
            return (
              <div key={i} className="relative">
                <div
                  className={`rounded-xl px-5 py-4 border-2 transition-all ${
                    isSelected ? 'border-accent bg-accent/5' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-xl ${isSelected ? 'bg-accent/10' : 'bg-gray-100'}`}
                    style={{
                      width: `${barWidth}%`,
                      transition: animating ? 'width 0.6s ease-out' : 'none',
                    }}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className={`font-medium ${isSelected ? 'text-navy' : 'text-gray-600'}`}>
                      {option} {isSelected && '✓'}
                    </span>
                    <span className={`font-bold text-sm ${isSelected ? 'text-accent' : 'text-gray-400'}`}>
                      {pct}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
          {votedIndex >= 0 && poll.total > 0 && (
            <p className="text-sm text-accent font-medium text-center mt-3">
              You and {Math.round((poll.votes[votedIndex] / poll.total) * 100)}% of attendees agree.
            </p>
          )}
          <p className="text-xs text-gray-400 text-center">{poll.total} vote{poll.total !== 1 ? 's' : ''}</p>
          <p className="text-xs text-gray-300 text-center italic">Full live leaderboard launches at AMPLIFY 2027.</p>
        </div>
      )}
    </div>
  )
}
