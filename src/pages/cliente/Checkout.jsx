import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import useAuthStore from "../../store/authStore";
import StoreLayout from "../../components/StoreLayout";
import useCulqiCheckout from "../../hooks/useCulqiCheckout";
import { CreditCard, ShieldCheck, Lock, Package, CheckCircle2 } from "lucide-react";

export default function Checkout() {
  const { items, cartTotal } = useCart();
  const { isAuthenticated, user } = useAuthStore();
  const { openCheckout } = useCulqiCheckout();
  const navigate = useNavigate();

  // Si no hay items en el carrito, o no esta logueado, redirigir
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (items.length === 0) return <Navigate to="/" />;

  return (
    <StoreLayout>
      <div className="min-h-screen bg-surface-950 pt-24 pb-12">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
        
        <div className="container-custom max-w-6xl mx-auto relative z-10">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-4 tracking-tight">
              Finalizar <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Compra</span>
            </h1>
            <p className="text-surface-400 text-lg">Estas a un paso de obtener tu nuevo hardware.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Detalle del Carrito */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-surface-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Package className="w-6 h-6 text-brand-400" />
                  Resumen del Pedido
                </h2>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 bg-surface-950/50 rounded-2xl border border-white/5">
                      <div className="w-20 h-20 bg-surface-900 rounded-xl flex items-center justify-center shrink-0 p-2">
                        {product.imagenUrl ? (
                          <img src={product.imagenUrl} alt={product.nombre} className="w-full h-full object-contain mix-blend-luminosity" />
                        ) : (
                          <Package className="w-8 h-8 text-surface-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-slate-200 font-semibold truncate">{product.nombre}</h4>
                        <p className="text-surface-400 text-sm mt-1">Cant: {quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-brand-400 font-display font-bold">S/ {(product.precio * quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-start gap-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-emerald-400 font-bold mb-1">Garantía Total</h4>
                    <p className="text-emerald-400/70 text-sm leading-relaxed">Tu compra está 100% protegida y cuenta con garantía directa.</p>
                  </div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6 flex items-start gap-4">
                  <Lock className="w-8 h-8 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="text-purple-400 font-bold mb-1">Pago Seguro</h4>
                    <p className="text-purple-400/70 text-sm leading-relaxed">Procesado con encriptación militar a través de Culqi.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel de Pago */}
            <div className="lg:col-span-5">
              <div className="bg-surface-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-8">Total a Pagar</h2>
                
                <div className="space-y-4 mb-8 text-lg">
                  <div className="flex justify-between text-surface-300">
                    <span>Subtotal</span>
                    <span>S/ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-surface-300">
                    <span>Envío</span>
                    <span className="text-emerald-400 font-medium">Gratis</span>
                  </div>
                  <div className="h-px bg-white/10 my-4" />
                  <div className="flex justify-between text-white font-display font-black text-3xl">
                    <span>Total</span>
                    <span className="text-brand-400">S/ {cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={openCheckout}
                    className="w-full relative overflow-hidden group bg-white text-slate-900 font-extrabold text-lg py-5 rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] active:scale-95 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center justify-center gap-3">
                      <CreditCard className="w-6 h-6" />
                      Pagar con Tarjeta
                    </span>
                  </button>
                  
                  <p className="text-center text-sm text-surface-500 mt-4 flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Transacción segura y encriptada
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
