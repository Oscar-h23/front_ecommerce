import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-surface-900 border-t border-surface-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="font-display font-extrabold text-white text-sm">S</span>
              </div>
              <span className="font-display font-bold text-lg text-slate-100">
                SERVITEK
              </span>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed">
              Soluciones tecnologicas de alto rendimiento. Venta de laptops, monitores
              y equipos informaticos de las mejores marcas del mercado.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-slate-200 mb-4 uppercase tracking-wider">
              Navegacion
            </h4>
            <ul className="space-y-2.5 list-none p-0">
              <li>
                <Link to="/" className="text-surface-400 hover:text-brand-400 text-sm transition-colors no-underline">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/#catalogo" className="text-surface-400 hover:text-brand-400 text-sm transition-colors no-underline">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/quienes-somos" className="text-surface-400 hover:text-brand-400 text-sm transition-colors no-underline">
                  Quienes Somos
                </Link>
              </li>
              <li>
                <Link to="/soporte" className="text-surface-400 hover:text-brand-400 text-sm transition-colors no-underline">
                  Soporte
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-slate-200 mb-4 uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-3 list-none p-0">
              <li className="flex items-center gap-3 text-surface-400 text-sm">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                ventas@servitek.pe
              </li>
              <li className="flex items-center gap-3 text-surface-400 text-sm">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                +51 987 654 321
              </li>
              <li className="flex items-center gap-3 text-surface-400 text-sm">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                Lima, Peru
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-700/50 mt-10 pt-6 text-center">
          <p className="text-surface-500 text-xs">
            2026 Servitek Technologies. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
