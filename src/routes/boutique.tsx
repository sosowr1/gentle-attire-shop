import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { products, categories } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

const searchSchema = z.object({
  cat: z.enum(["Abayas", "Hijabs", "Ensembles", "Accessoires"]).optional(),
});

export const Route = createFileRoute("/boutique")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Boutique — Noora" },
      { name: "description", content: "Découvrez notre collection d'abayas, hijabs et ensembles modestes." },
    ],
  }),
  component: Boutique,
});

const allSizes = ["S", "M", "L", "XL", "Unique"];
const allColors = ["Beige sable", "Nude", "Taupe", "Blanc cassé", "Cognac"];

function Boutique() {
  const { cat } = Route.useSearch();
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(150);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (sizes.length && !sizes.some((s) => p.sizes.includes(s))) return false;
      if (colors.length && !colors.some((c) => p.colors.some((pc) => pc.name === c))) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
  }, [cat, sizes, colors, maxPrice]);

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) => {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <header className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Boutique</p>
        <h1 className="mt-4 font-serif text-5xl text-foreground sm:text-6xl">
          {cat ?? "Toute la collection"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          {filtered.length} pièce{filtered.length > 1 ? "s" : ""} confectionnée{filtered.length > 1 ? "s" : ""} avec soin.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link
            to="/boutique"
            className={`rounded-full border px-5 py-2 text-xs uppercase tracking-widest transition ${!cat ? "border-foreground bg-foreground text-background" : "border-border/70 text-foreground/70 hover:border-foreground/50"}`}
          >
            Tout
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/boutique"
              search={{ cat: c.slug }}
              className={`rounded-full border px-5 py-2 text-xs uppercase tracking-widest transition ${cat === c.slug ? "border-foreground bg-foreground text-background" : "border-border/70 text-foreground/70 hover:border-foreground/50"}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-8 text-sm">
          <FilterGroup title="Taille">
            <div className="flex flex-wrap gap-2">
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(sizes, s, setSizes)}
                  className={`min-w-10 rounded-full border px-3 py-1.5 text-xs transition ${sizes.includes(s) ? "border-foreground bg-foreground text-background" : "border-border/70 hover:border-foreground/50"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Couleur">
            <ul className="space-y-2">
              {allColors.map((c) => (
                <li key={c}>
                  <label className="flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={colors.includes(c)}
                      onChange={() => toggle(colors, c, setColors)}
                      className="h-4 w-4 accent-foreground"
                    />
                    {c}
                  </label>
                </li>
              ))}
            </ul>
          </FilterGroup>

          <FilterGroup title="Prix">
            <div>
              <input
                type="range"
                min={30}
                max={150}
                step={5}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-foreground"
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>30€</span>
                <span>jusqu'à {maxPrice}€</span>
              </div>
            </div>
          </FilterGroup>
        </aside>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-16 text-center text-muted-foreground">
              Aucune pièce ne correspond à vos filtres.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-foreground/70">{title}</p>
      {children}
    </div>
  );
}