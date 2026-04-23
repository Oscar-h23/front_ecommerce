import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClienteDashboard from "./pages/cliente/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProductos from "./pages/admin/Productos";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Cliente — cualquier usuario logueado */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <ClienteDashboard />
          </PrivateRoute>
        } />

        {/* Admin — solo rol ADMIN */}
        <Route path="/admin" element={
          <PrivateRoute soloAdmin>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin/productos" element={
          <PrivateRoute soloAdmin>
            <AdminProductos />
          </PrivateRoute>
        } />

        {/* Raíz → redirige según rol */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Cualquier ruta desconocida */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
