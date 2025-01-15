import { useState } from 'react'
import LoginPage from './components/LoginPage' 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DiprosesPage from './components/DiprosesPage';
import DetailPage from './components/DetailPage';
import MappingPage from './components/MappingPage';
import NotFound from './components/NotFound';
import Diverifikasi from './components/DiverifikasiPage';
import Diterima from './components/DiterimaPage';
import SedangBerlangsungPage from './components/SedangBerlangsungPage';
import SelesaiPage from './components/SelesaiPage';
import CetakSertifPage from './components/CetakSertifPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman login */}
        <Route path="/" element={<LoginPage />} />

        {/* Rute yang dilindungi */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diproses"
          element={
            <ProtectedRoute>
              <DiprosesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail/:id"
          element={
            <ProtectedRoute>
              <DetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mapping"
          element={
            <ProtectedRoute>
              <MappingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diverifikasi"
          element={
            <ProtectedRoute>
              <Diverifikasi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diterima"
          element={
            <ProtectedRoute>
              <Diterima />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sedang-berlangsung"
          element={
            <ProtectedRoute>
              <SedangBerlangsungPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/selesai"
          element={
            <ProtectedRoute>
              <SelesaiPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cetak-sertif"
          element={
            <ProtectedRoute>
              <CetakSertifPage />
            </ProtectedRoute>
          }
        />
        {/* Rute Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
