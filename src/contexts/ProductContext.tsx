import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types/product";
import { products as initialProducts } from "@/data/products";
import supabase from "@/lib/supabase";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Busca produtos do Supabase ao carregar
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("FETCH PRODUCTS:", { data, error });
if (error || !data || data.length === 0) {
  setProducts([]);
    } else {
        type SupabaseProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  original_price: number;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  featured: boolean;
  best_seller: boolean;
};

const mapped: Product[] = (data as SupabaseProduct[]).map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          price: p.price,
          originalPrice: p.original_price,
          image: p.image,
          description: p.description,
          sizes: p.sizes,
          colors: p.colors,
          inStock: p.in_stock,
          featured: p.featured,
          bestSeller: p.best_seller,
        }));
        setProducts(mapped);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, "id">) => {
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        original_price: product.originalPrice,
        image: product.image,
        description: product.description,
        sizes: product.sizes,
        colors: product.colors,
        in_stock: product.inStock,
        featured: product.featured,
        best_seller: product.bestSeller,
      })
      .select()
      .single();

    console.log("SUPABASE INSERT:", { data, error });

    if (!error && data) {
      const newProduct: Product = {
        id: data.id,
        name: data.name,
        brand: data.brand,
        category: data.category,
        price: data.price,
        originalPrice: data.original_price,
        image: data.image,
        description: data.description,
        sizes: data.sizes,
        colors: data.colors,
        inStock: data.in_stock,
        featured: data.featured,
        bestSeller: data.best_seller,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { error } = await supabase
      .from("products")
      .update({
        name: updates.name,
        brand: updates.brand,
        category: updates.category,
        price: updates.price,
        original_price: updates.originalPrice,
        image: updates.image,
        description: updates.description,
        sizes: updates.sizes,
        colors: updates.colors,
        in_stock: updates.inStock,
        featured: updates.featured,
        best_seller: updates.bestSeller,
      })
      .eq("id", id);

    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    }
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};