import Header from "@/components/store/Header";
import CartDrawer from "@/components/store/CartDrawer";
import Footer from "@/components/store/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pedido realizado com sucesso! Obrigado pela compra.");
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Seu carrinho está vazio</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar às compras
            </Button>
          </Link>
        </div>
        <Footer />
        <CartDrawer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Continuar comprando
          </Link>

          <h1 className="mb-8 text-2xl font-bold">Finalizar Compra</h1>

          <div className="grid gap-8 md:grid-cols-5">
            <form onSubmit={handleSubmit} className="space-y-5 md:col-span-3">
              <div className="rounded-lg border p-5 space-y-4">
                <h2 className="font-semibold">Dados pessoais</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" required placeholder="Seu nome" />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" required placeholder="seu@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" required placeholder="000.000.000-00" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" required placeholder="(00) 00000-0000" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-5 space-y-4">
                <h2 className="font-semibold">Endereço de entrega</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input id="cep" required placeholder="00000-000" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" required placeholder="Rua, número, complemento" />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" required placeholder="Cidade" />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" required placeholder="UF" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-5 space-y-4">
                <h2 className="flex items-center gap-2 font-semibold">
                  <CreditCard className="h-4 w-4" /> Pagamento
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="card">Número do cartão</Label>
                    <Input id="card" required placeholder="0000 0000 0000 0000" />
                  </div>
                  <div>
                    <Label htmlFor="expiry">Validade</Label>
                    <Input id="expiry" required placeholder="MM/AA" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" required placeholder="000" />
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all">
                Confirmar Pedido — R${totalPrice.toFixed(2).replace(".", ",")}
              </Button>
            </form>

            <div className="md:col-span-2">
              <div className="sticky top-24 rounded-lg border p-5">
                <h2 className="mb-4 font-semibold">Resumo do pedido</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                      <img src={item.product.image} alt={item.product.name} className="h-14 w-14 rounded object-cover" />
                      <div className="flex-1 text-sm">
                        <p className="font-medium leading-snug">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Tam: {item.selectedSize} · Qtd: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold tabular-nums">
                        R${(item.product.price * item.quantity).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="tabular-nums">R${totalPrice.toFixed(2).replace(".", ",")}</span>
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

export default Checkout;
