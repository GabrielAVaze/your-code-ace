import Header from "@/components/store/Header";
import CategoryNav from "@/components/store/CategoryNav";
import HeroBanner from "@/components/store/HeroBanner";
import ProductSection from "@/components/store/ProductSection";
import CartDrawer from "@/components/store/CartDrawer";
import Footer from "@/components/store/Footer";
import { useProducts } from "@/contexts/ProductContext";
import { useState } from "react";

const Index = () => {
  const { products } = useProducts();
  const [category, setCategory] = useState("Início");

  const featured = products.filter((p) => p.featured);
  const bestSellers = products.filter((p) => p.bestSeller);

  const filteredByBrand =
    category === "Início" || category === "Todos os Produtos"
      ? null
      : products.filter((p) => p.brand.toLowerCase() === category.toLowerCase());

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CategoryNav onCategoryChange={setCategory} />
      {category === "Início" && <HeroBanner />}

      <main className="flex-1">
        {filteredByBrand ? (
          <ProductSection title={category} products={filteredByBrand} />
        ) : (
          <>
            <div id="destaques">
              <ProductSection title="Destaques" products={featured} />
            </div>
            <ProductSection title="Os mais vendidos" products={bestSellers} />
          </>
        )}

        {category === "Todos os Produtos" && (
          <ProductSection title="Todos os Produtos" products={products} />
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Index;
