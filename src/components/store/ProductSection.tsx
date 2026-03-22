import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface Props {
  title: string;
  products: Product[];
}

const ProductSection = ({ title, products }: Props) => {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl animate-fade-up">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 80}ms`, opacity: 0, animationFillMode: "forwards" }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;