import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveUser } from "../components/PrivateRoute";
import "./Login.css";

const API = "http://localhost:9001/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/usuarios`);
      const usuarios = await res.json();

      const user = usuarios.find(
        (u) => u.email === form.email && u.activo
      );

      if (!user) {
        setError("Email o contraseña incorrectos.");
        return;
      }

      saveUser(user);

      // Redirige según rol
      if (user.rol === "ADMIN") navigate("/admin");
      else navigate("/dashboard");

    } catch {
      setError("No se pudo conectar al servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    
    <div className="auth-wrap">
      

      <div className="auth-right">
        <div className="auth-card">
          <h2>Bienvenido</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 28 }}>
            Ingresa tus credenciales para continuar
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="tu@email.com" required />
            </div>
            <div className="field">
              <label>Contraseña</label>
              <input type="password" value={form.password} onChange={set("password")} placeholder="••••••••" required />
            </div>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>

          <p style={{ marginTop: 20, textAlign: "center", fontSize: "0.88rem", color: "var(--muted)" }}>
            ¿No tienes cuenta?{" "}
            <Link to="/register" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}