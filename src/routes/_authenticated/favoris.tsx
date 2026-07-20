import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listMyFavorites } from "@/lib/account.functions";
import { getProduct } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/_authenticated/favoris")({ component: FavoritesPage });

function FavoritesPage() {
  const fetchFavs = useServerFn(listMyFavorites);
  const { data: favs } = useQuery({ queryKey: ["favorites"], queryFn: () => fetchFavs() });
  const products = (favs ?? []).map((f) => getProduct(f.product_id)).filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-10">
      <h1 className="font-serif text-4xl">Mes favoris</h1>
      {products.length === 0 && (
        <p className="mt-8 text-muted-foreground">Aucun favori pour le moment. <Link to="/boutique" className="underline">Parcourir</Link></p>
      )}
      <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-3">
        {products.map((p) => p && <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}