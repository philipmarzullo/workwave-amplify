import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import HomePage from './pages/HomePage'
import SessionsPage from './pages/SessionsPage'
import MyAgendaPage from './pages/MyAgendaPage'
import FaqPage from './pages/FaqPage'
import PartnersPage from './pages/PartnersPage'
import TravelPage from './pages/TravelPage'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/my-agenda" element={<MyAgendaPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/travel" element={<TravelPage />} />
      </Routes>
      <Footer />
      <ChatWidget />
    </>
  )
}
