import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DiprosesPage from "./pages/DiprosesPage";
import DetailPage from "./pages/DetailPage";
import MappingPage from "./pages/MappingPage";
import NotFound from "./pages/NotFound";
import Diverifikasi from "./pages/DiverifikasiPage";
import Diterima from "./pages/DiterimaPage";
import SedangBerlangsungPage from "./pages/SedangBerlangsungPage";
import SelesaiPage from "./pages/SelesaiPage";
import CetakSertifPage from "./pages/CetakSertifPage";
import AnggaranPage from "./pages/AnggaranPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomAlert from "./components/CustomAlert";

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
        <Route
          path="/anggaran"
          element={
            <ProtectedRoute>
              <AnggaranPage />
            </ProtectedRoute>
          }
        />
        {/* Rute Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CustomAlert />
    </Router>
    

  );
}

export default App;
