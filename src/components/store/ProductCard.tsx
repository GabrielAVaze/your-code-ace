import { Product } from "@/types/product";
import { Link } from "react-router-dom";

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
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg active:scale-[0.98]"
    >
      {discount > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
          {discount}% OFF
        </span>
      )}

      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </p>
        <h3 className="mt-1 text-sm font-medium leading-snug line-clamp-2" style={{ overflowWrap: "break-word" }}>
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              R${product.originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
          <span className="text-lg font-bold tabular-nums">
            R${product.price.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
