import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star, Quote } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import catAbayas from "@/assets/cat-abayas.jpg";
import catHijabs from "@/assets/cat-hijabs.jpg";
import catEnsembles from "@/assets/cat-ensembles.jpg";
import catAcc from "@/assets/cat-accessoires.jpg";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/")({
  component: Index,
});

const catImages: Record<string, string> = {
  Abayas: catAbayas,
  Hijabs: catHijabs,
  Ensembles: catEnsembles,
  Accessoires: catAcc,
};

function Index() {
  const news = products.filter((p) => p.isNew).slice(0, 6);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary/50">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24 lg:px-10 lg:py-32">
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Sayyina — Collection Automne 2026
            </p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
              L'élégance pudique,<br />
              <span className="italic text-foreground/85">signée Sayyina.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Des pièces intemporelles pensées pour la femme moderne. Matières nobles, coupes
              confortables et pudiques, confectionnées en petites séries entre Paris et Dubaï.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/boutique"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-medium uppercase tracking-widest text-primary-foreground transition hover:bg-[color:var(--taupe-hover)]"
              >
                Découvrir la collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/boutique"
                search={{ cat: "Hijabs" as const }}
                className="inline-flex items-center rounded-full border border-foreground/25 px-8 py-4 text-xs font-medium uppercase tracking-widest text-foreground transition hover:bg-foreground/5"
              >
                Les hijabs
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-sm bg-nude/30 shadow-[0_30px_80px_-40px_rgba(60,40,20,0.35)]">
              <img src={heroImg} alt="Silhouette Sayyina en abaya crème" className="h-full w-full object-cover" width={1600} height={1200} />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-sm bg-background px-6 py-4 shadow-lg md:block">
              <p className="font-serif text-lg">89€</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Abaya Soie de Médine</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">L'univers Sayyina</p>
            <h2 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">Catégories</h2>
          </div>
          <Link to="/boutique" className="hidden text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground sm:inline">
            Tout voir →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {(["Abayas", "Hijabs", "Ensembles", "Accessoires"] as const).map((cat) => (
            <Link
              key={cat}
              to="/boutique"
              search={{ cat }}
              className="group relative block overflow-hidden rounded-sm bg-secondary/50"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={catImages[cat]}
                  alt={cat}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/60 to-transparent p-5">
                <p className="font-serif text-xl text-background">{cat}</p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-background/80">Découvrir →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NOUVEAUTÉS */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Just in</p>
              <h2 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">Nouveautés</h2>
            </div>
            <Link to="/boutique" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Tout voir →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {news.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* VALEURS / À PROPOS */}
      <section id="valeurs" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24 lg:px-10">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-sm bg-nude/30 shadow-[0_30px_80px_-40px_rgba(60,40,20,0.35)]">
              <img src={catEnsembles} alt="Sayyina — savoir-faire" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -right-4 -top-4 hidden rounded-full bg-background px-5 py-3 text-xs uppercase tracking-widest text-foreground shadow md:block">
              Depuis 2022
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">À propos de Sayyina</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
              L'engagement d'une mode <span className="italic">respectueuse</span>.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Nous croyons qu'un vêtement pudique peut être moderne, confortable et
              magnifiquement construit. Chaque pièce Sayyina est pensée avec des tissus
              certifiés, coupée pour bouger avec vous, et finie à la main pour durer des saisons.
            </p>
            <ul className="mt-8 space-y-4 text-sm">
              {[
                { t: "Tissus nobles et responsables", d: "Soie, crêpe premium, mousseline traçable." },
                { t: "Coupes pudiques & confortables", d: "Fluidité, opacité et amplitude étudiées." },
                { t: "Petites séries, prix justes", d: "Fabrication limitée, sans intermédiaires superflus." },
              ].map((v) => (
                <li key={v.t} className="flex gap-4">
                  <span className="mt-1.5 h-1.5 w-6 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium text-foreground">{v.t}</p>
                    <p className="mt-1 text-muted-foreground">{v.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* AVIS CLIENTES */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Elles nous font confiance</p>
            <h2 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">Avis clientes</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: "Amina R.", c: "Paris", q: "Une qualité incroyable. L'abaya Soie de Médine tombe divinement bien, je reçois des compliments à chaque sortie." },
              { n: "Sofia B.", c: "Lyon", q: "Enfin des hijabs qui ne glissent pas et une mousseline haut de gamme. Sayyina est devenu ma marque de référence." },
              { n: "Yasmine K.", c: "Bruxelles", q: "Livraison rapide, emballage soigné et coupes parfaites. On sent le vrai savoir-faire derrière chaque pièce." },
            ].map((t) => (
              <figure key={t.n} className="rounded-sm bg-background p-8 shadow-[0_10px_40px_-24px_rgba(60,50,40,0.25)]">
                <Quote className="h-6 w-6 text-primary/70" />
                <div className="mt-4 flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground/85">
                  « {t.q} »
                </blockquote>
                <figcaption className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
                  {t.n} — {t.c}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PROMISE */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-10 text-center md:grid-cols-3">
          {[
            { t: "Petites séries", d: "Chaque pièce est confectionnée en quantité limitée pour préserver la qualité." },
            { t: "Matières nobles", d: "Soie, crêpe premium et mousseline sélectionnés avec soin." },
            { t: "Livraison offerte", d: "Livraison offerte en France dès 120€ d'achat, retours gratuits sous 30 jours." },
          ].map((f) => (
            <div key={f.t}>
              <p className="font-serif text-xl">{f.t}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
