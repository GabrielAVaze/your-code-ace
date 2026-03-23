import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PromoBanner = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Banner Masculino */}
        <Link to="/?search=masculino" className="group relative overflow-hidden rounded-2xl h-64 block">
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=500&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Coleção</p>
            <h3 className="text-3xl font-black text-white mb-3">Masculino</h3>
            <span className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
              Ver coleção <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

        {/* Banner Feminino */}
        <Link to="/?search=feminino" className="group relative overflow-hidden rounded-2xl h-64 block">
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=500&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Coleção</p>
            <h3 className="text-3xl font-black text-white mb-3">Feminino</h3>
            <span className="inline-flex items-center gap-2 bg-white text-black text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
              Ver coleção <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>

      </div>
    </section>
  );
};

export default PromoBanner;