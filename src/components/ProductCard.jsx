import { ShoppingCart, AlertTriangle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const slug = product.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const productUrl = `/producto/${product.id}/${slug}`;

  // Lógica para mostrar imagen
  let displayImage = product.imagenUrl;
  if (!displayImage && product.imagenesAdicionales) {
    try {
      const parsedImages = JSON.parse(product.imagenesAdicionales);
      if (Array.isArray(parsedImages) && parsedImages.length > 0) {
        displayImage = parsedImages[0];
      }
    } catch (e) {
      // JSON inválido, no hacer nada
    }
  }

  return (
    <div className="group bg-surface-900 border border-surface-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/10 hover:-translate-y-1 flex flex-col">
      <Link to={productUrl} className="relative aspect-[4/3] bg-surface-800 overflow-hidden block">
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-surface-600" />
          </div>
        )}

        {product.categoria && (
          <span className="absolute top-3 left-3 bg-surface-950/80 backdrop-blur-sm text-xs text-brand-400 px-2.5 py-1 rounded-md font-medium border border-brand-500/20">
            {product.categoria.nombre}
          </span>
        )}

        {isLowStock && (
          <span className="absolute top-3 right-3 bg-amber-500/20 backdrop-blur-sm text-amber-400 text-[10px] font-semibold px-2 py-1 rounded-md flex items-center gap-1 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            Quedan {product.stock}
          </span>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-surface-950/70 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-surface-400 text-sm font-semibold">Sin stock</span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link to={productUrl} className="hover:text-brand-400 transition-colors">
          <h3 className="font-semibold text-slate-200 text-sm leading-snug mb-1 line-clamp-2 min-h-[2.5rem]">
            {product.nombre}
          </h3>
        </Link>

        {product.descripcion && (
          <p className="text-surface-500 text-xs leading-relaxed mb-4 line-clamp-2">
            {product.descripcion}
          </p>
        )}

        <div className="flex items-end justify-between mt-auto pt-4">
          <div>
            <span className="font-display font-bold text-lg text-white">
              S/ {Number(product.precio).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold transition-all cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)] active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
