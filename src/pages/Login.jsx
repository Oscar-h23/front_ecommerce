import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, ArrowLeft } from "lucide-react";
import useAuthStore from "../store/authStore";
import axiosClient from "../api/axiosClient";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosClient.post("/auth/login", form);
      login(data.user, data.token);
      
      toast.success("Bienvenido a Servitek Technologies");

      if (data.user.rol === "ADMIN") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data || "Credenciales incorrectas o error de servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-surface-400 hover:text-slate-200 text-sm mb-8 transition-colors no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="auth-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <span className="font-display font-extrabold text-white text-lg">S</span>
            </div>
            <span className="font-display font-bold text-xl text-slate-100">SERVITEK</span>
          </div>

          <h2>Bienvenido</h2>
          <p className="text-surface-400 text-sm mb-7">
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="tu@email.com"
                required
              />
            </div>
            <div className="field">
              <label>Contrasena</label>
              <input
                type="password"
                value={form.password}
                onChange={set("password")}
                placeholder="tu contrasena"
                required
              />
            </div>
            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? "Entrando..." : "Iniciar sesion"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-surface-400">
            No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-brand-400 no-underline font-semibold hover:text-brand-300 transition-colors"
            >
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}