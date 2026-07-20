import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [
      { title: "Conditions Générales de Vente — Sayyina" },
      { name: "description", content: "Conditions générales de vente Sayyina : commandes, prix, livraisons, retours, garanties et litiges." },
    ],
  }),
  component: Page,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Légal</p>
        <h1 className="mt-4 font-serif text-5xl text-foreground">Conditions Générales de Vente</h1>
        <p className="mt-4 text-sm text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
      </header>

      <Section title="1. Objet">
        <p>
          Les présentes conditions générales de vente régissent les relations contractuelles entre
          Sayyina et toute personne effectuant un achat sur le site sayyina.com. Toute commande implique
          l'acceptation sans réserve des présentes conditions.
        </p>
      </Section>

      <Section title="2. Produits">
        <p>
          Les articles proposés sont ceux figurant sur le site le jour de la consultation, dans la
          limite des stocks disponibles. Les photographies sont non contractuelles.
        </p>
      </Section>

      <Section title="3. Prix">
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises. Sayyina se réserve le droit de
          modifier ses tarifs à tout moment ; les articles seront facturés au prix en vigueur lors de
          la validation de la commande.
        </p>
      </Section>

      <Section title="4. Commande">
        <p>
          La commande est confirmée après validation du paiement. Un email récapitulatif est envoyé à
          la cliente. Sayyina se réserve le droit d'annuler toute commande en cas de litige.
        </p>
      </Section>

      <Section title="5. Paiement">
        <p>
          Le paiement s'effectue par carte bancaire, Apple Pay ou PayPal. Les transactions sont
          sécurisées via un protocole SSL et traitées par notre prestataire de paiement.
        </p>
      </Section>

      <Section title="6. Livraison">
        <p>
          Les délais et tarifs sont détaillés sur la page Livraison & Retours. Les délais commencent à
          courir à compter de l'expédition. Sayyina ne peut être tenue responsable des retards
          imputables aux transporteurs.
        </p>
      </Section>

      <Section title="7. Droit de rétractation">
        <p>
          Conformément au Code de la consommation, la cliente dispose d'un délai de 14 jours à
          réception pour retourner un article non porté. Les frais de retour sont pris en charge par
          Sayyina via un bordereau prépayé.
        </p>
      </Section>

      <Section title="8. Garanties">
        <p>
          Tous les articles bénéficient de la garantie légale de conformité et de la garantie contre
          les vices cachés. Contactez-nous pour toute réclamation.
        </p>
      </Section>

      <Section title="9. Données personnelles">
        <p>
          Les informations collectées sont nécessaires au traitement des commandes. Conformément au
          RGPD, la cliente dispose d'un droit d'accès, de rectification et de suppression de ses
          données.
        </p>
      </Section>

      <Section title="10. Litiges">
        <p>
          Les présentes conditions sont soumises au droit français. En cas de litige, une solution
          amiable sera recherchée avant tout recours judiciaire.
        </p>
      </Section>
    </div>
  );
}