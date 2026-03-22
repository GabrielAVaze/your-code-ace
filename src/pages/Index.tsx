import Header from "@/components/store/Header";
import CategoryNav from "@/components/store/CategoryNav";
import HeroBanner from "@/components/store/HeroBanner";
import ProductSection from "@/components/store/ProductSection";
import CartDrawer from "@/components/store/CartDrawer";
import Footer from "@/components/store/Footer";
import { useProducts } from "@/contexts/ProductContext";
import { useState, useMemo } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/store/ProductCard";
import { useSearchParams } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

const Index = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [category, setCategory] = useState("Início");
  const effectiveCategory = searchQuery ? "Todos os Produtos" : category;

  const [showFilters, setShowFilters] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);
  const [openSections, setOpenSections] = useState({ brands: true, sizes: true, colors: true, price: true });

  const toggleSection = (s: keyof typeof openSections) =>
    setOpenSections((prev) => ({ ...prev, [s]: !prev[s] }));

  const allSizes = useMemo(() => [...new Set(products.flatMap((p) => p.sizes))].sort(), [products]);
  const allColors = useMemo(() => [...new Set(products.flatMap((p) => p.colors))].sort(), [products]);
  const allBrands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products]);
  const maxPrice = useMemo(() => Math.max(...products.map((p) => p.price), 0), [products]);

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) =>
    list.includes(item) ? setList(list.filter((i) => i !== item)) : setList([...list, item]);

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setSortBy("default");
    setPage(1);
  };

  const hasFilters = selectedSizes.length > 0 || selectedColors.length > 0 || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < maxPrice;

  const featured = products.filter((p) => p.featured);
  const bestSellers = products.filter((p) => p.bestSeller);

  const filteredByBrand =
    effectiveCategory === "Início" || effectiveCategory === "Todos os Produtos"
      ? null
      : products.filter((p) => p.brand.toLowerCase() === effectiveCategory.toLowerCase());

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) result = result.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedBrands.length > 0) result = result.filter((p) => selectedBrands.includes(p.brand));
    if (selectedSizes.length > 0) result = result.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    if (selectedColors.length > 0) result = result.filter((p) => p.colors.some((c) => selectedColors.includes(c)));
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, searchQuery, selectedBrands, selectedSizes, selectedColors, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const showProductsPanel = effectiveCategory === "Todos os Produtos" || !!searchQuery;

  const FilterPanel = () => (
    <div className="space-y-4 text-sm">
      {hasFilters && (
        <button onClick={clearFilters} className="text-xs text-accent underline flex items-center gap-1">
          <X className="h-3 w-3" /> Limpar filtros
        </button>
      )}
      <div className="border-b pb-4">
        <button onClick={() => toggleSection("brands")} className="flex w-full items-center justify-between font-semibold mb-2">
          Marca {openSections.brands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {openSections.brands && (
          <div className="space-y-1">
            {allBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer hover:text-accent">
                <input type="checkbox" checked={selectedBrands.includes(brand)}
                  onChange={() => { toggleItem(selectedBrands, setSelectedBrands, brand); setPage(1); }}
                  className="h-3 w-3 accent-yellow-400" />
                {brand}
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="border-b pb-4">
        <button onClick={() => toggleSection("sizes")} className="flex w-full items-center justify-between font-semibold mb-2">
          Tamanho {openSections.sizes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {openSections.sizes && (
          <div className="flex flex-wrap gap-2">
            {allSizes.map((size) => (
              <button key={size} onClick={() => { toggleItem(selectedSizes, setSelectedSizes, size); setPage(1); }}
                className={`px-2 py-1 rounded border text-xs transition-all ${selectedSizes.includes(size) ? "bg-accent text-accent-foreground border-accent" : "border-border hover:border-accent"}`}>
                {size}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="border-b pb-4">
        <button onClick={() => toggleSection("colors")} className="flex w-full items-center justify-between font-semibold mb-2">
          Cor {openSections.colors ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {openSections.colors && (
          <div className="space-y-1">
            {allColors.map((color) => (
              <label key={color} className="flex items-center gap-2 cursor-pointer hover:text-accent">
                <input type="checkbox" checked={selectedColors.includes(color)}
                  onChange={() => { toggleItem(selectedColors, setSelectedColors, color); setPage(1); }}
                  className="h-3 w-3 accent-yellow-400" />
                {color}
              </label>
            ))}
          </div>
        )}
      </div>
      <div>
        <button onClick={() => toggleSection("price")} className="flex w-full items-center justify-between font-semibold mb-2">
          Preço {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {openSections.price && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>R${priceRange[0]}</span>
              <span>R${priceRange[1]}</span>
            </div>
            <input type="range" min={0} max={maxPrice} value={priceRange[1]}
              onChange={(e) => { setPriceRange([priceRange[0], Number(e.target.value)]); setPage(1); }}
              className="w-full accent-yellow-400" />
            <input type="range" min={0} max={maxPrice} value={priceRange[0]}
              onChange={(e) => { setPriceRange([Number(e.target.value), priceRange[1]]); setPage(1); }}
              className="w-full accent-yellow-400" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <CategoryNav onCategoryChange={(c) => { setCategory(c); setPage(1); clearFilters(); setSearchParams({}); }} />
      {effectiveCategory === "Início" && !searchQuery && <HeroBanner />}

      <main className="flex-1">
        {filteredByBrand && !searchQuery ? (
          <ProductSection title={effectiveCategory} products={filteredByBrand} />
        ) : !showProductsPanel ? (
          <>
            <div id="destaques">
              <ProductSection title="Destaques" products={featured} />
            </div>
            <ProductSection title="Os mais vendidos" products={bestSellers} />
          </>
        ) : null}

        {showProductsPanel && (
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="text-2xl font-bold">
                {searchQuery ? `Resultados para "${searchQuery}"` : "Todos os Produtos"}
              </h2>
              <div className="flex items-center gap-3">
                <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="text-sm border rounded-lg px-3 py-2 bg-background">
                  <option value="default">Ordenar por</option>
                  <option value="price_asc">Menor preço</option>
                  <option value="price_desc">Maior preço</option>
                  <option value="name">Nome A-Z</option>
                </select>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 ${hasFilters ? "border-accent text-accent" : ""}`}>
                  <Filter className="h-4 w-4" />
                  Filtros
                  {hasFilters && <span className="bg-accent text-accent-foreground rounded-full text-xs px-1.5">{selectedSizes.length + selectedColors.length + selectedBrands.length}</span>}
                </Button>
              </div>
            </div>

            <div className="flex gap-6">
              {showFilters && (
                <div className="hidden md:block w-52 shrink-0">
                  <FilterPanel />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
                </p>
                {paginatedProducts.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <p>Nenhum produto encontrado.</p>
                    <button onClick={clearFilters} className="mt-2 text-accent underline text-sm">Limpar filtros</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                      Anterior
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button key={p} size="sm"
                        variant={page === p ? "default" : "outline"}
                        onClick={() => setPage(p)}
                        className={page === p ? "bg-accent text-accent-foreground" : ""}>
                        {p}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                      Próxima
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Index;