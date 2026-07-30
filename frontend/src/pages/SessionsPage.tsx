import { useState, useMemo, useEffect } from 'react'
import type { Track, SessionType, Day } from '../types'
import { sessions, dayLabels } from '../data/sessions'
import SessionCard from '../components/SessionCard'
import SessionFilters from '../components/SessionFilters'

const dayOrder: Day[] = ['sat', 'sun', 'mon', 'tue']

export default function SessionsPage() {
  const [search, setSearch] = useState('')
  const [trackFilter, setTrackFilter] = useState<Track | ''>('')
  const [typeFilter, setTypeFilter] = useState<SessionType | ''>('')
  const [dayFilter, setDayFilter] = useState<Day | ''>('')

  const [savedSessions, setSavedSessions] = useState<number[]>(() => {
    const stored = localStorage.getItem('amplify-saved-sessions')
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem('amplify-saved-sessions', JSON.stringify(savedSessions))
  }, [savedSessions])

  function toggleSave(id: number) {
    setSavedSessions(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      if (trackFilter && s.track !== trackFilter) return false
      if (typeFilter && s.type !== typeFilter) return false
      if (dayFilter && s.day !== dayFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!s.title.toLowerCase().includes(q) && !s.speaker.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [search, trackFilter, typeFilter, dayFilter])

  const grouped = useMemo(() => {
    const map = new Map<Day, typeof filtered>()
    for (const day of dayOrder) {
      const daySessions = filtered.filter(s => s.day === day)
      if (daySessions.length > 0) {
        map.set(day, daySessions)
      }
    }
    return map
  }, [filtered])

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-2">All Sessions</h1>
          <p className="text-gray-500">
            Browse {sessions.length} sessions across 4 tracks and 4 days. Save your favorites.
          </p>
        </div>

        <SessionFilters
          search={search}
          onSearchChange={setSearch}
          trackFilter={trackFilter}
          onTrackChange={setTrackFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          dayFilter={dayFilter}
          onDayChange={setDayFilter}
        />

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No sessions match your filters.</p>
          </div>
        ) : (
          Array.from(grouped.entries()).map(([day, daySessions]) => (
            <div key={day} className="mb-10">
              <h2 className="text-xl font-bold text-navy mb-4 pb-2 border-b border-gray-200">
                {dayLabels[day]}
                <span className="text-sm font-normal text-gray-400 ml-3">
                  {daySessions.length} session{daySessions.length !== 1 ? 's' : ''}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {daySessions.map(session => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    saved={savedSessions.includes(session.id)}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
