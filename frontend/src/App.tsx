import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import HomePage from './pages/HomePage'
import SessionsPage from './pages/SessionsPage'
import MyAgendaPage from './pages/MyAgendaPage'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/my-agenda" element={<MyAgendaPage />} />
      </Routes>
      <Footer />
      <ChatWidget />
    </>
  )
}
