import { Search } from 'lucide-react'
import type { Track, SessionType, Day } from '../types'
import { tracks } from '../data/tracks'

interface Props {
  search: string
  onSearchChange: (v: string) => void
  trackFilter: Track | ''
  onTrackChange: (v: Track | '') => void
  typeFilter: SessionType | ''
  onTypeChange: (v: SessionType | '') => void
  dayFilter: Day | ''
  onDayChange: (v: Day | '') => void
}

const types: { id: SessionType; label: string }[] = [
  { id: 'thought-leadership', label: 'Thought Leadership' },
  { id: 'innovation', label: 'Innovation' },
  { id: 'how-to', label: 'How-To' },
]

const days: { id: Day; label: string }[] = [
  { id: 'sat', label: 'Sat Jan 31' },
  { id: 'sun', label: 'Sun Feb 1' },
  { id: 'mon', label: 'Mon Feb 2' },
  { id: 'tue', label: 'Tue Feb 3' },
]

export default function SessionFilters({
  search, onSearchChange,
  trackFilter, onTrackChange,
  typeFilter, onTypeChange,
  dayFilter, onDayChange,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search sessions..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <select
          value={trackFilter}
          onChange={(e) => onTrackChange(e.target.value as Track | '')}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent bg-white"
        >
          <option value="">All Tracks</option>
          {tracks.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value as SessionType | '')}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent bg-white"
        >
          <option value="">All Types</option>
          {types.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>

        <select
          value={dayFilter}
          onChange={(e) => onDayChange(e.target.value as Day | '')}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent bg-white"
        >
          <option value="">All Days</option>
          {days.map(d => (
            <option key={d.id} value={d.id}>{d.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
