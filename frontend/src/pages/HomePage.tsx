import { Link } from 'react-router-dom'
import { Calendar, Users, BarChart3, Zap, Brain, Plug, Shield, Lightbulb, MapPin, ArrowRight, Mic, TrendingUp, Info, HelpCircle, CheckCircle2 } from 'lucide-react'
import ScrollFadeIn from '../components/ScrollFadeIn'
import SessionCard from '../components/SessionCard'
import LivePoll from '../components/LivePoll'
import { sessions } from '../data/sessions'
import { useState, useEffect } from 'react'

const REGISTER_URL = 'https://workwaveconference.cventevents.com/9AWddk'

const stats = [
  { value: '100+', label: 'Sessions' },
  { value: '1,000+', label: 'Attendees' },
  { value: '4', label: 'Tracks' },
  { value: '4', label: 'Days' },
]

const valueProps = [
  { icon: Users, title: 'Network with Purpose', description: 'Connect with 1,000+ industry leaders facing similar operational challenges. Structured networking, expo hall, and nightly events.' },
  { icon: Lightbulb, title: 'Front-Row Seat to Innovation', description: 'First access to new solutions and AI-focused announcements. See what is coming next directly from the product teams.' },
  { icon: BarChart3, title: 'Learning Paths by Role', description: 'Customized sessions addressing staffing, AI adoption, and growth. Whether you are an owner, admin, or tech, there is a track for you.' },
  { icon: Shield, title: 'Industry Expertise', description: 'Combined operational knowledge, data insights, and comprehensive technology platform. 40+ years of industry experience.' },
  { icon: Mic, title: 'Peer-Led Sessions', description: 'Customer presentations revealing real business strategies and results. Learn from operators who have been where you are.' },
  { icon: TrendingUp, title: 'Growth Reimagined', description: 'Learn from leaders, grow with peers, build together. Turn knowledge into action you can take home.' },
]

const hotTopics = [
  { icon: BarChart3, title: 'Wavelytics', description: 'The new business analytics platform powered by Snowflake and Sigma. Big focus this year.' },
  { icon: Brain, title: 'AI in Field Service', description: 'Practical AI applications delivering real results for field service operations.' },
  { icon: Plug, title: 'Integrations', description: 'Frictionless data flow and connected ecosystems across your tech stack.' },
  { icon: Shield, title: 'Data Security', description: 'Protecting customer and operational data in an evolving threat landscape.' },
  { icon: TrendingUp, title: 'Growth Strategies', description: 'Peer operators sharing tactics for scaling through labor shortages and rising costs.' },
]

const pricingTiers = [
  {
    label: 'Early Bird',
    badge: 'BEST VALUE',
    price: '849',
    subtitle: 'Limited time, valid July 15 through August 31.',
    info: 'For a limited time, get your customer conference ticket at its lowest price. Offer only valid July 15 through August 31. Ticket purchase includes access to all meals, keynotes, sessions and nightly events. A name tag must be worn at all times.',
    highlight: true,
  },
  {
    label: 'General',
    price: '949',
    subtitle: 'Available Sept 1, 2026 to Jan 10, 2027.',
    info: 'Standard conference pricing. Includes access to all meals, keynotes, sessions and nightly events. A name tag must be worn at all times.',
    highlight: false,
  },
  {
    label: 'Last Chance',
    price: '1,195',
    subtitle: 'Available Jan 11, 2027 to Feb 1, 2027.',
    info: 'Final registration window. Includes access to all meals, keynotes, sessions and nightly events. A name tag must be worn at all times.',
    highlight: false,
  },
  {
    label: 'Group (5+)',
    price: '$50 off',
    isDiscount: true,
    subtitle: 'Per ticket when purchasing 5 or more.',
    info: 'Available through January 31, 2027. $50 discount per ticket when purchasing 5 or more. Can be combined with Early Bird pricing for maximum savings. Includes access to all meals, keynotes, sessions and nightly events.',
    highlight: false,
  },
  {
    label: 'Plus One',
    price: '450',
    subtitle: 'Bring a guest to all nightly events.',
    info: 'Plus One passes cover nightly events only. No access to daytime sessions, meals, or keynotes. Each attendee is limited to one guest pass. All events are 21 and over.',
    highlight: false,
  },
]

const testimonials = [
  { name: 'Mark Kelbacher', company: 'MissionGreen Services', quote: 'If you\'re on the fence about attending, just go. The education is outstanding, but what really sets the WorkWave Conference apart are the conversations you\'ll have with other business owners facing the same challenges and opportunities you are.' },
  { name: 'Matteo Stradiotto', company: 'Insight Pest', quote: 'The most valuable takeaway was discovering how many different ways PestPac can support the same business process. We found opportunities to make workflows more efficient and improve customer experience.' },
  { name: 'Dave Koone', company: 'Lawn Doctor', quote: 'It\'s not only that the software is great, but the people and support. They actually care about helping us succeed.' },
  { name: 'Brad Leahy', company: 'Blades of Green', quote: 'The number one thing RealGreen has done for me is build unbelievable relationships and friendships. These conferences and people have helped me grow my business exponentially.' },
]


