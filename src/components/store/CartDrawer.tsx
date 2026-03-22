import { useCart } from "@/contexts/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrinho ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag className="h-16 w-16 opacity-30" />
            <p className="text-sm">Seu carrinho está vazio</p>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-3 rounded-lg border p-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-medium leading-snug">{item.product.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Tam: {item.selectedSize} · {item.selectedColor}
                    </p>
                    <p className="mt-1 text-sm font-bold tabular-nums">
                      R${item.product.price.toFixed(2).replace(".", ",")}
                    </p>
                    <div className="mt-auto flex items-center gap-2 pt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded border hover:bg-muted active:scale-95 transition-all"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded border hover:bg-muted active:scale-95 transition-all"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                        className="ml-auto text-muted-foreground hover:text-destructive transition-colors active:scale-95"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="tabular-nums">R${totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <Link to="/checkout" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all" size="lg">
                  Finalizar Compra
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
