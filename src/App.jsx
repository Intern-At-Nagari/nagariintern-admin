import { useState } from 'react'
import LoginPage from './components/LoginPage' 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';


function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App