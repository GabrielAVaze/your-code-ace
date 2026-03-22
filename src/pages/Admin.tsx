import { useState, useEffect } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, ArrowLeft, Package, Upload, Link as LinkIcon, ShoppingBag, Truck, Store } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

const emptyForm = {
  name: "", brand: "", category: "Tênis", price: 0, originalPrice: 0,
  image: "", description: "", sizes: "", colors: "",
  inStock: true, featured: false, bestSeller: false,
};

const statusOptions = [
  { value: "pending", label: "Aguardando pagamento", color: "bg-yellow-100 text-yellow-800" },
  { value: "paid", label: "Pago", color: "bg-blue-100 text-blue-800" },
  { value: "shipped", label: "Enviado", color: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "Entregue", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelado", color: "bg-red-100 text-red-800" },
];

interface OrderItem {
  id: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
  products: { name: string; image: string };
}

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  delivery_method?: string;
  order_items: OrderItem[];
  addresses: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  } | null;
  profiles: { email: string; full_name: string } | null;
}

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

const fetchOrders = async () => {
    setLoadingOrders(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, products(name, image)), addresses(*)")
      .order("created_at", { ascending: false });
    console.log("ORDERS:", { data, error });
    if (data) setOrders(data as Order[]);
    setLoadingOrders(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (!error) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
      toast.success("Status atualizado!");
    }
  };

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageMode("url");
    setIsOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p.id);
    setForm({
      name: p.name, brand: p.brand, category: p.category,
      price: p.price, originalPrice: p.originalPrice || 0,
      image: p.image, description: p.description,
      sizes: p.sizes.join(", "), colors: p.colors.join(", "),
      inStock: p.inStock, featured: p.featured, bestSeller: p.bestSeller,
    });
    setImageMode("url");
    setIsOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("products").upload(fileName, file);
    if (error) { toast.error("Erro ao fazer upload da imagem."); setUploading(false); return; }
    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, image: data.publicUrl }));
    toast.success("Imagem enviada!");
    setUploading(false);
  };

  const handleSave = () => {
    if (!form.name) return toast.error("Nome é obrigatório.");
    if (!form.image) return toast.error("Adicione uma imagem.");
    const productData = {
      name: form.name, brand: form.brand, category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      image: form.image, description: form.description,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      inStock: form.inStock, featured: form.featured, bestSeller: form.bestSeller,
    };
    if (editing) { updateProduct(editing, productData); toast.success("Produto atualizado!"); }
    else { addProduct(productData); toast.success("Produto adicionado!"); }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success("Produto removido!");
  };

  const getStatusInfo = (status: string) => statusOptions.find((s) => s.value === status) || statusOptions[0];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <RouterLink to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </RouterLink>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <h1 className="text-lg font-bold">Painel Admin</h1>
            </div>
          </div>
          {activeTab === "products" && (
            <Button onClick={openNew} className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97]">
              <Plus className="mr-2 h-4 w-4" /> Novo Produto
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "products" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Package className="h-4 w-4" /> Produtos
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "orders" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <ShoppingBag className="h-4 w-4" /> Pedidos
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">

        {/* Produtos */}
        {activeTab === "products" && (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Foto</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-center">Estoque</TableHead>
                  <TableHead className="text-right w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell><img src={p.image} alt={p.name} className="h-10 w-10 rounded object-cover" /></TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.brand}</TableCell>
                    <TableCell className="text-right tabular-nums">R${p.price.toFixed(2).replace(".", ",")}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-block h-2 w-2 rounded-full ${p.inStock ? "bg-green-500" : "bg-red-500"}`} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)} className="active:scale-95">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive active:scale-95">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pedidos */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {loadingOrders ? (
              <p className="text-muted-foreground">Carregando pedidos...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Nenhum pedido ainda.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="rounded-lg border bg-card p-5 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        {order.addresses ? (
                          <><Truck className="h-3 w-3" /> Entrega: {order.addresses.street}, {order.addresses.number} — {order.addresses.city}/{order.addresses.state}</>
                        ) : (
                          <><Store className="h-3 w-3" /> Retirada na loja</>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${getStatusInfo(order.status).color}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img src={item.products.image} alt={item.products.name} className="h-12 w-12 rounded object-cover" />
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

                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-bold tabular-nums">R${order.total.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            <DialogDescription>Preencha os dados do produto abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Marca</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
            </div>
            <div>
              <Label>Imagem</Label>
              <div className="mt-1 flex gap-2">
                <Button type="button" size="sm" variant={imageMode === "url" ? "default" : "outline"} onClick={() => setImageMode("url")}>
                  <LinkIcon className="mr-1 h-3 w-3" /> URL
                </Button>
                <Button type="button" size="sm" variant={imageMode === "upload" ? "default" : "outline"} onClick={() => setImageMode("upload")}>
                  <Upload className="mr-1 h-3 w-3" /> Upload
                </Button>
              </div>
              {imageMode === "url" ? (
                <Input className="mt-2" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
              ) : (
                <div className="mt-2">
                  <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
                  {uploading && <p className="mt-1 text-sm text-muted-foreground">Enviando imagem...</p>}
                </div>
              )}
              {form.image && <img src={form.image} alt="Preview" className="mt-2 h-24 w-24 rounded object-cover border" />}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Preço (R$)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} /></div>
              <div><Label>Preço original (R$)</Label><Input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: parseFloat(e.target.value) || 0 })} /></div>
            </div>
            <div><Label>Descrição</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Tamanhos (separados por vírgula)</Label><Input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="38, 39, 40, 41" /></div>
              <div><Label>Cores (separadas por vírgula)</Label><Input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Preto, Branco" /></div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2"><Switch checked={form.inStock} onCheckedChange={(v) => setForm({ ...form, inStock: v })} /><Label>Em estoque</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} /><Label>Destaque</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.bestSeller} onCheckedChange={(v) => setForm({ ...form, bestSeller: v })} /><Label>Mais vendido</Label></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {editing ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;