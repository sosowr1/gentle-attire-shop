import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Sayyina" },
      { name: "description", content: "Mentions légales du site Sayyina : éditeur, hébergement, propriété intellectuelle." },
    ],
  }),
  component: Page,
});

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Légal</p>
        <h1 className="mt-4 font-serif text-5xl">Mentions légales</h1>
      </header>

      <Block title="Éditeur du site">
        <p>Sayyina — Société par actions simplifiée</p>
        <p>Siège social : 12 rue de la Mode, 75008 Paris, France</p>
        <p>Capital social : 10 000 €</p>
        <p>RCS Paris : 000 000 000 · TVA intra : FR00000000000</p>
        <p>Email : contact@sayyina.com</p>
      </Block>

      <Block title="Directrice de la publication">
        <p>Sayyina — Direction éditoriale</p>
      </Block>

      <Block title="Hébergement">
        <p>Le site est hébergé par Cloudflare Inc., 101 Townsend Street, San Francisco, CA 94107, USA.</p>
      </Block>

      <Block title="Propriété intellectuelle">
        <p>
          L'ensemble des éléments présents sur ce site (textes, visuels, logos, photographies) est la
          propriété exclusive de Sayyina. Toute reproduction, même partielle, est interdite sans
          autorisation écrite préalable.
        </p>
      </Block>

      <Block title="Données personnelles & cookies">
        <p>
          Sayyina traite vos données conformément au RGPD. Vous disposez d'un droit d'accès, de
          rectification, de suppression et de portabilité de vos données. Pour exercer ces droits,
          contactez privacy@sayyina.com.
        </p>
      </Block>

      <Block title="Crédits">
        <p>Design et développement : Studio Sayyina. Photographies : atelier Sayyina.</p>
      </Block>
    </div>
  );
}