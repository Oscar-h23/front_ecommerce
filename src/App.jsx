import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { CartProvider } from "./context/CartContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StorePage from "./pages/StorePage";
import ClienteDashboard from "./pages/cliente/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProductos from "./pages/admin/Productos";
import AdminPedidos from "./pages/admin/AdminPedidos";
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import PrivateRoute from "./components/PrivateRoute";
import ScrollToTop from "./components/ScrollToTop";
import Checkout from "./pages/cliente/Checkout";
import ProductDetail from "./pages/ProductDetail";

import AboutUs from "./pages/AboutUs";
import Support from "./pages/Support";

export default function App() {
  return (
    <CartProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<StorePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quienes-somos" element={<AboutUs />} />
          <Route path="/soporte" element={<Support />} />
          <Route path="/producto/:id/:slug?" element={<ProductDetail />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <ClienteDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute soloAdmin>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <PrivateRoute soloAdmin>
                <AdminProductos />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categorias"
            element={
              <PrivateRoute soloAdmin>
                <AdminCategorias />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <PrivateRoute soloAdmin>
                <AdminUsuarios />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/pedidos"
            element={
              <PrivateRoute soloAdmin>
                <AdminPedidos />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
