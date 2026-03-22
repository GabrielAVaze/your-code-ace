import { useState } from "react";
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
import { Plus, Pencil, Trash2, ArrowLeft, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const emptyForm = {
  name: "", brand: "", category: "Tênis", price: 0, originalPrice: 0,
  image: "", description: "", sizes: "", colors: "",
  inStock: true, featured: false, bestSeller: false,
};

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
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
    setIsOpen(true);
  };

  const handleSave = () => {
    const productData = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      image: form.image,
      description: form.description,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      inStock: form.inStock,
      featured: form.featured,
      bestSeller: form.bestSeller,
    };

    if (editing) {
      updateProduct(editing, productData);
      toast.success("Produto atualizado!");
    } else {
      addProduct(productData);
      toast.success("Produto adicionado!");
    }
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success("Produto removido!");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <h1 className="text-lg font-bold">Painel Admin</h1>
            </div>
          </div>
          <Button onClick={openNew} className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97]">
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
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
                  <TableCell>
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.brand}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    R${p.price.toFixed(2).replace(".", ",")}
                  </TableCell>
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
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            <DialogDescription>Preencha os dados do produto abaixo.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Nome</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Marca</Label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>URL da Imagem</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Preço (R$)</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <Label>Preço original (R$)</Label>
                <Input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: parseFloat(e.target.value) || 0 })} />
              </div>
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Tamanhos (separados por vírgula)</Label>
                <Input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="38, 39, 40, 41" />
              </div>
              <div>
                <Label>Cores (separadas por vírgula)</Label>
                <Input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Preto, Branco" />
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.inStock} onCheckedChange={(v) => setForm({ ...form, inStock: v })} />
                <Label>Em estoque</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                <Label>Destaque</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.bestSeller} onCheckedChange={(v) => setForm({ ...form, bestSeller: v })} />
                <Label>Mais vendido</Label>
              </div>
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
