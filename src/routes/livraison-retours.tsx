import { createFileRoute } from "@tanstack/react-router";
import { Truck, Zap, RotateCcw, PackageCheck, MapPin } from "lucide-react";

export const Route = createFileRoute("/livraison-retours")({
  head: () => ({
    meta: [
      { title: "Livraison & Retours — Sayyina" },
      { name: "description", content: "Délais, tarifs de livraison et procédure de retour Sayyina — 14 jours pour changer d'avis." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Sayyina</p>
        <h1 className="mt-4 font-serif text-5xl text-foreground">Livraison & Retours</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Un service soigné, comme nos pièces. Expédition rapide et retours simples sous 14 jours.
        </p>
      </header>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { icon: Truck, title: "Livraison standard", body: "3 à 5 jours ouvrés · 5,90€ · offerte dès 120€" },
          { icon: Zap, title: "Livraison express", body: "24 à 48h · 12,90€ · commande avant 14h" },
          { icon: MapPin, title: "International", body: "Europe 5-8 jours · Monde 7-14 jours · dès 14,90€" },
        ].map((c) => (
          <div key={c.title} className="rounded-lg border border-border/60 bg-background p-8">
            <c.icon className="h-6 w-6 text-primary" />
            <p className="mt-4 font-serif text-xl">{c.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-20">
        <h2 className="font-serif text-3xl">Politique de retour</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Vous disposez de <strong className="text-foreground">14 jours</strong> à réception pour nous
          retourner un article qui ne vous conviendrait pas. Les pièces doivent être renvoyées
          neuves, non portées, avec leurs étiquettes d'origine.
        </p>

        <ol className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            { n: 1, t: "Contactez-nous", d: "Écrivez à retours@sayyina.com sous 14 jours en indiquant votre numéro de commande." },
            { n: 2, t: "Emballez", d: "Reconditionnez soigneusement les articles avec leurs étiquettes intactes." },
            { n: 3, t: "Expédiez", d: "Utilisez le bordereau prépayé fourni par notre service client." },
            { n: 4, t: "Remboursement", d: "Sous 5 jours ouvrés dès réception, sur votre mode de paiement initial." },
          ].map((s) => (
            <li key={s.n} className="rounded-lg border border-border/60 p-6">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 font-serif text-primary">{s.n}</div>
              <p className="mt-4 font-medium">{s.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex items-start gap-4 rounded-lg bg-secondary/60 p-6 text-sm text-muted-foreground">
          <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            <span className="font-medium text-foreground">Articles non éligibles au retour :</span>{" "}
            hijabs et sous-vêtements, pour des raisons d'hygiène.
          </p>
        </div>

        <div className="mt-10 flex items-start gap-4 rounded-lg border border-border/60 p-6 text-sm text-muted-foreground">
          <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            <span className="font-medium text-foreground">Échanges :</span> pour changer de taille
            ou de couleur, effectuez un retour puis passez une nouvelle commande.
          </p>
        </div>
      </section>
    </div>
  );
}