import { useParams, Link } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/store/Header";
import CartDrawer from "@/components/store/CartDrawer";
import Footer from "@/components/store/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Shield, Truck, RotateCcw, Star } from "lucide-react";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { addItem } = useCart();
  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);

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
    if (!selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Voltar
          </Link>

          <div className="grid gap-12 md:grid-cols-2">

            {/* Imagem */}
            <div
              className={`relative aspect-square overflow-hidden rounded-2xl bg-muted cursor-zoom-in transition-all duration-500 ${imageZoom ? "scale-105" : "scale-100"}`}
              onClick={() => setImageZoom(!imageZoom)}
            >
              {discount > 0 && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground shadow-lg animate-bounce">
                  -{discount}% OFF
                </span>
              )}
              {product.bestSeller && (
                <span className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-bold shadow-lg">
                  <Star className="h-3 w-3 fill-accent text-accent" /> Mais Vendido
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className={`h-full w-full object-cover transition-transform duration-700 ${imageZoom ? "scale-110" : "scale-100"}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-accent border border-accent rounded-full px-3 py-1">
                  {product.brand}
                </span>
                {product.inStock ? (
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse inline-block" /> Em estoque
                  </span>
                ) : (
                  <span className="text-xs text-red-500 font-medium">Esgotado</span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-black md:text-4xl leading-tight">{product.name}</h1>

              <div className="mt-5 flex items-end gap-3">
                <span className="text-4xl font-black tabular-nums text-foreground">
                  R${product.price.toFixed(2).replace(".", ",")}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through tabular-nums mb-1">
                    R${product.originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                ou <span className="font-semibold text-foreground">12x de R${(product.price / 12).toFixed(2).replace(".", ",")}</span> sem juros
              </p>

              <div className="mt-4 h-px bg-border" />

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

              {/* Tamanhos */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold">Tamanho</p>
                  {!selectedSize && <p className="text-xs text-muted-foreground">Selecione um tamanho</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-11 w-13 min-w-[44px] items-center justify-center rounded-xl border-2 text-sm font-bold transition-all duration-200 active:scale-95 ${
                        selectedSize === size
                          ? "border-accent bg-accent text-accent-foreground scale-110 shadow-md"
                          : "border-border hover:border-accent hover:scale-105"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cores */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold">Cor</p>
                  {selectedColor && <p className="text-xs font-medium text-accent">{selectedColor}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 ${
                        selectedColor === color
                          ? "border-accent bg-accent text-accent-foreground scale-105 shadow-md"
                          : "border-border hover:border-accent hover:scale-105"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão */}
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor || !product.inStock}
                size="lg"
                className={`mt-8 text-base font-bold transition-all duration-300 active:scale-[0.97] ${
                  addedToCart
                    ? "bg-green-500 hover:bg-green-500 text-white scale-105"
                    : "bg-accent text-accent-foreground hover:bg-accent/90"
                }`}
              >
                <ShoppingCart className={`mr-2 h-5 w-5 transition-transform duration-300 ${addedToCart ? "scale-125" : ""}`} />
                {addedToCart ? "✓ Adicionado ao carrinho!" : "Adicionar ao Carrinho"}
              </Button>

              {(!selectedSize || !selectedColor) && (
                <p className="mt-2 text-xs text-center text-muted-foreground">
                  {!selectedSize && !selectedColor ? "Selecione tamanho e cor" : !selectedSize ? "Selecione um tamanho" : "Selecione uma cor"}
                </p>
              )}

              {/* Garantias */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3 text-center">
                  <Truck className="h-5 w-5 text-accent" />
                  <p className="text-xs font-medium">Frete grátis</p>
                  <p className="text-xs text-muted-foreground">acima de R$299</p>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3 text-center">
                  <Shield className="h-5 w-5 text-accent" />
                  <p className="text-xs font-medium">100% Original</p>
                  <p className="text-xs text-muted-foreground">garantia total</p>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 p-3 text-center">
                  <RotateCcw className="h-5 w-5 text-accent" />
                  <p className="text-xs font-medium">Troca fácil</p>
                  <p className="text-xs text-muted-foreground">até 30 dias</p>
                </div>
              </div>
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