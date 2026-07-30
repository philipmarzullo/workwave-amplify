import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'

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
    : 'hover:text-gold'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className={`flex items-center gap-2 font-bold text-xl ${textColor}`}>
            <Zap className="w-7 h-7 text-gold" />
            Amplify
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/sessions" className={`text-sm font-medium ${textColor} ${linkHover} transition-colors`}>
              Sessions
            </Link>
            <Link to="/my-agenda" className={`text-sm font-medium ${textColor} ${linkHover} transition-colors`}>
              My Agenda
            </Link>
            <a
              href="https://www.workwave.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold hover:bg-gold-dark text-navy text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
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
            <a
              href="https://www.workwave.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gold hover:bg-gold-dark text-navy text-sm font-semibold px-5 py-2.5 rounded-lg text-center transition-colors"
            >
              Register Now
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
