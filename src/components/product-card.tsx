import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/lib/products";
import { useAuth } from "@/lib/auth-hook";
import { listMyFavorites, toggleFavorite } from "@/lib/account.functions";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
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

  return (
    <div className="group relative">
      <Link to="/produit/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-secondary/40">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-widest text-foreground">
            Nouveau
          </span>
        )}
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
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 text-foreground/70 backdrop-blur transition hover:text-foreground"
        >
          <Heart className={`h-4 w-4 ${isFav ? "fill-foreground text-foreground" : ""}`} />
        </button>
      )}
    </div>
  );
}