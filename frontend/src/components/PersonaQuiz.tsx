import { useState } from 'react'
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import type { Role, Product, Interest, PersonaSelection } from '../types'
import { roles, products, interests } from '../data/personas'

interface Props {
  onComplete: (selection: PersonaSelection) => void
}

export default function PersonaQuiz({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [role, setRole] = useState<Role | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([])

  function toggleInterest(id: Interest) {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  function handleComplete() {
    onComplete({ role, product, interests: selectedInterests })
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i <= step ? 'bg-accent w-12' : 'bg-gray-200 w-8'
            }`}
          />
        ))}
      </div>

      {/* Step 0: Role */}
      {step === 0 && (
        <div>
          <h2 className="text-2xl font-bold text-navy text-center mb-2">What's your role?</h2>
          <p className="text-gray-500 text-center mb-8">This helps us match you with the right sessions.</p>
          <div className="grid gap-4">
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  role === r.id
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-navy">{r.label}</div>
                <div className="text-sm text-gray-500 mt-0.5">{r.description}</div>
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-8">
            <button
              onClick={() => setStep(1)}
              disabled={!role}
              className="flex items-center gap-2 bg-accent hover:bg-accent-dark disabled:bg-gray-200 text-white disabled:text-gray-400 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Product */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-navy text-center mb-2">Which product do you use?</h2>
          <p className="text-gray-500 text-center mb-8">We'll prioritize sessions for your product track.</p>
          <div className="grid gap-4">
            {products.map(p => (
              <button
                key={p.id}
                onClick={() => setProduct(p.id)}
                className={`p-5 rounded-xl border-2 text-left transition-all ${
                  product === p.id
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-navy">{p.label}</div>
                <div className="text-sm text-gray-500 mt-0.5">{p.description}</div>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(0)}
              className="flex items-center gap-2 text-gray-500 hover:text-navy font-medium px-4 py-3 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!product}
              className="flex items-center gap-2 bg-accent hover:bg-accent-dark disabled:bg-gray-200 text-white disabled:text-gray-400 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Interests */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-navy text-center mb-2">What are you most interested in?</h2>
          <p className="text-gray-500 text-center mb-8">Select all that apply. We'll score sessions against your picks.</p>
          <div className="grid grid-cols-2 gap-3">
            {interests.map(i => (
              <button
                key={i.id}
                onClick={() => toggleInterest(i.id)}
                className={`p-4 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                  selectedInterests.includes(i.id)
                    ? 'border-accent bg-accent/5 text-accent'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-500 hover:text-navy font-medium px-4 py-3 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleComplete}
              disabled={selectedInterests.length === 0}
              className="flex items-center gap-2 bg-magenta hover:bg-magenta-dark disabled:bg-gray-200 text-white disabled:text-gray-400 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" /> Build My Agenda
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
