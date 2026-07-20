import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/produit/$id"
      params={{ id: product.id }}
      className="group block"
    >
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
  );
}