import { Link } from 'react-router-dom'
import { Calendar, Users, BarChart3, Zap, Brain, Plug, Shield, Palette, MapPin, ArrowRight } from 'lucide-react'
import ScrollFadeIn from '../components/ScrollFadeIn'
import SessionCard from '../components/SessionCard'
import { sessions } from '../data/sessions'
import { useState, useEffect } from 'react'

const REGISTER_URL = 'https://workwaveconference.cventevents.com/9AWddk'

const stats = [
  { value: '130+', label: 'Sessions' },
  { value: '800+', label: 'Attendees' },
  { value: '4', label: 'Tracks' },
  { value: '4', label: 'Days' },
]

const valueProps = [
  { icon: Users, title: 'Peer Learning', description: 'Connect with 800+ operators who face the same challenges you do. Learn from real businesses solving real problems.' },
  { icon: BarChart3, title: 'Product Roadmaps', description: 'See what is coming next for PestPac, RealGreen, and TEAM Software. Directly from the product teams.' },
  { icon: MapPin, title: 'Networking in NOLA', description: 'Structured networking, expo hall, and nightly events on the banks of the Mississippi. During Mardi Gras season.' },
]

const hotTopics = [
  { icon: BarChart3, title: 'WaveLytics', description: 'The new business analytics platform powered by Snowflake and Sigma. Big focus this year.' },
  { icon: Brain, title: 'AI in Field Service', description: 'Practical AI applications delivering real results for field service operations.' },
  { icon: Plug, title: 'Integrations', description: 'Frictionless data flow and connected ecosystems across your tech stack.' },
  { icon: Shield, title: 'Data Security', description: 'Protecting customer and operational data in an evolving threat landscape.' },
  { icon: Palette, title: 'Growth Strategies', description: 'Peer operators sharing tactics for scaling through labor shortages and rising costs.' },
]

const pricingTiers = [
  { label: 'Early Bird', price: '$849', dates: 'Jul 15 - Aug 31, 2026', highlight: true },
  { label: 'General', price: '$949', dates: 'Sep 1, 2026 - Jan 10, 2027', highlight: false },
  { label: 'Last Chance', price: '$1,195', dates: 'Jan 11 - Feb 1, 2027', highlight: false },
]

const testimonials = [
  { name: 'Mark Kelbacher', company: 'MissionGreen Services', quote: 'The educational value and peer connections help solve immediate business challenges.' },
  { name: 'Matteo Stradiotto', company: 'Insight Pest', quote: 'Discovered workflow efficiency opportunities through platform deep-dives.' },
  { name: 'Dave Koone', company: 'Lawn Doctor', quote: 'The relationship-building and support culture goes beyond just software.' },
  { name: 'Brad Leahy', company: 'Blades of Green', quote: 'Built lasting professional relationships that continue to drive business growth.' },
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
            <div className="flex items-center justify-center gap-3 text-gray-300 text-lg sm:text-xl mb-3">
              <MapPin className="w-5 h-5" />
              <span>Hilton New Orleans Riverside</span>
            </div>
            <p className="text-gray-400 italic text-sm mb-8">Your industry. Your success. Your conference, in the spirit of New Orleans.</p>
          </ScrollFadeIn>
          <ScrollFadeIn delay={200}>
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
              Four days of learning, networking, and product innovation for pest control, lawn care, landscaping, commercial cleaning, and security professionals.
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

      {/* Pricing */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-4 font-display">Registration</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
              All tickets include meals, keynotes, breakout sessions, and nightly events. Group discount: $50 off per ticket (min 5), combinable with Early Bird.
            </p>
          </ScrollFadeIn>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <ScrollFadeIn key={tier.label} delay={i * 100}>
                <div className={`rounded-xl p-6 text-center border-2 ${tier.highlight ? 'border-magenta bg-white shadow-lg' : 'border-gray-200 bg-white'}`}>
                  {tier.highlight && <span className="text-xs font-bold text-magenta uppercase tracking-wider">Best Value</span>}
                  <div className="text-3xl font-extrabold text-navy font-display mt-1 mb-1">{tier.price}</div>
                  <div className="font-semibold text-navy mb-2">{tier.label}</div>
                  <div className="text-sm text-gray-400">{tier.dates}</div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
          <ScrollFadeIn delay={300}>
            <div className="text-center mt-8">
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-magenta hover:bg-magenta-dark text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center gap-2"
              >
                Register Now <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-xs text-gray-400 mt-3">Registration closes January 29, 2027. Plus One guest passes available for $450.</p>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Featured Sessions */}
      <section className="bg-white py-20">
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

      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-12 font-display">What Attendees Say</h2>
          </ScrollFadeIn>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <ScrollFadeIn key={t.name} delay={i * 100}>
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-600 italic mb-4">"{t.quote}"</p>
                  <div>
                    <div className="font-semibold text-navy text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.company}</div>
                  </div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Venue */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-4 font-display">The Venue</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">
              Hilton New Orleans Riverside, 2 Poydras Street, on the banks of the Mississippi River. 16 miles from MSY airport.
            </p>
          </ScrollFadeIn>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <ScrollFadeIn delay={0}>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="text-2xl mb-2">🎭</div>
                <h3 className="font-semibold text-navy mb-1">Mardi Gras Season</h3>
                <p className="text-sm text-gray-500">The conference falls during Mardi Gras. Book flights early for the best rates.</p>
              </div>
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="text-2xl mb-2">🏨</div>
                <h3 className="font-semibold text-navy mb-1">Hotel Block</h3>
                <p className="text-sm text-gray-500">Group rate available until January 6, 2027. After that, rates go up and rooms may sell out.</p>
              </div>
            </ScrollFadeIn>
            <ScrollFadeIn delay={200}>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="text-2xl mb-2">🌡️</div>
                <h3 className="font-semibold text-navy mb-1">Weather</h3>
                <p className="text-sm text-gray-500">February in New Orleans: highs in the mid-60s, lows in the 40s. Bring layers and an umbrella.</p>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-gray-50 py-16">
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
              Join 800+ field service professionals at the Hilton New Orleans Riverside. Register today and start building your personalized agenda.
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
