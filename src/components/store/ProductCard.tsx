import { Product } from "@/types/product";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      to={`/produto/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground shadow-md">
            -{discount}% OFF
          </span>
        )}
        {product.bestSeller && (
          <span className="flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-xs font-bold shadow-md">
            <Star className="h-3 w-3 fill-accent text-accent" /> Top
          </span>
        )}
      </div>

      {/* Imagem grande */}
      <div className="relative w-full overflow-hidden bg-muted" style={{ aspectRatio: "1/1" }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay ao hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-4">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <span className="flex items-center gap-2 bg-accent text-accent-foreground text-xs font-bold px-4 py-2 rounded-full shadow-lg">
              <ShoppingCart className="h-3.5 w-3.5" /> Ver produto
            </span>
          </div>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full">Esgotado</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col p-4 gap-1">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          {product.brand}
        </p>
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground">
          {product.name}
        </h3>
        <div className="mt-2 flex flex-col">
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through tabular-nums">
              R${product.originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
          <span className="text-xl font-black tabular-nums text-foreground">
            R${product.price.toFixed(2).replace(".", ",")}
          </span>
          <p className="text-xs text-muted-foreground">
            12x de R${(product.price / 12).toFixed(2).replace(".", ",")}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;