import { Search, Phone, User, ShoppingCart, LogOut, LogIn, ShoppingBag, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Você saiu da conta.");
    navigate("/");
    setMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleLogoClick = () => {
    setSearch("");
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">

        {/* Logo */}
        <button onClick={handleLogoClick} className="shrink-0 text-xl font-black tracking-tight hover:opacity-90 transition-opacity md:text-2xl">
          Cantinho do <span className="text-accent">Tenis</span>
        </button>

        {/* Busca desktop */}
        <form onSubmit={handleSearch} className="relative hidden flex-1 max-w-xl md:flex items-center">
          <Input
            placeholder="O que você está buscando?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-full border-0 bg-primary-foreground/10 pl-4 pr-10 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-accent"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
            <Search className="h-4 w-4 text-primary-foreground/60 hover:text-accent transition-colors" />
          </button>
        </form>

        {/* Ações */}
        <nav className="flex items-center gap-3">

          {/* Busca mobile */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="flex md:hidden items-center justify-center hover:text-accent transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Desktop: Atendimento */}
          <button onClick={() => navigate("/")} className="hidden flex-col items-center text-xs hover:text-accent transition-colors lg:flex">
            <Phone className="h-5 w-5 mb-0.5" />
            Atendimento
          </button>

          {/* Desktop: Conta */}
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
            <button onClick={() => navigate("/login")} className="hidden flex-col items-center text-xs hover:text-accent transition-colors lg:flex">
              <LogIn className="h-5 w-5 mb-0.5" />
              Entrar
            </button>
          )}

          {/* Carrinho */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex flex-col items-center text-xs hover:text-accent transition-colors"
          >
            <ShoppingCart className="h-5 w-5 mb-0.5" />
            <span className="hidden sm:block">Carrinho</span>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </button>

          {/* Menu hamburguer mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center hover:text-accent transition-colors ml-1"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* Busca mobile expandida */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 animate-fade-up">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Input
              placeholder="O que você está buscando?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="h-10 rounded-full border-0 bg-primary-foreground/10 pl-4 pr-10 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-accent"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-primary-foreground/60" />
            </button>
          </form>
        </div>
      )}

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary-foreground/10 animate-fade-up">
          <div className="px-4 py-4 space-y-1">

            {user ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-primary-foreground/10 mb-2">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm">{user.user_metadata?.full_name || "Usuário"}</p>
                    <p className="text-xs text-primary-foreground/50">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => { navigate("/pedidos"); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors text-sm"
                >
                  <ShoppingBag className="h-5 w-5 text-accent" />
                  Meus Pedidos
                </button>

                <button
                  onClick={() => { navigate("/"); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors text-sm"
                >
                  <Phone className="h-5 w-5 text-accent" />
                  Atendimento
                </button>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-sm text-red-400 mt-2"
                >
                  <LogOut className="h-5 w-5" />
                  Sair da conta
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-lg bg-accent text-accent-foreground font-bold text-sm transition-colors"
                >
                  <LogIn className="h-5 w-5" />
                  Entrar / Criar conta
                </button>

                <button
                  onClick={() => { navigate("/"); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors text-sm mt-1"
                >
                  <Phone className="h-5 w-5 text-accent" />
                  Atendimento
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;