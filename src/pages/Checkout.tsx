import Header from "@/components/store/Header";
import CartDrawer from "@/components/store/CartDrawer";
import Footer from "@/components/store/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Store, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";

interface Address {
  id?: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_default?: boolean;
}

const emptyAddress: Address = {
  street: "", number: "", complement: "",
  neighborhood: "", city: "", state: "", zip_code: "",
};

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [saveAddress, setSaveAddress] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setName(user.user_metadata?.full_name || "");

      const fetchAddresses = async () => {
        const { data } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false });

        if (data && data.length > 0) {
          setSavedAddresses(data);
          const def = data.find((a: Address) => a.is_default) || data[0];
          setAddress(def);
        }
      };

      fetchAddresses();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let addressId: string | null = null;

    if (user && deliveryMethod === "delivery") {
      if (saveAddress || !address.id) {
        const { data: newAddress } = await supabase
          .from("addresses")
          .insert({
            user_id: user.id,
            street: address.street,
            number: address.number,
            complement: address.complement,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            zip_code: address.zip_code,
            is_default: savedAddresses.length === 0,
          })
          .select()
          .single();
        addressId = newAddress?.id || null;
      } else {
        addressId = address.id || null;
      }
    }

    if (user) {
      const { data: order } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total: totalPrice,
          status: "pending",
          address_id: addressId,
        })
        .select()
        .single();

      if (order) {
        await supabase.from("order_items").insert(
          items.map((item) => ({
            order_id: order.id,
            product_id: item.product.id,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
            price: item.product.price,
          }))
        );
      }
    }

    toast.success("Pedido realizado com sucesso! Obrigado pela compra.");
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Seu carrinho está vazio</p>
          <Link to="/"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar às compras</Button></Link>
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

              {/* Método de entrega */}
              <div className="rounded-lg border p-5 space-y-4">
                <h2 className="font-semibold">Método de entrega</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => setDeliveryMethod("delivery")}
                    className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all active:scale-[0.97] ${deliveryMethod === "delivery" ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground/30"}`}>
                    <Truck className={`h-5 w-5 shrink-0 ${deliveryMethod === "delivery" ? "text-accent" : "text-muted-foreground"}`} />
                    <div><p className="text-sm font-medium">Entrega</p><p className="text-xs text-muted-foreground">Receba no seu endereço</p></div>
                  </button>
                  <button type="button" onClick={() => setDeliveryMethod("pickup")}
                    className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all active:scale-[0.97] ${deliveryMethod === "pickup" ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground/30"}`}>
                    <Store className={`h-5 w-5 shrink-0 ${deliveryMethod === "pickup" ? "text-accent" : "text-muted-foreground"}`} />
                    <div><p className="text-sm font-medium">Retirar na loja</p><p className="text-xs text-muted-foreground">Retire sem custo de frete</p></div>
                  </button>
                </div>
                {deliveryMethod === "pickup" && (
                  <div className="rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Endereço para retirada:</p>
                    <p>Rua Exemplo, 123 — Centro, São Paulo - SP</p>
                    <p>Horário: Seg a Sáb, 9h às 18h</p>
                  </div>
                )}
              </div>

              {/* Dados pessoais */}
              <div className="rounded-lg border p-5 space-y-4">
                <h2 className="font-semibold">Dados pessoais</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Nome completo</Label>
                    <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
                  </div>
                  <div><Label>CPF</Label><Input required placeholder="000.000.000-00" /></div>
                  <div><Label>Telefone</Label><Input required placeholder="(00) 00000-0000" /></div>
                </div>
              </div>

              {/* Endereço */}
              {deliveryMethod === "delivery" && (
                <div className="rounded-lg border p-5 space-y-4">
                  <h2 className="font-semibold">Endereço de entrega</h2>

                  {savedAddresses.length > 0 && (
                    <div className="space-y-2">
                      <Label>Endereços salvos</Label>
                      {savedAddresses.map((a) => (
                        <button key={a.id} type="button"
                          onClick={() => setAddress(a)}
                          className={`w-full text-left rounded-lg border-2 p-3 text-sm transition-all ${JSON.stringify(address) === JSON.stringify(a) ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground/30"}`}>
                          <p className="font-medium">{a.street}, {a.number} {a.complement && `- ${a.complement}`}</p>
                          <p className="text-muted-foreground text-xs">{a.neighborhood} · {a.city} - {a.state} · CEP {a.zip_code}</p>
                          {a.is_default && <span className="text-xs text-accent font-medium">Principal</span>}
                        </button>
                      ))}
                      <button type="button" onClick={() => setAddress(emptyAddress)}
                        className="text-sm text-accent underline">
                        + Usar novo endereço
                      </button>
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label>CEP</Label>
                      <Input required value={address.zip_code} onChange={(e) => setAddress({ ...address, zip_code: e.target.value })} placeholder="00000-000" />
                    </div>
                    <div>
                      <Label>Rua</Label>
                      <Input required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="Nome da rua" />
                    </div>
                    <div>
                      <Label>Número</Label>
                      <Input required value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} placeholder="123" />
                    </div>
                    <div>
                      <Label>Complemento</Label>
                      <Input value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} placeholder="Apto, bloco..." />
                    </div>
                    <div>
                      <Label>Bairro</Label>
                      <Input required value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} placeholder="Bairro" />
                    </div>
                    <div>
                      <Label>Cidade</Label>
                      <Input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Cidade" />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Input required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="UF" />
                    </div>
                  </div>

                  {user && (
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="save" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="h-4 w-4" />
                      <Label htmlFor="save" className="cursor-pointer">Salvar este endereço para próximas compras</Label>
                    </div>
                  )}
                </div>
              )}

              {/* Pagamento */}
              <div className="rounded-lg border p-5 space-y-4">
                <h2 className="flex items-center gap-2 font-semibold">
                  <CreditCard className="h-4 w-4" /> Pagamento
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2"><Label>Número do cartão</Label><Input required placeholder="0000 0000 0000 0000" /></div>
                  <div><Label>Validade</Label><Input required placeholder="MM/AA" /></div>
                  <div><Label>CVV</Label><Input required placeholder="000" /></div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all">
                Confirmar Pedido — R${totalPrice.toFixed(2).replace(".", ",")}
              </Button>
            </form>

            {/* Resumo */}
            <div className="md:col-span-2">
              <div className="sticky top-24 rounded-lg border p-5">
                <h2 className="mb-4 font-semibold">Resumo do pedido</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
                      <img src={item.product.image} alt={item.product.name} className="h-14 w-14 rounded object-cover" />
                      <div className="flex-1 text-sm">
                        <p className="font-medium leading-snug">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Tam: {item.selectedSize} · Qtd: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold tabular-nums">R${(item.product.price * item.quantity).toFixed(2).replace(".", ",")}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t pt-4 space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Frete</span>
                    <span>{deliveryMethod === "pickup" ? "Grátis (retirada)" : "A calcular"}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="tabular-nums">R${totalPrice.toFixed(2).replace(".", ",")}</span>
                  </div>
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