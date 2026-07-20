import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/lib/products";
import { useAuth } from "@/lib/auth-hook";
import { useCart } from "@/lib/cart";
import { listMyFavorites, toggleFavorite } from "@/lib/account.functions";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { addItem, openCart } = useCart();
  const fetchFavs = useServerFn(listMyFavorites);
  const mutateFav = useServerFn(toggleFavorite);
  const qc = useQueryClient();
  const { data: favs } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => fetchFavs(),
    enabled: !!user,
  });
  const isFav = !!favs?.some((f: { product_id: string }) => f.product_id === product.id);
  const toggle = useMutation({
    mutationFn: () => mutateFav({ data: { product_id: product.id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erreur"),
  });

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      size: product.sizes[0],
      color: product.colors[0].name,
      quantity: 1,
    });
    openCart();
    toast.success(`${product.name} ajoutée au panier`, {
      description: `Taille ${product.sizes[0]} · ${product.colors[0].name}`,
    });
  }

  return (
    <div className="group relative">
      <Link to="/produit/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-secondary/40">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-widest text-foreground">
            Nouveau
          </span>
        )}
        {/* Hover overlay with quick actions */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={quickAdd}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground py-3 text-[11px] font-medium uppercase tracking-widest text-background transition hover:bg-primary"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Ajouter
          </button>
          <span
            className="grid h-10 w-10 place-items-center rounded-full bg-background/95 text-foreground transition hover:bg-background"
            aria-hidden
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </span>
        </div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-base leading-snug text-foreground">{product.name}</p>
          <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{product.category}</p>
        </div>
        <p className="text-sm text-foreground">{product.price}€</p>
        </div>
      </Link>
      {user && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle.mutate(); }}
          aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 text-foreground/70 backdrop-blur transition hover:text-foreground z-10"
        >
          <Heart className={`h-4 w-4 ${isFav ? "fill-foreground text-foreground" : ""}`} />
        </button>
      )}
    </div>
  );
}