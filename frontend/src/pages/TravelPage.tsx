import { MapPin, Plane, Hotel, CloudRain, PartyPopper, ArrowRight, Zap, Navigation } from 'lucide-react'
import ScrollFadeIn from '../components/ScrollFadeIn'

const REGISTER_URL = 'https://workwaveconference.cventevents.com/9AWddk'

export default function TravelPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollFadeIn>
            <p className="text-magenta uppercase tracking-widest text-sm font-semibold mb-3">AMPLIFY 2027</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Travel & Hotel
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-300 text-lg">
              <MapPin className="w-5 h-5" />
              <span>Hilton New Orleans Riverside, 2 Poydras Street, New Orleans, LA 70130</span>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Hotel */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <div className="flex items-center justify-center gap-3 mb-3">
              <Hotel className="w-8 h-8 text-accent" />
              <h2 className="text-3xl sm:text-4xl font-bold text-navy font-display">Conference Hotel</h2>
            </div>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
              Stay where the action is. The Hilton New Orleans Riverside sits on the banks of the Mississippi River, steps from the French Quarter.
            </p>
          </ScrollFadeIn>
          <div className="max-w-3xl mx-auto">
            <ScrollFadeIn delay={100}>
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-navy mb-1">Hilton New Orleans Riverside</h3>
                <p className="text-gray-500 text-sm mb-6">2 Poydras Street, New Orleans, LA 70130</p>

                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg p-5 border border-gray-200">
                    <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider mb-1">Exclusive Rate</p>
                    <p className="text-3xl font-extrabold text-navy font-display">$289<span className="text-base font-normal text-gray-400">/night</span></p>
                  </div>
                  <div className="bg-white rounded-lg p-5 border border-gray-200">
                    <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider mb-1">Book By</p>
                    <p className="text-lg font-bold text-navy">January 6, 2027</p>
                    <p className="text-sm text-gray-400">Or until sold out</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-sm font-semibold text-navy mb-4">How to Book</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-xs font-bold shrink-0">1</span>
                      <p className="text-sm text-gray-500">Register for the conference through the registration link.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-xs font-bold shrink-0">2</span>
                      <p className="text-sm text-gray-500">After registration, you will receive a Passkey booking link for the hotel block at the exclusive rate.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-xs font-bold shrink-0">3</span>
                      <p className="text-sm text-gray-500">Book through Passkey and receive your hotel confirmation directly.</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* Getting There */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <div className="flex items-center justify-center gap-3 mb-3">
              <Plane className="w-8 h-8 text-accent" />
              <h2 className="text-3xl sm:text-4xl font-bold text-navy font-display">Getting There</h2>
            </div>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
              Two airports serve the New Orleans area, plus easy local transport once you arrive.
            </p>
          </ScrollFadeIn>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <ScrollFadeIn delay={0}>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Plane className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy">Louis Armstrong International (MSY)</h3>
                    <p className="text-xs text-gray-400">Primary airport</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Approximately 16 miles from the hotel, about a 25 to 30 minute drive depending on traffic. The main commercial airport serving New Orleans.
                </p>
              </div>
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-magenta/10 rounded-lg flex items-center justify-center">
                    <Plane className="w-5 h-5 text-magenta" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy">Lakefront Airport (NEW)</h3>
                    <p className="text-xs text-gray-400">Closer option</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Approximately 10 minutes from the hotel. A smaller airport serving private and charter flights, offering a quicker route to the venue.
                </p>
              </div>
            </ScrollFadeIn>
          </div>
          <ScrollFadeIn delay={200}>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-bold text-navy">Local Transport</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Rideshare services (Uber, Lyft), the St. Charles streetcar line, and walking are all convenient ways to get around. The French Quarter, Bourbon Street, and Garden District are all within easy reach of the hotel.
                </p>
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Weather & Mardi Gras */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollFadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center mb-4 font-display">What to Know</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
              Plan ahead for weather, local events, and things to do during your stay.
            </p>
          </ScrollFadeIn>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <ScrollFadeIn delay={0}>
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                <div className="w-12 h-12 bg-magenta/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <PartyPopper className="w-6 h-6 text-magenta" />
                </div>
                <h3 className="font-bold text-navy mb-2">Mardi Gras Season</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  The conference falls during Mardi Gras season. Expect street closures, parade traffic, and busy airports. Book flights and transfers earlier than usual for the best rates and availability.
                </p>
              </div>
            </ScrollFadeIn>
            <ScrollFadeIn delay={100}>
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CloudRain className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-navy mb-2">Weather</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  February in New Orleans averages highs in the mid-60s F and lows in the 40s. The humid climate can make it feel warmer or colder than expected. Bring layers and an umbrella.
                </p>
              </div>
            </ScrollFadeIn>
            <ScrollFadeIn delay={200}>
              <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-navy mb-2">What to Explore</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  The French Quarter, Bourbon Street, and the Garden District are all within easy reach. World-class food, live jazz, and historic architecture are around every corner.
                </p>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* Register CTA */}
      <section className="bg-navy py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollFadeIn>
            <Zap className="w-12 h-12 text-magenta mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
              Ready to AMPLIFY?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Register for the conference to unlock your Passkey hotel booking link and secure the $289/night exclusive rate.
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
