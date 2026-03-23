import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  products: Product[];
  subtitle?: string;
}

const ProductSection = ({ title, products, subtitle }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (products.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  return (
    <section className="py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">

        {/* Header da seção */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">
              ✦ Coleção
            </p>
            <h2 className="text-2xl font-black md:text-3xl animate-fade-up">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>

          {/* Botões de navegação */}
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                canScrollLeft
                  ? "border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  : "border-border text-muted-foreground opacity-40 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                canScrollRight
                  ? "border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  : "border-border text-muted-foreground opacity-40 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carrossel */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up shrink-0 w-[280px] sm:w-[320px] snap-start"
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Gradiente nas bordas */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;