import { useParams, Link } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/store/Header";
import CartDrawer from "@/components/store/CartDrawer";
import Footer from "@/components/store/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { addItem } = useCart();
  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Produto não encontrado</p>
            <Link to="/" className="mt-4 inline-flex items-center gap-2 text-sm text-accent hover:underline">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      return;
    }
    addItem(product, selectedSize, selectedColor);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              {discount > 0 && (
                <span className="absolute left-4 top-4 z-10 rounded bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">
                  {discount}% OFF
                </span>
              )}
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>

            <div className="flex flex-col">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{product.brand}</p>
              <h1 className="mt-1 text-2xl font-bold md:text-3xl" style={{ lineHeight: "1.1" }}>{product.name}</h1>

              <div className="mt-4 flex items-baseline gap-3">
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through tabular-nums">
                    R${product.originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                )}
                <span className="text-3xl font-black tabular-nums">
                  R${product.price.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                ou 12x de R${(product.price / 12).toFixed(2).replace(".", ",")} sem juros
              </p>

              <p className="mt-6 text-sm leading-relaxed text-muted-foreground" style={{ textWrap: "pretty" }}>
                {product.description}
              </p>

              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold">Tamanho</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-10 w-12 items-center justify-center rounded border text-sm font-medium transition-all active:scale-95 ${
                        selectedSize === size
                          ? "border-accent bg-accent text-accent-foreground"
                          : "hover:border-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold">Cor</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-full border px-4 py-2 text-sm transition-all active:scale-95 ${
                        selectedColor === color
                          ? "border-accent bg-accent text-accent-foreground"
                          : "hover:border-foreground"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                size="lg"
                className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all disabled:opacity-40"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
              {(!selectedSize || !selectedColor) && (
                <p className="mt-2 text-xs text-muted-foreground">Selecione tamanho e cor para continuar</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default ProductDetail;
