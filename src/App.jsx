import { useState } from 'react'
import LoginPage from './pages/LoginPage' 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DiprosesPage from './pages/DiprosesPage';
import DetailPage from './pages/DetailPage';
import MappingPage from './pages/MappingPage';
import NotFound from './pages/NotFound';
import Diverifikasi from './pages/DiverifikasiPage';
import Diterima from './pages/DiterimaPage';
import SedangBerlangsungPage from './pages/SedangBerlangsungPage';
import SelesaiPage from './pages/SelesaiPage';
import CetakSertifPage from './pages/CetakSertifPage';


function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman login */}
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<NotFound/>} />
        <Route path="/diproses" element={<DiprosesPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/mapping" element={<MappingPage />} />
        <Route path="/diverifikasi" element={<Diverifikasi />} />
        <Route path="/diterima" element={<Diterima />} />
        <Route path="/sedang-berlangsung" element={<SedangBerlangsungPage />} />
        <Route path="/Selesai" element={<SelesaiPage />} />
        <Route path="/cetak-sertif" element={<CetakSertifPage />} />
      </Routes>
    </Router>
  );
}

export default App;
