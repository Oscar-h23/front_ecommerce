import { ChevronRight, ChevronLeft, ShoppingCart, Sparkles } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export default function FeaturedCarousel({ products }) {
  const scrollRef = useRef(null);
  const { addToCart } = useCart();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleAdd = (producto) => {
    addToCart(producto);
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  return (
    <div className="py-20 bg-surface-900 relative">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-100 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-brand-400" />
              Ofertas Relampago
            </h2>
            <p className="text-surface-400 mt-2">Los equipos mas buscados al mejor precio.</p>
          </div>
        </div>
      </div>

      {/* Full-bleed track container outside of container-custom */}
      <div className="relative group/carousel mt-4 w-full">
        <button 
          onClick={() => scroll("left")} 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-surface-800 border border-surface-700 text-slate-200 shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110 hover:bg-surface-700 hidden md:flex cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => scroll("right")} 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-surface-800 border border-surface-700 text-slate-200 shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110 hover:bg-surface-700 hidden md:flex cursor-pointer active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 px-6 lg:px-16 xl:px-24 w-full scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.slice(0, 6).map((producto) => {
            const slug = producto.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const productUrl = `/producto/${producto.id}/${slug}`;
            
            let displayImage = producto.imagenUrl;
            if (!displayImage && producto.imagenesAdicionales) {
              try {
                const parsedImages = JSON.parse(producto.imagenesAdicionales);
                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                  displayImage = parsedImages[0];
                }
              } catch (e) {}
            }

            return (
              <div key={producto.id} className="min-w-[300px] md:min-w-[350px] snap-start">
                <div className="bg-surface-800/50 border border-surface-700/50 hover:border-brand-500/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col group">
                  <Link to={productUrl} className="relative aspect-square mb-6 bg-surface-900 rounded-xl overflow-hidden flex items-center justify-center p-4 block cursor-pointer">
                    {displayImage ? (
                      <img src={displayImage} alt={producto.nombre} className="w-full h-full object-contain mix-blend-screen group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-20 h-20 bg-surface-800 rounded-full flex items-center justify-center text-surface-600">
                        IMG
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-rose-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                      -15%
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col">
                    <span className="text-xs text-brand-400 font-semibold tracking-wider uppercase mb-2">
                      {producto.categoria?.nombre || "N/A"}
                    </span>
                    <Link to={productUrl}>
                      <h3 className="text-lg font-semibold text-slate-200 leading-snug line-clamp-2 mb-2 group-hover:text-brand-300 transition-colors cursor-pointer">
                        {producto.nombre}
                      </h3>
                    </Link>
                    <div className="mt-auto pt-4 flex items-end justify-between">
                      <div>
                        <span className="text-sm text-surface-500 line-through block mb-0.5">
                          S/ {(producto.precio * 1.15).toFixed(2)}
                        </span>
                        <span className="text-2xl font-display font-bold text-slate-100">
                          S/ {producto.precio.toFixed(2)}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => { e.preventDefault(); handleAdd(producto); }}
                        className="w-12 h-12 rounded-xl bg-brand-500 hover:bg-brand-600 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
