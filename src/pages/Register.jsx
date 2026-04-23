import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:9001/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "", password: "", telefono: "" });
  const [msg, setMsg]   = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      const res = await fetch(`${API}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rol: "CLIENTE" }),
      });
      if (!res.ok) throw new Error();
      setMsg({ type: "success", text: "Cuenta creada. Redirigiendo al login..." });
      setTimeout(() => navigate("/login"), 1800);
    } catch {
      setMsg({ type: "error", text: "Error al registrar. El email puede estar en uso." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="brand">SHOP<span style={{ color: "var(--accent)" }}>.</span>ADMIN</div>
        <p className="brand-sub">
          Crea tu cuenta y empieza a comprar en nuestra tienda.
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Crear cuenta</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 28 }}>
            Completa el formulario para registrarte
          </p>

          {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Nombre completo</label>
              <input value={form.nombre} onChange={set("nombre")} placeholder="Oscar Pérez" required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="tu@email.com" required />
            </div>
            <div className="field">
              <label>Contraseña</label>
              <input type="password" value={form.password} onChange={set("password")} placeholder="••••••••" required />
            </div>
            <div className="field">
              <label>Teléfono</label>
              <input value={form.telefono} onChange={set("telefono")} placeholder="987654321" />
            </div>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Creando cuenta..." : "Registrarme"}
            </button>
          </form>

          <p style={{ marginTop: 20, textAlign: "center", fontSize: "0.88rem", color: "var(--muted)" }}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}