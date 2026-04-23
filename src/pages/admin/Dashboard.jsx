import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

const API = "http://localhost:9001/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ productos: 0, categorias: 0, usuarios: 0, pedidos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/productos`).then(r => r.json()).catch(() => []),
      fetch(`${API}/categorias`).then(r => r.json()).catch(() => []),
      fetch(`${API}/usuarios`).then(r => r.json()).catch(() => []),
      fetch(`${API}/pedidos`).then(r => r.json()).catch(() => []),
    ]).then(([productos, categorias, usuarios, pedidos]) => {
      setStats({
        productos: productos.length,
        categorias: categorias.length,
        usuarios: usuarios.length,
        pedidos: pedidos.length,
      });
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Productos",   value: stats.productos,   icon: "📦", accent: true },
    { label: "Categorías",  value: stats.categorias,  icon: "🗂️" },
    { label: "Usuarios",    value: stats.usuarios,    icon: "👥" },
    { label: "Pedidos",     value: stats.pedidos,     icon: "🛒" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="page">
        <p style={{ color: "var(--muted)", marginBottom: 28, fontSize: "0.9rem" }}>
          Resumen general de tu tienda
        </p>

        {loading ? (
          <div className="loading">Cargando estadísticas...</div>
        ) : (
          <div className="stats-grid">
            {cards.map((c) => (
              <div className="stat-card" key={c.label}>
                <div className="stat-label">{c.icon} {c.label}</div>
                <div className={`stat-value ${c.accent ? "accent" : ""}`}>{c.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Acceso rápido */}
        <h2 style={{ marginBottom: 16, fontSize: "1rem" }}>Acceso rápido</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/admin/productos" style={{ textDecoration: "none" }}>
            <button className="btn btn-secondary">📦 Gestionar productos</button>
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}