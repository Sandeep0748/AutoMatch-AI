import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Questionnaire from './pages/Questionnaire'
import Results from './pages/Results'
import Shortlist from './pages/Shortlist'
import ShortlistButton from './components/Layout/ShortlistButton'
import Navigation from './components/Layout/Navigation'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/results" element={<Results />} />
          <Route path="/shortlist" element={<Shortlist />} />
        </Routes>
        <ShortlistButton />
      </div>
    </Router>
  )
}

export default App