export default function HomePage() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null)
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
            <div className="flex items-center justify-center mb-6">
              <img src="/logos/ww-logo-white.svg" alt="WorkWave" className="h-8 sm:h-10" />
            </div>
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
              <a
                href="#poll"
                className="border-2 border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
              >
                Take The Poll
              </a>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {valueProps.map((prop, i) => (
              <ScrollFadeIn key={prop.title} delay={i * 80}>
                <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <prop.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{prop.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{prop.description}</p>
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

      {/* Live Poll */}
      <section id="poll" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <p className="text-accent uppercase tracking-widest text-sm font-semibold mb-3 text-center">Benchmark Yourself</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-4 font-display">How Do You Compare?</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
              Vote and see how your priorities stack up against 1,000+ fellow attendees.
            </p>
          </ScrollFadeIn>
          <ScrollFadeIn delay={100}>
            <LivePoll />
          </ScrollFadeIn>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <p className="text-magenta uppercase tracking-widest text-sm font-semibold mb-3 text-center">Conference Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4 font-display">Choose your package</h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
              Every ticket includes access to all sessions, keynotes, meals, and nightly events.
            </p>
          </ScrollFadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <ScrollFadeIn key={tier.label} delay={i * 80}>
                <div
                  className={`relative rounded-xl p-5 border transition-all duration-300 cursor-pointer min-h-[200px] flex flex-col ${
                    tier.highlight
                      ? 'border-magenta bg-white/5'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  } ${flippedCard === i ? 'bg-white/10' : ''}`}
                  onClick={() => setFlippedCard(flippedCard === i ? null : i)}
                  onMouseEnter={() => setFlippedCard(i)}
                  onMouseLeave={() => setFlippedCard(null)}
                >
                  <button
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent/30 flex items-center justify-center"
                    aria-label="More info"
                    onClick={(e) => { e.stopPropagation(); setFlippedCard(flippedCard === i ? null : i) }}
                  >
                    <Info className="w-3.5 h-3.5 text-white" />
                  </button>

                  {flippedCard === i ? (
                    <div className="flex-1 flex items-center">
                      <p className="text-gray-300 text-xs leading-relaxed">{tier.info}</p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-center">
                      {'badge' in tier && tier.badge && (
                        <span className="inline-block text-[10px] font-bold text-magenta border border-magenta rounded px-2 py-0.5 uppercase tracking-wider mb-2 self-start">
                          {tier.badge}
                        </span>
                      )}
                      <h3 className="text-white font-bold text-sm mb-3">{tier.label}</h3>
                      <div className="mb-3">
                        {'isDiscount' in tier && tier.isDiscount ? (
                          <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">{tier.price}</div>
                        ) : (
                          <div className="flex items-start">
                            <span className="text-white/60 text-sm mt-1">$</span>
                            <span className="text-3xl sm:text-4xl font-extrabold text-white font-display">{tier.price}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs leading-snug">{tier.subtitle}</p>
                    </div>
                  )}
                </div>
              </ScrollFadeIn>
            ))}
          </div>
          <ScrollFadeIn delay={400}>
            <div className="text-center mt-10">
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-accent to-magenta hover:opacity-90 text-white font-bold px-10 py-4 rounded-lg text-lg transition-opacity inline-flex items-center gap-2"
              >
                Register Today <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-xs text-gray-500 mt-3">Registration closes January 29, 2027.</p>
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

      {/* First Timer */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-accent to-magenta p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">First Time at AMPLIFY?</h2>
                <p className="text-white/80">Here's what to expect and how to make the most of it.</p>
              </div>
              <div className="p-6 sm:p-8">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    'Take the Build My Agenda quiz to get personalized session picks',
                    'Book the Hilton at $289/night before the block fills up',
                    'Sign up for a Product Bootcamp on Sunday (free with your ticket)',
                    'Download the conference app in December to build your schedule',
                    'Plan for Mardi Gras traffic and book flights early',
                    'Pack business casual, layers, and comfortable shoes',
                  ].map((text) => (
                    <div key={text} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors cursor-pointer"
                  >
                    <img src="/logos/waive-mark-gradient.svg" alt="" className="w-5 h-5" />
                    Ask WAIve for first-timer tips
                  </button>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <a href="mailto:events@workwave.com" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    Questions? Email events@workwave.com
                  </a>
                </div>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Explore More */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-10 font-display">Explore More</h2>
          </ScrollFadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <ScrollFadeIn delay={0}>
              <Link to="/partners" className="block bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md hover:border-accent/30 transition-all group h-full">
                <div className="w-11 h-11 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-bold text-navy mb-2">Conference Partners</h3>
                <p className="text-sm text-gray-500 mb-3">Meet the companies partnering with AMPLIFY 2027. Learn about sponsorship tiers and partnership opportunities.</p>
                <span className="text-accent font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Partners <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}>
              <Link to="/travel" className="block bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md hover:border-accent/30 transition-all group h-full">
                <div className="w-11 h-11 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-bold text-navy mb-2">Travel & Hotel</h3>
                <p className="text-sm text-gray-500 mb-3">Hotel booking at $289/night, airport info, local transport, and weather tips for your trip to New Orleans.</p>
                <span className="text-accent font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Travel Info <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </ScrollFadeIn>
            <ScrollFadeIn delay={200}>
              <Link to="/faq" className="block bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md hover:border-accent/30 transition-all group h-full">
                <div className="w-11 h-11 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <HelpCircle className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-bold text-navy mb-2">FAQ</h3>
                <p className="text-sm text-gray-500 mb-3">Registration, refunds, hotel booking, dress code, dietary needs, Mardi Gras tips, and everything else you need to know.</p>
                <span className="text-accent font-medium text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  View FAQ <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* AI Assistant CTA */}
      <section className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139,61,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(232,0,94,0.1) 0%, transparent 50%)'
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="shrink-0">
                <div className="w-20 h-20 flex items-center justify-center">
                  <img src="/logos/waive-mark-white.svg" alt="WAIve" className="w-16 h-16" />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <p className="text-accent uppercase tracking-widest text-xs font-semibold mb-2">Powered by AI</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-display">
                  Ask WAIve
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6 max-w-xl">
                  Not sure which sessions fit your role? Curious about New Orleans? WAIve knows every session, speaker, and conference detail. Ask anything, get answers instantly.
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
                  className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  Ask WAIve <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* CEO Video */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollFadeIn>
            <p className="text-magenta uppercase tracking-widest text-sm font-semibold mb-3">Watch Now</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-display">New Name. Same Great Event.</h2>
            <p className="text-gray-400 mb-8">A message from our CEO, Kevin Kemmerer</p>
          </ScrollFadeIn>
          <ScrollFadeIn delay={100}>
            <div className="flex justify-center">
              <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ width: '100%', maxWidth: '380px' }}>
                <iframe
                  src="https://fast.wistia.net/embed/iframe/kz7f35jg63?videoFoam=true"
                  title="A Message from our CEO"
                  allow="autoplay; fullscreen"
                  frameBorder="0"
                  scrolling="no"
                  style={{ width: '100%', aspectRatio: '4/5' }}
                />
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Platform Logos */}
      <section id="platforms" className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <p className="text-center text-gray-400 text-sm font-medium mb-10 uppercase tracking-wider">Three Platforms. One Conference.</p>
          </ScrollFadeIn>
          <div className="flex items-center justify-center flex-wrap">
            <ScrollFadeIn delay={0}>
              <div className="flex items-center justify-center px-6 sm:px-10 py-4">
                <img src="/logos/pestpac-logo-white.svg" alt="PestPac by WorkWave" className="h-10 sm:h-12" />
              </div>
            </ScrollFadeIn>
            <div className="hidden sm:block w-px h-12 bg-white/20" />
            <ScrollFadeIn delay={100}>
              <div className="flex items-center justify-center px-6 sm:px-10 py-4">
                <img src="/logos/team-software-logo-white.svg" alt="TEAM Software by WorkWave" className="h-10 sm:h-12" />
              </div>
            </ScrollFadeIn>
            <div className="hidden sm:block w-px h-12 bg-white/20" />
            <ScrollFadeIn delay={200}>
              <div className="flex items-center justify-center px-6 sm:px-10 py-4">
                <img src="/logos/realgreen-logo-white.svg" alt="RealGreen by WorkWave" className="h-10 sm:h-12" />
              </div>
            </ScrollFadeIn>
          </div>
          <div className="mt-8 h-1 bg-gradient-to-r from-track-pestpac via-track-winteam to-track-realgreen rounded-full max-w-4xl mx-auto" />
        </div>
      </section>


      {/* Final CTA */}
      <section className="bg-navy py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollFadeIn>
            <Zap className="w-12 h-12 text-magenta mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
              Ready to AMPLIFY?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Join 1,000+ field service professionals at the Hilton New Orleans Riverside. January 31 - February 3, 2027.
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
              <a
                href="#poll"
                className="border-2 border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
              >
                Take The Poll
              </a>
            </div>
          </ScrollFadeIn>
        </div>
      </section>
    </div>
  )
}
