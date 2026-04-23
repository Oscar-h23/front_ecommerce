import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, removeUser } from "../../components/PrivateRoute";
import API from "../../services/api";

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Nuevo estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${API}/productos`)
      .then((r) => r.json())
      .then((data) => setProductos(data.filter((p) => p.activo)))
      .finally(() => setLoading(false));
  }, []);

  function logout() {
    removeUser();
    navigate("/login");
  }

  // 2. Lógica de filtrado: Se ejecuta en cada renderizado
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoriaNombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Navbar */}
      <nav style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        padding: "0 32px",
        height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.2rem" }}>
          SHOP<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: "0.88rem", color: "var(--muted)" }}>
            Hola, <strong style={{ color: "var(--text)" }}>{user?.nombre}</strong>
          </span>
          <button className="btn btn-secondary btn-sm" onClick={logout}>Salir</button>
        </div>
      </nav>

      <div className="page">
        <h1 style={{ marginBottom: 8 }}>Catálogo de productos</h1>
        <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: "0.9rem" }}>
          Explora todos nuestros productos disponibles
        </p>

        {/* 3. BARRA DE BÚSQUEDA */}
        <div style={{ marginBottom: 32, maxWidth: "400px" }}>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
              fontSize: "0.9rem",
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {loading ? (
          <div className="loading">Cargando productos...</div>
        ) : productosFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <p>{searchTerm ? `No se encontraron resultados para "${searchTerm}"` : "No hay productos disponibles por ahora."}</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20
          }}>
            {/* 4. Usamos productosFiltrados en lugar de productos */}
            {productosFiltrados.map((p) => (
              <div key={p.id} style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{
                  height: 160,
                  background: "var(--bg)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2.5rem",
                  borderBottom: "1px solid var(--border)"
                }}>
                  {p.imagenUrl
                    ? <img src={p.imagenUrl} alt={p.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : "📦"}
                </div>

                <div style={{ padding: "16px" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 4 }}>
                    {p.categoriaNombre}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 6, fontSize: "0.95rem" }}>{p.nombre}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 12, lineHeight: 1.5 }}>
                    {p.descripcion?.slice(0, 70)}{p.descripcion?.length > 70 ? "..." : ""}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--accent)" }}>
                      S/. {Number(p.precio).toFixed(2)}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                      Stock: {p.stock}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}