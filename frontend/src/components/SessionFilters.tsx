import { Search } from 'lucide-react'
import type { Track, SessionType, Day } from '../types'
import { tracks } from '../data/tracks'

interface Props {
  search: string
  onSearchChange: (v: string) => void
  trackFilter: Track[]
  onTrackChange: (v: Track[]) => void
  typeFilter: SessionType[]
  onTypeChange: (v: SessionType[]) => void
  dayFilter: Day[]
  onDayChange: (v: Day[]) => void
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

const inactiveChip =
  'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
}

export default function SessionFilters({
  search, onSearchChange,
  trackFilter, onTrackChange,
  typeFilter, onTypeChange,
  dayFilter, onDayChange,
}: Props) {
  const hasFilters = trackFilter.length > 0 || typeFilter.length > 0 || dayFilter.length > 0

  function clearAll() {
    onTrackChange([])
    onTypeChange([])
    onDayChange([])
    onSearchChange('')
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search sessions..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </div>

      {/* Day tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onDayChange([])}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            dayFilter.length === 0
              ? 'bg-navy text-white'
              : inactiveChip
          }`}
        >
          All Days
        </button>
        {days.map(d => (
          <button
            key={d.id}
            onClick={() => onDayChange(toggle(dayFilter, d.id))}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              dayFilter.includes(d.id)
                ? 'bg-navy text-white'
                : inactiveChip
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Track chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Track</span>
        {tracks.map(t => (
          <button
            key={t.id}
            onClick={() => onTrackChange(toggle(trackFilter, t.id))}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              trackFilter.includes(t.id)
                ? 'text-white'
                : inactiveChip
            }`}
            style={trackFilter.includes(t.id) ? { backgroundColor: t.color } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Type chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Type</span>
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => onTypeChange(toggle(typeFilter, t.id))}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              typeFilter.includes(t.id)
                ? 'bg-accent text-white'
                : inactiveChip
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <div>
          <button
            onClick={clearAll}
            className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
