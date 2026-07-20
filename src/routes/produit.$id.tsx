import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { getProduct, products, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/produit/$id")({
  loader: ({ params }): { product: Product } => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Noora` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — Noora` },
          { property: "og:description", content: loaderData.product.description },
        ]
      : [{ title: "Produit — Noora" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <Link to="/boutique" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Retour à la boutique
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="grid gap-4">
          <div className="aspect-[4/5] overflow-hidden rounded-sm bg-secondary/40">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[product.image, product.image, product.image].map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-sm bg-secondary/40">
                <img src={src} alt="" className="h-full w-full object-cover opacity-90" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{product.category}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground sm:text-5xl">{product.name}</h1>
          <p className="mt-4 font-serif text-2xl text-foreground">{product.price}€</p>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Color */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-foreground/70">Couleur</p>
              <p className="text-xs text-muted-foreground">{color}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  className={`h-9 w-9 rounded-full border-2 transition ${color === c.name ? "border-foreground" : "border-transparent hover:border-foreground/30"}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-foreground/70">Taille</p>
              <button className="text-xs text-muted-foreground underline underline-offset-4">Guide des tailles</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-14 rounded-full border px-4 py-2.5 text-sm transition ${size === s ? "border-foreground bg-foreground text-background" : "border-border/70 hover:border-foreground/50"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addItem({ productId: product.id, size, color, quantity: 1 })}
            className="mt-10 w-full rounded-full bg-foreground py-5 text-xs font-medium uppercase tracking-widest text-background transition hover:opacity-90"
          >
            Ajouter au panier · {product.price}€
          </button>

          <div className="mt-8 space-y-4 border-t border-border/60 pt-8 text-sm">
            <p><span className="font-medium text-foreground">Matière — </span><span className="text-muted-foreground">{product.fabric}</span></p>
          </div>

          <ul className="mt-8 grid grid-cols-3 gap-4 border-t border-border/60 pt-8 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
            <li className="flex flex-col items-center gap-2"><Truck className="h-4 w-4" />Livraison offerte 120€+</li>
            <li className="flex flex-col items-center gap-2"><RotateCcw className="h-4 w-4" />Retours 30 jours</li>
            <li className="flex flex-col items-center gap-2"><ShieldCheck className="h-4 w-4" />Paiement sécurisé</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-10 font-serif text-3xl text-foreground">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}