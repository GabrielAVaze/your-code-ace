import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CartItem, Product } from "@/types/product";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const fetchCart = async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*, products(*)")
        .eq("user_id", user.id);

      console.log("FETCH CART:", { data, error });
      if (error || !data) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped: CartItem[] = (data as any[]).map((item) => ({
        product: {
          id: item.products.id,
          name: item.products.name,
          brand: item.products.brand,
          category: item.products.category,
          price: item.products.price,
          originalPrice: item.products.original_price,
          image: item.products.image,
          description: item.products.description,
          sizes: item.products.sizes,
          colors: item.products.colors,
          inStock: item.products.in_stock,
          featured: item.products.featured,
          bestSeller: item.products.best_seller,
        },
        quantity: item.quantity,
        selectedSize: item.size,
        selectedColor: item.color,
      }));

      setItems(mapped);
    };

    fetchCart();
  }, [user]);

  const addItem = useCallback(async (product: Product, selectedSize: string, selectedColor: string) => {
    const existing = items.find(
      (i) => i.product.id === product.id && i.selectedSize === selectedSize && i.selectedColor === selectedColor
    );

    if (existing) {
      updateQuantity(product.id, selectedSize, selectedColor, existing.quantity + 1);
      return;
    }

    setItems((prev) => [...prev, { product, quantity: 1, selectedSize, selectedColor }]);

    if (user) {
      const { error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      });
      console.log("CART INSERT:", { error });
    }

    toast.success(`${product.name} adicionado ao carrinho!`);
    setIsOpen(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, user]);

  const removeItem = useCallback(async (productId: string, size: string, color: string) => {
    setItems((prev) => prev.filter(
      (i) => !(i.product.id === productId && i.selectedSize === size && i.selectedColor === color)
    ));

    if (user) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .eq("size", size)
        .eq("color", color);
    }
  }, [user]);

  const updateQuantity = useCallback(async (productId: string, size: string, color: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId, size, color);
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.selectedSize === size && i.selectedColor === color
          ? { ...i, quantity: qty }
          : i
      )
    );

    if (user) {
      await supabase
        .from("cart_items")
        .update({ quantity: qty })
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .eq("size", size)
        .eq("color", color);
    }
  }, [user, removeItem]);

  const clearCart = useCallback(async () => {
    setItems([]);
    if (user) {
      await supabase.from("cart_items").delete().eq("user_id", user.id);
    }
  }, [user]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isOpen, setIsOpen, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};