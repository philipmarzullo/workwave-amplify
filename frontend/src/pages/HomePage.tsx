import { Link } from 'react-router-dom'
import { Calendar, Users, BarChart3, Zap, Brain, Plug, Shield, Palette, MapPin, ArrowRight } from 'lucide-react'
import ScrollFadeIn from '../components/ScrollFadeIn'
import SessionCard from '../components/SessionCard'
import { sessions } from '../data/sessions'
import { useState, useEffect } from 'react'

const REGISTER_URL = 'https://www.workwave.com'

const stats = [
  { value: '130+', label: 'Sessions' },
  { value: '800+', label: 'Attendees' },
  { value: '4', label: 'Tracks' },
  { value: '4', label: 'Days' },
]

const valueProps = [
  { icon: Users, title: 'Peer Learning', description: 'Connect with 800+ operators who face the same challenges you do.' },
  { icon: BarChart3, title: 'Product Roadmaps', description: 'See what is coming next before anyone else. Directly from the product teams.' },
  { icon: MapPin, title: 'Networking in NOLA', description: 'Structured networking events, expo hall, and the best city for after-hours.' },
]

const hotTopics = [
  { icon: BarChart3, title: 'WaveLytics', description: 'The new analytics platform powered by Snowflake and Sigma.' },
  { icon: Brain, title: 'AI in Field Service', description: 'Practical applications delivering real results, not hype.' },
  { icon: Plug, title: 'Integrations', description: 'Connected ecosystems and frictionless data flow.' },
  { icon: Shield, title: 'Data Security', description: 'Protecting customer and operational data.' },
  { icon: Palette, title: 'UI Modernization', description: 'Fresh interfaces coming across all products.' },
]

const partners = ['AWS', 'Snowflake', 'Sigma', 'Arrow']

export default function HomePage() {
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

  const featured = sessions.filter(s => [1, 2, 6, 7, 10, 15].includes(s.id))

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-navy min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy opacity-90" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(139,61,255,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(232,0,94,0.1) 0%, transparent 50%)'
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <ScrollFadeIn>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-magenta" />
            </div>
            <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold mb-4">WorkWave</p>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-none mb-2">
              AMPLIFY
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl mb-1">Customer Conference</p>
            <p className="text-magenta font-display font-bold text-2xl sm:text-3xl mb-8">2027</p>
          </ScrollFadeIn>
          <ScrollFadeIn delay={100}>
            <div className="flex items-center justify-center gap-3 text-gray-300 text-lg sm:text-xl mb-3">
              <Calendar className="w-5 h-5" />
              <span>January 31 - February 3, 2027</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-300 text-lg sm:text-xl mb-8">
              <MapPin className="w-5 h-5" />
              <span>New Orleans</span>
            </div>
          </ScrollFadeIn>
          <ScrollFadeIn delay={200}>
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
              Four days of learning, networking, and product innovation for the field service community.
            </p>
          </ScrollFadeIn>
          <ScrollFadeIn delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-magenta hover:bg-magenta-dark text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center gap-2"
              >
                Register Now <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                to="/my-agenda"
                className="border-2 border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
              >
                Build My Agenda
              </Link>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <ScrollFadeIn key={stat.label} delay={i * 100}>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-extrabold text-navy font-display mb-1">{stat.value}</div>
                  <div className="text-gray-500 font-medium">{stat.label}</div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-12 font-display">Why Attend?</h2>
          </ScrollFadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((prop, i) => (
              <ScrollFadeIn key={prop.title} delay={i * 100}>
                <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                    <prop.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{prop.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{prop.description}</p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Topics */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-4 font-display">Hot Topics This Year</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
              The sessions and themes driving this year's conference.
            </p>
          </ScrollFadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotTopics.map((topic, i) => (
              <ScrollFadeIn key={topic.title} delay={i * 80}>
                <div className="flex gap-4 p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="w-11 h-11 bg-magenta/10 rounded-lg flex items-center justify-center shrink-0">
                    <topic.icon className="w-5 h-5 text-magenta" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">{topic.title}</h3>
                    <p className="text-sm text-gray-500">{topic.description}</p>
                  </div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sessions */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-navy font-display">Featured Sessions</h2>
              <Link to="/sessions" className="text-accent hover:text-accent-dark font-medium text-sm flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollFadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((session, i) => (
              <ScrollFadeIn key={session.id} delay={i * 80}>
                <SessionCard
                  session={session}
                  saved={savedSessions.includes(session.id)}
                  onToggleSave={toggleSave}
                />
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <p className="text-center text-gray-400 text-sm font-medium mb-8 uppercase tracking-wider">Technology Partners</p>
          </ScrollFadeIn>
          <div className="flex items-center justify-center gap-12 flex-wrap">
            {partners.map((partner, i) => (
              <ScrollFadeIn key={partner} delay={i * 80}>
                <div className="text-2xl font-bold text-gray-300">{partner}</div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollFadeIn>
            <Zap className="w-12 h-12 text-magenta mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
              Ready to Amplify?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Join 800+ field service professionals in New Orleans. Register today and start building your personalized agenda.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-magenta hover:bg-magenta-dark text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center gap-2"
              >
                Register Now <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                to="/my-agenda"
                className="border-2 border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
              >
                Build My Agenda
              </Link>
            </div>
          </ScrollFadeIn>
        </div>
      </section>
    </div>
  )
}
