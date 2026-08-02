import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navBg = scrolled || !isHome
    ? 'bg-white shadow-md'
    : 'bg-transparent'

  const textColor = scrolled || !isHome
    ? 'text-navy'
    : 'text-white'

  const linkHover = scrolled || !isHome
    ? 'hover:text-accent'
    : 'hover:text-magenta'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={scrolled || !isHome ? '/logos/ww-logo-color.svg' : '/logos/ww-logo-white.svg'}
              alt="WorkWave"
              className="h-7"
            />
            <span className={`font-display font-bold text-lg ${textColor}`}>AMPLIFY</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/sessions" className={`text-sm font-medium ${textColor} ${linkHover} transition-colors`}>
              Sessions
            </Link>
            <Link to="/my-agenda" className={`text-sm font-medium ${textColor} ${linkHover} transition-colors`}>
              My Agenda
            </Link>
            <Link to="/partners" className={`text-sm font-medium ${textColor} ${linkHover} transition-colors`}>
              Partners
            </Link>
            <Link to="/travel" className={`text-sm font-medium ${textColor} ${linkHover} transition-colors`}>
              Travel & Hotel
            </Link>
            <a href="/#poll" className={`text-sm font-medium ${textColor} ${linkHover} transition-colors`}>
              Poll
            </a>
            <Link to="/faq" className={`text-sm font-medium ${textColor} ${linkHover} transition-colors`}>
              FAQ
            </Link>
            <a
              href="https://workwaveconference.cventevents.com/9AWddk"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-magenta hover:bg-magenta-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Register Now
            </a>
          </div>

          <button
            className={`md:hidden ${textColor}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-3">
            <Link to="/sessions" className="block text-sm font-medium text-navy hover:text-accent">
              Sessions
            </Link>
            <Link to="/my-agenda" className="block text-sm font-medium text-navy hover:text-accent">
              My Agenda
            </Link>
            <Link to="/partners" className="block text-sm font-medium text-navy hover:text-accent">
              Partners
            </Link>
            <Link to="/travel" className="block text-sm font-medium text-navy hover:text-accent">
              Travel & Hotel
            </Link>
            <a href="/#poll" className="block text-sm font-medium text-navy hover:text-accent">
              Poll
            </a>
            <Link to="/faq" className="block text-sm font-medium text-navy hover:text-accent">
              FAQ
            </Link>
            <a
              href="https://workwaveconference.cventevents.com/9AWddk"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-magenta hover:bg-magenta-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg text-center transition-colors"
            >
              Register Now
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
