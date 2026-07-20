import { Link } from "@tanstack/react-router";
import { ShoppingBag, Search, Menu, User } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth-hook";

export function SiteHeader() {
  const { count, openCart } = useCart();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <button className="lg:hidden text-foreground/80" aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden lg:flex items-center gap-8 text-sm tracking-wide text-foreground/75">
          <Link to="/boutique" className="hover:text-foreground transition-colors">Boutique</Link>
          <Link to="/boutique" search={{ cat: "Abayas" as const }} className="hover:text-foreground transition-colors">Abayas</Link>
          <Link to="/boutique" search={{ cat: "Hijabs" as const }} className="hover:text-foreground transition-colors">Hijabs</Link>
          <Link to="/boutique" search={{ cat: "Ensembles" as const }} className="hover:text-foreground transition-colors">Ensembles</Link>
        </nav>

        <Link to="/" className="font-serif text-2xl tracking-widest text-foreground">
          NOORA
        </Link>

        <div className="flex items-center gap-4 text-foreground/80">
          <button aria-label="Rechercher" className="hidden sm:inline-flex hover:text-foreground">
            <Search className="h-5 w-5" />
          </button>
          {user ? (
            <Link
              to="/_authenticated/compte"
              aria-label="Mon compte"
              className="hover:text-foreground"
            >
              <User className="h-5 w-5" />
            </Link>
          ) : (
            <Link
              to="/auth"
              aria-label="Se connecter"
              className="text-xs uppercase tracking-widest hover:text-foreground"
            >
              Connexion
            </Link>
          )}
          <button
            onClick={openCart}
            aria-label="Ouvrir le panier"
            className="relative hover:text-foreground"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}