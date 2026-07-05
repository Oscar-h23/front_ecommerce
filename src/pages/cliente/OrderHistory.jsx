import { useEffect, useState } from "react";
import { Package, CheckCircle2, Clock, Truck, Home } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import { toast } from "sonner";

const ESTADOS_ORDEN = ["PENDIENTE", "PAGADO", "EN_PROCESO", "ENVIADO", "ENTREGADO"];

export default function OrderHistory() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const { data } = await axiosClient.get("/pedidos/mis-pedidos");
        setPedidos(data);
      } catch (err) {
        toast.error("Error al cargar el historial de pedidos");
      } finally {
        setLoading(false);
      }
    }
    fetchPedidos();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-surface-800 rounded-xl" />
        ))}
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-800/50 rounded-2xl border border-surface-700">
        <Package className="w-12 h-12 text-surface-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-300">No hay pedidos</h3>
        <p className="text-surface-400 mt-1">Aun no has realizado ninguna compra</p>
      </div>
    );
  }

  const getStepIcon = (step) => {
    switch (step) {
      case "PENDIENTE": return <Clock className="w-4 h-4" />;
      case "PAGADO": return <CheckCircle2 className="w-4 h-4" />;
      case "EN_PROCESO": return <Package className="w-4 h-4" />;
      case "ENVIADO": return <Truck className="w-4 h-4" />;
      case "ENTREGADO": return <Home className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {pedidos.map((pedido) => {
        const currentStepIndex = ESTADOS_ORDEN.indexOf(pedido.estado);
        const isCancelled = pedido.estado === "CANCELADO";

        return (
          <div key={pedido.id} className="bg-surface-800 border border-surface-700 rounded-2xl p-6 hover:border-surface-600 transition-colors shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-brand-400">Pedido #{pedido.id}</p>
                <p className="text-xs text-surface-400 mt-1">{new Date(pedido.fechaPedido).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className="font-display font-bold text-xl text-slate-100">
                  S/ {pedido.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Timeline Visual */}
            {!isCancelled ? (
              <div className="relative mb-8 px-2">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-surface-700 -translate-y-1/2 rounded-full" />
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-brand-500 -translate-y-1/2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (ESTADOS_ORDEN.length - 1)) * 100}%` }}
                />
                
                <div className="relative flex justify-between">
                  {ESTADOS_ORDEN.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isActive = idx === currentStepIndex;
                    
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors duration-500 border-2 ${
                          isActive 
                            ? "bg-surface-900 border-brand-500 text-brand-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]" 
                            : isCompleted 
                              ? "bg-brand-500 border-brand-500 text-white" 
                              : "bg-surface-900 border-surface-700 text-surface-500"
                        }`}>
                          {getStepIcon(step)}
                        </div>
                        <span className={`text-[10px] sm:text-xs mt-2 font-semibold absolute -bottom-5 whitespace-nowrap ${
                          isActive ? "text-brand-400" : isCompleted ? "text-slate-300" : "text-surface-500"
                        }`}>
                          {step.replace("_", " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                <p className="text-rose-400 font-medium">Este pedido ha sido CANCELADO.</p>
              </div>
            )}

            <div className="mt-8 space-y-3 border-t border-surface-700/50 pt-5">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Articulos comprados:</h4>
              {pedido.detalles?.map((d) => (
                <div key={d.id} className="flex justify-between items-center text-sm bg-surface-900/50 p-3 rounded-lg border border-surface-700/50">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-md bg-surface-800 flex items-center justify-center text-xs font-semibold text-brand-400 border border-surface-700">
                      {d.cantidad}x
                    </span>
                    <span className="text-slate-300 font-medium">{d.producto.nombre}</span>
                  </div>
                  <span className="text-surface-400">S/ {d.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
