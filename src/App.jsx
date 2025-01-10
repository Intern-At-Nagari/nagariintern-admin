import { useState } from 'react'
import LoginPage from './components/LoginPage' 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DiprosesPage from './components/DiProsesPage';
import DetailPage from './components/DetailPage';
import MappingPage from './components/MappingPage';


function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path="/diproses" element={<DiprosesPage />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/mapping" element={<MappingPage />} />
      </Routes>
    </Router>
  )
}

export default App