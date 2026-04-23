import { useNavigate, useLocation, Link } from "react-router-dom";
import { getUser, removeUser } from "../../components/PrivateRoute";

const NAV = [
  { path: "/admin",          icon: "🏠", label: "Dashboard" },
  { path: "/admin/productos", icon: "📦", label: "Productos" },
];

export default function AdminLayout({ children, title }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = getUser();

  function logout() {
    removeUser();
    navigate("/login");
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          SHOP<span>.</span>
          <span style={{ fontSize: "0.7rem", color: "var(--muted)", display: "block", fontWeight: 400, marginTop: 2 }}>
            Admin panel
          </span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((n) => (
            <Link
              key={n.path}
              to={n.path}
              className={`nav-item ${location.pathname === n.path ? "active" : ""}`}
            >
              <span>{n.icon}</span> {n.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="avatar">{user?.nombre?.[0]?.toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{user?.nombre}</div>
              <div className="user-role">{user?.rol}</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Cerrar sesión">↩</button>
          </div>
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <h1>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}