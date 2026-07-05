import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut, Search, ChevronDown, LayoutGrid } from "lucide-react";
import { useCart } from "../context/CartContext";
import useAuthStore from "../store/authStore";
import axiosClient from "../api/axiosClient";

export default function Navbar({ onCartToggle }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  
  // Categories State
  const [categorias, setCategorias] = useState([]);
  const [isCatMenuOpen, setIsCatMenuOpen] = useState(false);
  const catMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (catMenuRef.current && !catMenuRef.current.contains(event.target)) {
        setIsCatMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Fetch categories for the dropdown
    axiosClient.get("/categorias")
      .then(({ data }) => setCategorias(data.filter(c => c.activo)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const delay = setTimeout(async () => {
        try {
          const { data } = await axiosClient.get("/productos");
          const results = data.filter(p => p.nombre.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
          setSearchResults(results);
          setIsSearchOpen(true);
        } catch (e) {
          console.error(e);
        }
      }, 300);
      return () => clearTimeout(delay);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  const getSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return (
    <nav className="sticky top-0 z-50 bg-surface-900/80 backdrop-blur-xl border-b border-surface-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 no-underline shrink-0">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="font-display font-extrabold text-white text-sm">S</span>
            </div>
            <span className="hidden sm:block font-display font-bold text-lg text-slate-100 tracking-tight">
              SERVITEK
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 shrink-0">
            <Link 
              to="/" 
              onClick={(e) => {
                if (location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="text-sm font-medium text-surface-400 hover:text-brand-400 transition-colors"
            >
              Inicio
            </Link>

            <div className="relative" ref={catMenuRef}>
              <button 
                onClick={() => setIsCatMenuOpen(!isCatMenuOpen)}
                className={`text-sm font-medium transition-all flex items-center gap-1 focus:outline-none cursor-pointer active:scale-95 ${isCatMenuOpen ? 'text-brand-400' : 'text-surface-400 hover:text-brand-400'}`}
              >
                Productos
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCatMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCatMenuOpen && (
                <div className="absolute top-full left-0 mt-6 w-64 bg-surface-900 border border-surface-700/50 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">
                    Categorias
                  </div>
                  <ul className="flex flex-col gap-1">
                    <li>
                      <Link
                        to="/?categoria="
                        onClick={() => setIsCatMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-200 hover:bg-brand-500/10 hover:text-brand-400 transition-colors"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        Todo el catalogo
                      </Link>
                    </li>
                    {categorias.map(c => (
                      <li key={c.id}>
                        <Link
                          to={`/?categoria=${c.id}`}
                          onClick={() => setIsCatMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-200 hover:bg-surface-800 transition-colors"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500/50"></div>
                          {c.nombre}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link to="/quienes-somos" className="text-sm font-medium text-surface-400 hover:text-brand-400 transition-colors">
              Nosotros
            </Link>
            <Link to="/soporte" className="text-sm font-medium text-surface-400 hover:text-brand-400 transition-colors">
              Soporte
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative" ref={searchRef}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-surface-400 group-focus-within:text-brand-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Buscar equipos, componentes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if(searchQuery.length > 1) setIsSearchOpen(true); }}
                className="block w-full pl-10 pr-3 py-2 border border-surface-700 rounded-xl leading-5 bg-surface-800/50 text-slate-200 placeholder-surface-400 focus:outline-none focus:bg-surface-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all sm:text-sm"
              />
            </div>

            {/* Dropdown Results */}
            {isSearchOpen && (
              <div className="absolute mt-2 w-full bg-surface-900 border border-surface-700/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                {searchResults.length > 0 ? (
                  <ul className="max-h-96 overflow-y-auto py-2 custom-scrollbar">
                    {searchResults.map((p) => (
                      <li key={p.id}>
                        <Link
                          to={`/producto/${p.id}/${getSlug(p.nombre)}`}
                          onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-surface-800 transition-colors group no-underline"
                        >
                          <div className="w-10 h-10 bg-surface-950 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-white/5">
                            {p.imagenUrl ? (
                              <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-contain" />
                            ) : (
                              <Search className="w-4 h-4 text-surface-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate group-hover:text-brand-400 transition-colors">
                              {p.nombre}
                            </p>
                            <p className="text-xs text-surface-500 truncate">
                              {p.categoria?.nombre}
                            </p>
                          </div>
                          <div className="font-bold text-slate-200 text-sm">
                            S/ {Number(p.precio).toFixed(2)}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center text-surface-400 text-sm">
                    No se encontraron productos para "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="cart-toggle"
              onClick={onCartToggle}
              className="relative p-2.5 rounded-lg bg-surface-800 hover:bg-surface-700 border border-surface-700/50 transition-all cursor-pointer active:scale-95"
            >
              <ShoppingCart className="w-5 h-5 text-slate-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to={user.rol === "ADMIN" ? "/admin" : "/dashboard"}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-800 hover:bg-surface-700 border border-surface-700/50 transition-all no-underline active:scale-95"
                >
                  <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">
                      {user.nombre?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-slate-300">{user.nombre?.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-lg hover:bg-surface-800 border border-transparent hover:border-surface-700/50 transition-all cursor-pointer bg-transparent active:scale-95"
                  title="Cerrar sesion"
                >
                  <LogOut className="w-4 h-4 text-surface-400 hover:text-rose-400" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all no-underline active:scale-95"
              >
                <User className="w-4 h-4" />
                Ingresar
              </Link>
            )}

            <button
              className="md:hidden p-2 rounded-lg bg-surface-800 border border-surface-700/50 cursor-pointer active:scale-95"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-slate-300" />
              ) : (
                <Menu className="w-5 h-5 text-slate-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-surface-700/50 bg-surface-900 px-4 py-4 space-y-2">
          <Link
            to="/"
            className="block px-4 py-2.5 rounded-lg text-sm text-surface-400 hover:text-slate-100 hover:bg-surface-800 no-underline"
            onClick={() => setMobileOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/#catalogo"
            className="block px-4 py-2.5 rounded-lg text-sm text-surface-400 hover:text-slate-100 hover:bg-surface-800 no-underline"
            onClick={() => setMobileOpen(false)}
          >
            Catalogo
          </Link>
          {user ? (
            <>
              <Link
                to={user.rol === "ADMIN" ? "/admin" : "/dashboard"}
                className="block px-4 py-2.5 rounded-lg text-sm text-brand-400 hover:bg-surface-800 no-underline"
                onClick={() => setMobileOpen(false)}
              >
                Mi cuenta
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-rose-400 hover:bg-surface-800 cursor-pointer bg-transparent border-none"
              >
                Cerrar sesion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-4 py-2.5 rounded-lg text-sm text-brand-400 font-semibold hover:bg-surface-800 no-underline"
              onClick={() => setMobileOpen(false)}
            >
              Ingresar
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
