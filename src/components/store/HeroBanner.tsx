import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Award } from "lucide-react";
import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1400&h=600&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
          Sneaker Store
        </p>
        <h1 className="mb-4 text-4xl font-black leading-[1.05] md:text-6xl lg:text-7xl" style={{ textWrap: "balance" }}>
          Envio rápido para{" "}
          <span className="inline-block bg-accent px-3 py-1 text-accent-foreground">
            todo o Brasil
          </span>
        </h1>
        <p className="mb-8 max-w-lg text-base text-primary-foreground/70 md:text-lg" style={{ textWrap: "pretty" }}>
          Os melhores tênis das maiores marcas do mundo com entrega expressa e garantia de originalidade.
        </p>
        <Link to="/#destaques">
          <Button size="lg" className="group bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all">
            Ver Destaques
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>

        <div className="mt-12 flex flex-wrap gap-8">
          {[
            { icon: Shield, label: "Site Oficial" },
            { icon: Award, label: "100% Original" },
            { icon: Truck, label: "Envio Rápido" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-primary-foreground/80">
              <Icon className="h-5 w-5 text-accent" />
              <span className="font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
