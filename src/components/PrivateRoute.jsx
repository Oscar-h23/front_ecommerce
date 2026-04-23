import { Navigate } from "react-router-dom";

// Guarda el usuario en localStorage para persistir la sesión
export function getUser() {
  try { return JSON.parse(localStorage.getItem("user")); }
  catch { return null; }
}
export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
export function removeUser() {
  localStorage.removeItem("user");
}

// soloAdmin = true  → solo deja pasar si rol === "ADMIN"
// soloAdmin = false → deja pasar a cualquier usuario logueado
export default function PrivateRoute({ children, soloAdmin = false }) {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;

  if (soloAdmin && user.rol !== "ADMIN") return <Navigate to="/dashboard" replace />;

  return children;
}