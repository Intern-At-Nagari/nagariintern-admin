import { useState } from 'react'
import LoginPage from './components/LoginPage' 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DiprosesPage from './components/DiProsesPage';
import DetailPage from './components/DetailPage';
import MappingPage from './components/MappingPage';
import NotFound from './components/NotFound';
import Diverifikasi from './components/DiverifikasiPage';
import Diterima from './components/DiterimaPage';
import SedangBerlangsungPage from './components/SedangBerlangsungPage';
import SelesaiPage from './components/SelesaiPage';
import CetakSertifPage from './components/CetakSertifPage';


function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<NotFound/>} />
        <Route path="/diproses" element={<DiprosesPage />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/mapping" element={<MappingPage />} />
        <Route path="/diverifikasi" element={<Diverifikasi />} />
        <Route path="/diterima" element={<Diterima />} />
        <Route path="/sedang-berlangsung" element={<SedangBerlangsungPage />} />
        <Route path="/Selesai" element={<SelesaiPage />} />
        <Route path="/cetak-sertif" element={<CetakSertifPage />} />
      </Routes>
    </Router>
  )
}

export default App