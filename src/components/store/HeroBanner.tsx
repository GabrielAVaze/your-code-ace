import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&h=700&fit=crop",
    badge: "Nova Coleção",
    title: "Os melhores tênis do mundo",
    highlight: "até 30% OFF",
    subtitle: "Nike, Adidas, Vans e muito mais com entrega expressa para todo o Brasil.",
  },
  {
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1400&h=700&fit=crop",
    badge: "Mais Vendidos",
    title: "Frete grátis acima de",
    highlight: "R$299",
    subtitle: "Compre os tênis mais icônicos do mundo com entrega rápida e garantia de originalidade.",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground" style={{ height: "520px" }}>

      {/* Imagens com transição */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 transition-transform duration-[8000ms]"
            style={{
              backgroundImage: `url('${s.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.35,
              transform: i === current ? "scale(1.05)" : "scale(1)",
            }}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />

      {/* Círculos decorativos */}
      <div className="absolute -right-10 top-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-0 right-40 h-32 w-32 rounded-full bg-accent/15 blur-2xl" />

      {/* Conteúdo */}
      <div className="relative mx-auto max-w-7xl px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <div
            key={current + "-badge"}
            className="animate-fade-up mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1"
            style={{ animationFillMode: "forwards" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-accent">{slide.badge}</span>
          </div>

          <h1
            key={current + "-title"}
            className="animate-fade-up mb-2 text-4xl font-black leading-tight md:text-5xl lg:text-6xl"
            style={{ animationFillMode: "forwards", animationDelay: "100ms", opacity: 0 }}
          >
            {slide.title}{" "}
            <span className="relative inline-block bg-accent px-3 py-1 text-accent-foreground">
              {slide.highlight}
            </span>
          </h1>

          <p
            key={current + "-sub"}
            className="animate-fade-up mb-8 max-w-lg text-base text-primary-foreground/70 md:text-lg"
            style={{ animationFillMode: "forwards", animationDelay: "200ms", opacity: 0 }}
          >
            {slide.subtitle}
          </p>

          <div
            className="animate-fade-up"
            style={{ animationFillMode: "forwards", animationDelay: "300ms", opacity: 0 }}
          >
            <Link to="/#destaques">
              <Button size="lg" className="group bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 font-bold">
                Ver Destaques
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-500 rounded-full ${
              i === current ? "w-8 h-2 bg-accent" : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Badges inferiores */}
      <div className="absolute bottom-7 right-6 hidden md:flex gap-6">
        {[
          { icon: Shield, label: "Site Oficial" },
          { icon: Award, label: "100% Original" },
          { icon: Truck, label: "Envio Rápido" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs text-primary-foreground/70">
            <Icon className="h-4 w-4 text-accent" />
            <span className="font-semibold">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;