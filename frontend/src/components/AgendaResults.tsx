import { useMemo } from 'react'
import { RotateCcw } from 'lucide-react'
import type { PersonaSelection, Session, Day } from '../types'
import { sessions, dayLabels } from '../data/sessions'
import { getTrack } from '../data/tracks'

interface Props {
  persona: PersonaSelection
  onReset: () => void
}

function scoreSession(session: Session, persona: PersonaSelection): number {
  let score = 0

  // Track match: +3 if session track matches selected product (or joint)
  if (session.track === 'joint') {
    score += 2
  } else if (persona.product && session.track === persona.product) {
    score += 3
  }

  // Interest match: +2 per matching interest
  for (const interest of persona.interests) {
    if (session.interests.includes(interest)) {
      score += 2
    }
  }

  // Role match: +2
  if (persona.role && session.roles.includes(persona.role)) {
    score += 2
  }

  return score
}

const dayOrder: Day[] = ['sat', 'sun', 'mon', 'tue']

export default function AgendaResults({ persona, onReset }: Props) {
  const recommended = useMemo(() => {
    const scored = sessions.map(s => ({
      session: s,
      score: scoreSession(s, persona),
    }))

    scored.sort((a, b) => b.score - a.score)

    return scored.filter(s => s.score > 0).slice(0, 10)
  }, [persona])

  const grouped = useMemo(() => {
    const map = new Map<Day, typeof recommended>()
    for (const day of dayOrder) {
      const daySessions = recommended.filter(r => r.session.day === day)
      if (daySessions.length > 0) {
        daySessions.sort((a, b) => {
          if (a.session.time < b.session.time) return -1
          if (a.session.time > b.session.time) return 1
          return b.score - a.score
        })
        map.set(day, daySessions)
      }
    }
    return map
  }, [recommended])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-navy mb-2">Your Personalized Agenda</h2>
        <p className="text-gray-500 mb-4">
          Based on your role, product, and interests, here are your top recommended sessions.
        </p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-dark font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Retake Quiz
        </button>
      </div>

      {Array.from(grouped.entries()).map(([day, items]) => (
        <div key={day} className="mb-8">
          <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-200">
            {dayLabels[day]}
          </h3>
          <div className="space-y-3">
            {items.map(({ session, score }) => {
              const track = getTrack(session.track)
              return (
                <div
                  key={session.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4"
                >
                  <div
                    className="w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: track.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-navy leading-snug">{session.title}</h4>
                      <span className="shrink-0 text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">
                        {score}pt
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{session.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span
                        className="font-semibold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: track.color }}
                      >
                        {track.label}
                      </span>
                      <span>{session.time}</span>
                      <span>{session.speaker}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="text-center mt-8 p-6 bg-navy rounded-xl">
        <h3 className="text-white font-bold text-lg mb-2">Ready to experience it live?</h3>
        <p className="text-gray-300 text-sm mb-4">
          Register for WorkWave Amplify 2027 in New Orleans.
        </p>
        <a
          href="https://workwaveconference.cventevents.com/9AWddk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-magenta hover:bg-magenta-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Register Now
        </a>
      </div>
    </div>
  )
}
