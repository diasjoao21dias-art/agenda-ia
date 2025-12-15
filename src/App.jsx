import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Success from './pages/Success'
import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agendar" element={<Booking />} />
      <Route path="/sucesso" element={<Success />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App
