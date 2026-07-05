import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function PrivateRoute({ children, soloAdmin = false }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (soloAdmin && user?.rol !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}