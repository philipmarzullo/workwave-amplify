import { Users, Calendar, Eye, ArrowRight, Mail } from 'lucide-react'
import ScrollFadeIn from '../components/ScrollFadeIn'

const REGISTER_URL = 'https://workwaveconference.cventevents.com/9AWddk'

const whyPartner = [
  {
    icon: Users,
    title: 'Targeted Audience',
    description: 'Reach 1,000+ service professionals across pest control, lawn care, landscaping, commercial cleaning, and security. Decision-makers from companies using PestPac, RealGreen, and TEAM Software, all in one place.',
  },
  {
    icon: Calendar,
    title: 'Three-Day Networking',
    description: 'Multiple touchpoints across four days: expo hall, breakout sessions, nightly events, and structured networking. Build relationships that extend well beyond the conference.',
  },
  {
    icon: Eye,
    title: 'Brand Visibility',
    description: 'Put your brand in front of the field service industry. From signage and session sponsorships to digital presence and partner hall placement, maximize your exposure to a captive audience.',
  },
]

const platinumPartners = ['Applause', 'Captivated', 'Coast', 'Coalmarch', 'Lawn Pro', 'Voice for Pest']
const goldPartners = ['Azuga', 'Cinch', 'Corteva', 'SameDay']

export default function PartnersPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollFadeIn>
            <p className="text-magenta uppercase tracking-widest text-sm font-semibold mb-3">AMPLIFY 2027</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Partner With Us
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Connect your brand with 1,000+ service professionals across pest, lawn, cleaning, and security at WorkWave's premier customer conference.
            </p>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Why Partner */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-4 font-display">Why Partner?</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
              AMPLIFY unites users of PestPac, RealGreen, and TEAM Software for four days of learning, networking, and product innovation. Your brand belongs in the conversation.
            </p>
          </ScrollFadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyPartner.map((item, i) => (
              <ScrollFadeIn key={item.title} delay={i * 100}>
                <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                    <item.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Tiers */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-12 font-display">2027 Conference Partners</h2>
          </ScrollFadeIn>

          {/* Platinum */}
          <ScrollFadeIn delay={100}>
            <div className="mb-12">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="h-px bg-gray-300 w-12" />
                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Platinum</p>
                <div className="h-px bg-gray-300 w-12" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {platinumPartners.map((partner) => (
                  <div key={partner} className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm">
                    <span className="text-lg font-bold text-navy">{partner}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollFadeIn>

          {/* Gold */}
          <ScrollFadeIn delay={200}>
            <div>
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="h-px bg-gray-300 w-12" />
                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Gold</p>
                <div className="h-px bg-gray-300 w-12" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {goldPartners.map((partner) => (
                  <div key={partner} className="bg-white rounded-xl p-5 text-center border border-gray-200 shadow-sm">
                    <span className="text-base font-bold text-gray-500">{partner}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollFadeIn>
            <Mail className="w-12 h-12 text-magenta mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
              Interested in Partnering?
            </h2>
            <p className="text-gray-300 text-lg mb-3 max-w-xl mx-auto">
              Learn about sponsorship tiers, expo hall placement, and branding opportunities for AMPLIFY 2027.
            </p>
            <p className="text-gray-400 mb-8">
              Contact <a href="mailto:jerry.hsu@workwave.com" className="text-accent hover:underline">jerry.hsu@workwave.com</a> for partnership details.
            </p>
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-magenta hover:bg-magenta-dark text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center gap-2"
            >
              Register Now <ArrowRight className="w-5 h-5" />
            </a>
          </ScrollFadeIn>
        </div>
      </section>
    </div>
  )
}
