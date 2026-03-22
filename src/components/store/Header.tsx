import { Search, Phone, User, ShoppingCart, LogOut, LogIn, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { totalItems, setIsOpen } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSignOut = async () => {
    await signOut();
    toast.success("Você saiu da conta.");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="shrink-0 text-2xl font-black tracking-tight">
          SNEAKER<span className="text-accent">STORE</span>
        </Link>

        <div className="relative hidden flex-1 max-w-xl md:block">
          <Input
            placeholder="O que você está buscando?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-full border-0 bg-primary-foreground/10 pl-4 pr-10 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-accent"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/60" />
        </div>

        <nav className="flex items-center gap-5">
          <Link to="/" className="hidden flex-col items-center text-xs hover:text-accent transition-colors lg:flex">
            <Phone className="h-5 w-5 mb-0.5" />
            Atendimento
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden flex-col items-center text-xs hover:text-accent transition-colors lg:flex">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} className="h-5 w-5 rounded-full mb-0.5 object-cover" />
                ) : (
                  <User className="h-5 w-5 mb-0.5" />
                )}
                {user.user_metadata?.full_name?.split(" ")[0] || "Conta"}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/pedidos")} className="cursor-pointer">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Meus Pedidos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="hidden flex-col items-center text-xs hover:text-accent transition-colors lg:flex">
              <LogIn className="h-5 w-5 mb-0.5" />
              Entrar
            </Link>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="relative flex flex-col items-center text-xs hover:text-accent transition-colors"
          >
            <ShoppingCart className="h-5 w-5 mb-0.5" />
            Carrinho
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;