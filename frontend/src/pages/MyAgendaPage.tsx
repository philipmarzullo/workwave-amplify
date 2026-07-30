import { useState, useEffect } from 'react'
import type { PersonaSelection } from '../types'
import PersonaQuiz from '../components/PersonaQuiz'
import AgendaResults from '../components/AgendaResults'

export default function MyAgendaPage() {
  const [persona, setPersona] = useState<PersonaSelection | null>(() => {
    const stored = localStorage.getItem('amplify-persona')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (persona) {
      localStorage.setItem('amplify-persona', JSON.stringify(persona))
    } else {
      localStorage.removeItem('amplify-persona')
    }
  }, [persona])

  function handleReset() {
    setPersona(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!persona ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-2 font-display">Build Your Agenda</h1>
              <p className="text-gray-500 max-w-xl mx-auto">
                Tell us about yourself and we'll recommend the sessions that matter most to you.
              </p>
            </div>
            <PersonaQuiz onComplete={setPersona} />
          </>
        ) : (
          <AgendaResults persona={persona} onReset={handleReset} />
        )}
      </div>
    </div>
  )
}
