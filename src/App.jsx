import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DiprosesPage from "./pages/DiprosesPage";
import DetailPage from "./pages/DetailPage";
import MappingPage from "./pages/MappingPage";
import NotFound from "./pages/NotFound";
import Diverifikasi from "./pages/DiverifikasiPage";
import Diterima from "./pages/DiterimaPage";
import AnggaranPage from "./pages/AnggaranPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomAlert from "./components/CustomAlert";
import DiterimaDetailPage from "./pages/DiterimaDetailPage";
import "./index.css";
import DiverifikasiDetailPage from "./pages/DiverifikasiDetailPage";
import SchedulePage from "./pages/SchedulePage";
import CreateAccountPage from "./pages/CreateAccountPage";
import HistoryPage from "./pages/HistoryPage";
import DetailDonePage from "./pages/DetailDonePage";
import OngoingPage from "./pages/OngoingPage";
import PengambilanDataPage from "./pages/PengambilanDataPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element = {<LoginPage />} />
        <Route path="/dashboard/*" element = { <ProtectedRoute> <Dashboard /> </ProtectedRoute> }/>
        <Route path="/diproses" element = { <ProtectedRoute> <DiprosesPage /> </ProtectedRoute> } />
        <Route path="/diproses/detail/:id" element={ <ProtectedRoute> <DetailPage /> </ProtectedRoute> } />
        <Route path="/mapping" element={ <ProtectedRoute> <MappingPage /> </ProtectedRoute> } />
        <Route path="/diverifikasi" element={ <ProtectedRoute> <Diverifikasi /> </ProtectedRoute> } />
        <Route path="/diterima" element={ <ProtectedRoute> <Diterima /> </ProtectedRoute> } />
        <Route path="/anggaran" element={ <ProtectedRoute> <AnggaranPage /> </ProtectedRoute> } />
        <Route path="/diverifikasi/detail" element={ <ProtectedRoute> <DiverifikasiDetailPage /> </ProtectedRoute> } />
        <Route path="/atur-jadwal-pendaftaran" element={ <ProtectedRoute> <SchedulePage /> </ProtectedRoute> } />
        <Route path="/tambah-akun-cabang" element={ <ProtectedRoute> <CreateAccountPage /> </ProtectedRoute> } />
        <Route path="/riwayat-pendaftar-magang" element={ <ProtectedRoute> <HistoryPage/> </ProtectedRoute> } />
        <Route path="/riwayat-pendaftar-magang/detail/:id" element={ <ProtectedRoute> <DetailDonePage/> </ProtectedRoute> } />
        <Route path="/monitoring-peserta-magang" element={ <ProtectedRoute> <OngoingPage/> </ProtectedRoute> } /> 
        <Route path="/pengambilan-data" element={ <ProtectedRoute> <PengambilanDataPage/> </ProtectedRoute> } /> 
        <Route path="/intern/diterima/detail" element={ <ProtectedRoute> <DiterimaDetailPage /> </ProtectedRoute> } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CustomAlert />
    </Router>    
  );
}
export default App;
