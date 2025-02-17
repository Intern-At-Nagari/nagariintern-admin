import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

  // Jika token tidak ada, redirect ke halaman login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Jika token ada, izinkan akses ke halaman
  return children;
};

export default ProtectedRoute;
