import { useState, useEffect } from "react";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import StoreLayout from "../components/StoreLayout";
import HeroCarousel from "../components/HeroCarousel";
import BrandSlider from "../components/BrandSlider";
import FeaturedCarousel from "../components/FeaturedCarousel";
import CategoryBento from "../components/CategoryBento";
import ProductCard from "../components/ProductCard";
import CategoryCarousel from "../components/CategoryCarousel";
import { Search, ShoppingCart, Star, Filter, ShieldCheck, Truck, Clock } from "lucide-react";
import axiosClient from "../api/axiosClient";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export default function StorePage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [catSeleccionada, setCatSeleccionada] = useState("");
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const [showDropdown, setShowDropdown] = useState(false);

  const location = useLocation();

  useEffect(() => {
    cargarDatos();
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaQuery = searchParams.get("categoria");

  useEffect(() => {
    if (categoriaQuery !== null) {
      setCatSeleccionada(categoriaQuery);
      setTimeout(() => {
        const el = document.getElementById("catalogo");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      setCatSeleccionada("");
    }
  }, [categoriaQuery]);

  useEffect(() => {
    if (location.hash === "#catalogo") {
      const el = document.getElementById("catalogo");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location, loading]);

  async function cargarDatos() {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        axiosClient.get("/productos"),
        axiosClient.get("/categorias")
      ]);
      setProductos(pRes.data.filter(p => p.activo));
      setCategorias(cRes.data.filter(c => c.activo));
    } catch (err) {
      toast.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  }

  const productosFiltrados = productos.filter((p) => {
    const matchCat = catSeleccionada ? p.categoria?.id === Number(catSeleccionada) : true;
    const matchSearch = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchSearch;
  });

  const searchResults = busqueda.length > 0 
    ? productosFiltrados.slice(0, 4) 
    : [];

  const handleAdd = (producto) => {
    addToCart(producto);
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  return (
    <StoreLayout>
      <HeroCarousel />

      {/* Premium Benefits Section */}
      <div className="bg-surface-950 py-12 border-b border-surface-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-100 font-bold text-sm uppercase tracking-wider">Envios a todo el Peru</h4>
                <p className="text-surface-400 text-xs">Seguros y garantizados</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-100 font-bold text-sm uppercase tracking-wider">Garantia Oficial</h4>
                <p className="text-surface-400 text-xs">Productos 100% originales</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-100 font-bold text-sm uppercase tracking-wider">Soporte 24/7</h4>
                <p className="text-surface-400 text-xs">Asistencia tecnica experta</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BrandSlider />
      
      {productos.length > 0 && <FeaturedCarousel products={productos} />}
      
      <CategoryBento />

      {/* Catalogo Principal */}
      <div id="catalogo" className="py-20 bg-slate-900 border-t border-surface-800">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-100">Catalogo Completo</h2>
              <p className="text-surface-400 mt-2">Encuentra el equipo ideal para tus necesidades</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative">
              <div 
                className="relative flex-1 md:w-80"
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setShowDropdown(true);
                  }}
                  className="w-full bg-surface-800 border border-surface-700 text-slate-200 rounded-full pl-12 pr-6 py-3 focus:outline-none focus:border-brand-500 transition-colors"
                />

                {/* Dropdown Predictivo */}
                {showDropdown && busqueda.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-surface-800 border border-surface-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {searchResults.length > 0 ? (
                      searchResults.map((p) => (
                        <div 
                          key={p.id} 
                          className="flex items-center gap-3 p-3 hover:bg-surface-700 cursor-pointer transition-colors"
                          onClick={() => {
                            setBusqueda(p.nombre);
                            setShowDropdown(false);
                          }}
                        >
                          <div className="w-10 h-10 bg-surface-900 rounded-lg p-1 shrink-0 flex items-center justify-center">
                            {p.imagenUrl ? (
                              <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-contain" />
                            ) : (
                              <div className="text-[8px] text-surface-500">IMG</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate">{p.nombre}</p>
                            <p className="text-xs text-brand-400">S/ {p.precio.toFixed(2)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-surface-400">
                        No se encontraron resultados
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 pointer-events-none" />
                <select
                  value={catSeleccionada}
                  onChange={(e) => {
                    setCatSeleccionada(e.target.value);
                    if (e.target.value) {
                      setSearchParams({ categoria: e.target.value });
                    } else {
                      setSearchParams({});
                    }
                  }}
                  className="w-full sm:w-48 bg-surface-800 border border-surface-700 text-slate-200 rounded-full pl-12 pr-8 py-3 appearance-none focus:outline-none focus:border-brand-500 transition-colors cursor-pointer"
                >
                  <option value="">Todas las categorias</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-surface-800/50 border border-surface-700 rounded-2xl p-4 animate-pulse">
                  <div className="w-full aspect-square bg-surface-700 rounded-xl mb-4" />
                  <div className="h-4 bg-surface-700 rounded w-1/3 mb-2" />
                  <div className="h-5 bg-surface-700 rounded w-full mb-4" />
                  <div className="h-8 bg-surface-700 rounded w-1/2 mt-auto" />
                </div>
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="text-center py-20 bg-surface-800/50 rounded-3xl border border-surface-700">
              <Search className="w-16 h-16 text-surface-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-slate-300">No se encontraron productos</h3>
              <p className="text-surface-400 mt-2">Intenta ajustar los filtros de busqueda</p>
            </div>
          ) : (busqueda || catSeleccionada) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productosFiltrados.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {categorias.map(cat => {
                const prods = productosFiltrados.filter(p => p.categoria?.id === cat.id);
                if (prods.length === 0) return null;
                return <CategoryCarousel key={cat.id} category={cat} products={prods} />;
              })}
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}
