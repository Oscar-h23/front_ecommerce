import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, ArrowRight, Zap, ShieldCheck, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    id: 1,
    title: "Eleva tu nivel al maximo",
    subtitle: "Desata el poder de la Serie RTX 40",
    description: "Descubre la nueva generacion de portatiles disenadas para gaming extremo y renderizado profesional. Sin limites, sin caidas de frames.",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=2068",
    color: "from-brand-600/80 to-purple-900/80"
  },
  {
    id: 2,
    title: "El Setup de tus suenos",
    subtitle: "Construye tu estacion perfecta",
    description: "Encuentra los componentes, monitores y perifericos mas exclusivos del mercado. Todo lo que necesitas para armar una PC master race inigualable.",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=2042",
    color: "from-blue-600/80 to-slate-900/80"
  },
  {
    id: 3,
    title: "Potencia sin fronteras",
    subtitle: "Workstations Profesionales",
    description: "Domina tus proyectos de arquitectura, IA y edicion de video con procesadores de ultima generacion y memorias DDR5 ultra rapidas.",
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=2070",
    color: "from-emerald-600/80 to-slate-900/80"
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prev = () => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-surface-900">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover scale-105 transform group-hover:scale-100 transition-transform duration-[10000ms] ease-out"
            />
            {/* Ambient Glow */}
            <div className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr ${slide.color} rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse`} />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-multiply opacity-80`} />
            <div className="absolute inset-0 bg-slate-950/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container-custom relative z-20 w-full">
              <div className="max-w-3xl space-y-6 transition-all duration-1000 transform translate-y-0 opacity-100">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 backdrop-blur-md mb-2">
                  <Zap className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-bold text-brand-300 tracking-wider uppercase">{slide.subtitle}</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white leading-[1.1] tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
                  {slide.description}
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Link to="#catalogo" className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-full font-semibold transition-all hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25">
                    Explorar equipos <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls - Side by Side outside the loop */}
      <button 
        onClick={prev} 
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-surface-900/40 hover:bg-surface-900/70 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={next} 
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-surface-900/40 hover:bg-surface-900/70 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full ${
              index === current ? "w-8 h-2 bg-brand-500 shadow-lg shadow-brand-500/50" : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
