import { useState, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'

const GameArcade = lazy(() => import('./GameArcade'))

export default function Footer() {
  const [showGame, setShowGame] = useState(false)

  return (
    <>
      {showGame && (
        <Suspense fallback={null}>
          <GameArcade onClose={() => setShowGame(false)} />
        </Suspense>
      )}
      <footer className="bg-navy-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img src="/logos/ww-logo-white.svg" alt="WorkWave" className="h-6" />
                <span className="font-display font-bold text-lg">AMPLIFY</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Jan 31 - Feb 3, 2027<br />
                Hilton New Orleans Riverside<br />
                New Orleans, LA
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3">Conference</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/sessions" className="hover:text-white transition-colors">Sessions</Link></li>
                <li><Link to="/my-agenda" className="hover:text-white transition-colors">My Agenda</Link></li>
                <li><Link to="/partners" className="hover:text-white transition-colors">Partners</Link></li>
                <li><Link to="/travel" className="hover:text-white transition-colors">Travel & Hotel</Link></li>
                <li><Link to="/#poll" className="hover:text-white transition-colors">Take The Poll</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3">WorkWave</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="https://www.workwave.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    WorkWave.com
                  </a>
                </li>
                <li>
                  <a href="mailto:events@workwave.com" className="hover:text-white transition-colors">
                    events@workwave.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3">Get Started</h4>
              <a
                href="https://workwaveconference.cventevents.com/9AWddk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-magenta hover:bg-magenta-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Register Now
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} WorkWave. All rights reserved.</p>
            <button
              onClick={() => setShowGame(true)}
              className="mt-3 text-gray-600 hover:text-gray-400 text-xs transition-colors cursor-pointer"
            >
              Need a break?
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}
