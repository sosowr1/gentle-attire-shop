import { Link } from "@tanstack/react-router";
import { ShoppingBag, Search, Menu, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth-hook";

export function SiteHeader() {
  const { count, openCart } = useCart();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { to: "/boutique", label: "Boutique", search: undefined },
    { to: "/boutique", label: "Abayas", search: { cat: "Abayas" as const } },
    { to: "/boutique", label: "Hijabs", search: { cat: "Hijabs" as const } },
    { to: "/boutique", label: "Ensembles", search: { cat: "Ensembles" as const } },
    { to: "/boutique", label: "Accessoires", search: { cat: "Accessoires" as const } },
  ] as const;

  return (
    <>
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-xl shadow-[0_1px_20px_-12px_rgba(60,50,40,0.25)]"
          : "border-b border-transparent bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 lg:px-10 ${scrolled ? "h-14" : "h-20"}`}>
        <button
          className="lg:hidden text-foreground/80"
          aria-label="Ouvrir le menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden lg:flex items-center gap-8 text-sm tracking-wide text-foreground/75">
          <Link to="/boutique" className="hover:text-foreground transition-colors">Boutique</Link>
          <Link to="/boutique" search={{ cat: "Abayas" as const }} className="hover:text-foreground transition-colors">Abayas</Link>
          <Link to="/boutique" search={{ cat: "Hijabs" as const }} className="hover:text-foreground transition-colors">Hijabs</Link>
          <Link to="/boutique" search={{ cat: "Ensembles" as const }} className="hover:text-foreground transition-colors">Ensembles</Link>
        </nav>

        <Link
          to="/"
          aria-label="Sayyina — Accueil"
          className="font-serif italic text-3xl tracking-[0.15em] text-foreground"
        >
          Sayyina
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

      {/* Mobile burger drawer */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col bg-background shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="font-serif italic text-2xl tracking-[0.15em] text-foreground"
          >
            Sayyina
          </Link>
          <button onClick={() => setMobileOpen(false)} aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-6 py-8">
          <ul className="space-y-1">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  search={l.search as never}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-3 font-serif text-2xl text-foreground/85 hover:bg-secondary hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 border-t border-border/60 pt-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-foreground/60">Aide</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/livraison-retours" onClick={() => setMobileOpen(false)} className="block py-2 hover:text-foreground">Livraison & Retours</Link></li>
              <li><Link to="/faq" onClick={() => setMobileOpen(false)} className="block py-2 hover:text-foreground">FAQ</Link></li>
              <li>
                {user ? (
                  <Link to="/_authenticated/compte" onClick={() => setMobileOpen(false)} className="block py-2 hover:text-foreground">Mon compte</Link>
                ) : (
                  <Link to="/auth" onClick={() => setMobileOpen(false)} className="block py-2 hover:text-foreground">Connexion</Link>
                )}
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}