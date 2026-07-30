import { Heart } from 'lucide-react'
import type { Session } from '../types'
import { getTrack } from '../data/tracks'

interface Props {
  session: Session
  saved: boolean
  onToggleSave: (id: number) => void
}

const typeLabels: Record<string, string> = {
  'thought-leadership': 'Thought Leadership',
  'innovation': 'Innovation',
  'how-to': 'How-To',
}

export default function SessionCard({ session, saved, onToggleSave }: Props) {
  const track = getTrack(session.track)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: track.color }}
          >
            {track.label}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
            {typeLabels[session.type]}
          </span>
          {session.customerLed && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gold/10 text-gold-dark">
              Customer-Led
            </span>
          )}
          {session.bootCamp && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
              Boot Camp
            </span>
          )}
        </div>
        <button
          onClick={() => onToggleSave(session.id)}
          className="shrink-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={saved ? 'Remove from saved' : 'Save session'}
        >
          <Heart
            className={`w-5 h-5 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-300'}`}
          />
        </button>
      </div>

      <h3 className="font-semibold text-navy mb-1.5 leading-snug">{session.title}</h3>
      <p className="text-sm text-gray-500 mb-3 leading-relaxed">{session.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{session.speaker}</span>
        <span>{session.time}</span>
      </div>
    </div>
  )
}
