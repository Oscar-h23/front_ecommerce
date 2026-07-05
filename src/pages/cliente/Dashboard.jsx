import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, LogOut, ShoppingBag, User, Pencil, KeyRound, MapPin, Phone, Mail, Shield } from "lucide-react";
import StoreLayout from "../../components/StoreLayout";
import useAuthStore from "../../store/authStore";
import OrderHistory from "./OrderHistory";
import axiosClient from "../../api/axiosClient";
import { toast } from "sonner";

function ProfileEditModal({ user, onClose, onSaved }) {
  const [activeTab, setActiveTab] = useState("datos");
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    telefono: user?.telefono || "",
    direccion: user?.direccion || "",
    password: "",
    currentPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === "seguridad" && form.password) {
        if (!form.currentPassword) {
          toast.error("Debes ingresar tu contraseña actual para cambiarla");
          setLoading(false);
          return;
        }
        // Validar contraseña actual con el backend
        const validRes = await axiosClient.post(`/usuarios/${user.id}/validar-password`, { password: form.currentPassword });
        if (!validRes.data.valid) {
          toast.error("La contraseña actual es incorrecta");
          setLoading(false);
          return;
        }
      }

      // Actualizar usuario
      const payload = {
        ...user,
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: form.direccion,
      };
      if (form.password) {
        payload.password = form.password;
      }

      const { data } = await axiosClient.put(`/usuarios/${user.id}`, payload);
      toast.success("Perfil actualizado correctamente");
      onSaved(data);
    } catch (err) {
      toast.error("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-surface-900 border border-surface-700 w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-surface-700/50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-400" />
            Editar Perfil
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-800 text-surface-400 transition-colors">
            &times;
          </button>
        </div>

        <div className="flex border-b border-surface-700/50">
          <button 
            className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'datos' ? 'border-brand-500 text-brand-400' : 'border-transparent text-surface-400 hover:text-slate-300'}`}
            onClick={() => setActiveTab('datos')}
          >
            Datos Personales
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'seguridad' ? 'border-brand-500 text-brand-400' : 'border-transparent text-surface-400 hover:text-slate-300'}`}
            onClick={() => setActiveTab('seguridad')}
          >
            Seguridad
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "datos" ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-1">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input type="text" required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full bg-surface-950 border border-surface-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-1">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input type="tel" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} className="w-full bg-surface-950 border border-surface-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500 transition-colors" placeholder="Ej: 999 999 999" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-1">Dirección de Envío</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-surface-500" />
                    <textarea rows="2" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} className="w-full bg-surface-950 border border-surface-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500 transition-colors resize-none" placeholder="Ingresa tu dirección completa" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 mb-2">
                  <Shield className="w-5 h-5 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-500/90 leading-relaxed">Si dejas el campo de nueva contraseña en blanco, tu contraseña actual no será modificada.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-400 mb-1">Nueva Contraseña</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                    <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-surface-950 border border-surface-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500 transition-colors" placeholder="••••••••" minLength="6" />
                  </div>
                </div>
                {form.password && (
                  <div>
                    <label className="block text-xs font-medium text-surface-400 mb-1">Confirma tu Contraseña Actual</label>
                    <input type="password" required value={form.currentPassword} onChange={e => setForm({...form, currentPassword: e.target.value})} className="w-full bg-surface-950 border border-surface-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-rose-500 transition-colors" placeholder="Requerida para autorizar el cambio" />
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-surface-700/50 flex justify-end gap-3 mt-6">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-surface-800 rounded-xl transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-400 rounded-xl transition-all shadow-lg shadow-brand-500/20 active:scale-95 disabled:opacity-50">
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ClienteDashboard() {
  const navigate = useNavigate();
  const { user, setUser, logout: logoutZustand } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  function logout() {
    logoutZustand();
    navigate("/login");
  }

  return (
    <StoreLayout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-surface-800 rounded-2xl flex items-center justify-center border border-surface-700">
              <User className="w-8 h-8 text-brand-400" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-100">
                Hola, {user?.nombre || "Cliente"}
              </h1>
              <p className="text-surface-400">Gestiona tus pedidos y cuenta</p>
            </div>
          </div>
          <button onClick={logout} className="btn btn-outline border-surface-700 hover:border-rose-500 hover:bg-rose-500/10 hover:text-rose-400">
            <LogOut className="w-4 h-4" />
            Cerrar Sesion
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="card">
              <div className="flex items-center gap-3 mb-6 border-b border-surface-700/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-brand-400" />
                </div>
                <h2 className="text-xl font-display font-bold">Mis Pedidos</h2>
              </div>
              
              <OrderHistory />
            </div>
          </div>

          <div className="md:col-span-1 space-y-6">
            <div className="card bg-surface-800/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-slate-200">Datos de la Cuenta</h3>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 rounded-lg bg-surface-800 hover:bg-brand-500/20 text-surface-400 hover:text-brand-400 transition-colors border border-surface-700/50 hover:border-brand-500/30"
                  title="Editar Perfil"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-surface-500 block mb-1">Nombre</span>
                  <span className="text-slate-300 font-medium">{user?.nombre}</span>
                </div>
                <div>
                  <span className="text-surface-500 block mb-1">Email</span>
                  <span className="text-slate-300 font-medium">{user?.email}</span>
                </div>
                <div>
                  <span className="text-surface-500 block mb-1">Telefono</span>
                  <span className="text-slate-300 font-medium">{user?.telefono || "No registrado"}</span>
                </div>
                <div>
                  <span className="text-surface-500 block mb-1">Dirección de Envío</span>
                  <span className="text-slate-300 font-medium leading-relaxed">{user?.direccion || "No registrada"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <ProfileEditModal 
          user={user} 
          onClose={() => setIsEditModalOpen(false)} 
          onSaved={(updatedUser) => {
            setUser(updatedUser);
            setIsEditModalOpen(false);
          }} 
        />
      )}
    </StoreLayout>
  );
}