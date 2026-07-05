import { Link } from "react-router-dom";
import { Monitor, Cpu, Headset, Laptop } from "lucide-react";

export default function CategoryBento() {
  return (
    <div className="py-20 bg-slate-950">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Explora nuestro ecosistema
          </h2>
          <p className="text-surface-400">
            Todo lo que necesitas para construir el setup de tus suenos, desde portatiles ultra-ligeras hasta componentes de alto rendimiento para gaming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-[800px] md:h-[600px]">
          
          {/* Laptops - Large Tile */}
          <Link to="#catalogo" className="group relative rounded-3xl overflow-hidden md:col-span-2 md:row-span-2 bg-surface-900 border border-surface-800 hover:border-brand-500/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=2042" 
              alt="Laptops" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 backdrop-blur-md flex items-center justify-center mb-4 border border-brand-500/30">
                <Laptop className="w-6 h-6 text-brand-300" />
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-2">Laptops Gamers</h3>
              <p className="text-slate-300 max-w-md">Portatiles con la maxima potencia para dominar en cualquier lugar. RTX Serie 40 y pantallas de hasta 240Hz.</p>
            </div>
          </Link>

          {/* Componentes - Medium Tile */}
          <Link to="#catalogo" className="group relative rounded-3xl overflow-hidden bg-surface-900 border border-surface-800 hover:border-purple-500/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070" 
              alt="Componentes" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute bottom-0 left-0 p-6 z-20">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 backdrop-blur-md flex items-center justify-center mb-3 border border-purple-500/30">
                <Cpu className="w-5 h-5 text-purple-300" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-1">Componentes PC</h3>
              <p className="text-sm text-slate-300">Arma la PC de tus suenos</p>
            </div>
          </Link>

          {/* Perifericos - Medium Tile */}
          <Link to="#catalogo" className="group relative rounded-3xl overflow-hidden bg-surface-900 border border-surface-800 hover:border-emerald-500/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=2071" 
              alt="Perifericos" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute bottom-0 left-0 p-6 z-20">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 backdrop-blur-md flex items-center justify-center mb-3 border border-emerald-500/30">
                <Headset className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-1">Perifericos</h3>
              <p className="text-sm text-slate-300">Accesorios nivel Pro</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
