import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/lib/supabase";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import CartDrawer from "@/components/store/CartDrawer";
import { Link } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  products: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

const statusLabel: Record<string, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*, products(name, image))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setOrders(data as Order[]);
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Faça login para ver seus pedidos</p>
          <Link to="/login"><Button>Entrar</Button></Link>
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
        <div className="mx-auto max-w-3xl px-4 py-8">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>

          <h1 className="mb-6 text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" /> Meus Pedidos
          </h1>

          {loading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>
              <Link to="/"><Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">Comprar agora</Button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-lg border bg-card p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[order.status] || "bg-gray-100 text-gray-800"}`}>
                      {statusLabel[order.status] || order.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img src={item.products.image} alt={item.products.name} className="h-14 w-14 rounded object-cover" />
                        <div className="flex-1 text-sm">
                          <p className="font-medium">{item.products.name}</p>
                          <p className="text-xs text-muted-foreground">Tam: {item.size} · Cor: {item.color} · Qtd: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold tabular-nums">
                          R${(item.price * item.quantity).toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-bold tabular-nums">R${order.total.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Orders;