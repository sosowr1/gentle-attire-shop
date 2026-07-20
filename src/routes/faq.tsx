import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Sayyina" },
      { name: "description", content: "Réponses aux questions fréquentes sur les commandes, livraisons, retours et entretien Sayyina." },
    ],
  }),
  component: Page,
});

const sections: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Commandes",
    items: [
      { q: "Comment passer commande ?", a: "Ajoutez vos pièces au panier, cliquez sur 'Passer à la caisse' puis renseignez votre adresse et votre paiement. Vous recevrez une confirmation par email en quelques secondes." },
      { q: "Puis-je modifier ma commande ?", a: "Contactez-nous dans l'heure suivant votre commande à contact@sayyina.com — nous ferons notre possible avant expédition." },
      { q: "Quels moyens de paiement acceptez-vous ?", a: "Carte bancaire (Visa, Mastercard, CB), Apple Pay et PayPal. Paiement 100% sécurisé." },
    ],
  },
  {
    title: "Livraison",
    items: [
      { q: "Quels sont les délais de livraison ?", a: "Standard : 3 à 5 jours ouvrés. Express : 24 à 48h. Livraison offerte dès 120€ d'achat en France métropolitaine." },
      { q: "Livrez-vous à l'international ?", a: "Oui, dans toute l'Europe (5-8 jours) et à l'international (7-14 jours). Les frais varient selon la destination." },
      { q: "Comment suivre ma commande ?", a: "Un email avec un lien de suivi vous est envoyé dès l'expédition depuis notre atelier." },
    ],
  },
  {
    title: "Retours",
    items: [
      { q: "Combien de temps pour retourner un article ?", a: "Vous avez 14 jours à réception pour nous retourner une pièce non portée, avec ses étiquettes." },
      { q: "Les retours sont-ils gratuits ?", a: "Nous fournissons un bordereau prépayé sur simple demande à retours@sayyina.com." },
      { q: "Quand serai-je remboursée ?", a: "Sous 5 jours ouvrés dès réception du colis dans notre entrepôt, sur votre moyen de paiement initial." },
    ],
  },
  {
    title: "Entretien des articles",
    items: [
      { q: "Comment laver la soie ?", a: "Lavage à la main à l'eau froide avec un savon doux. Séchage à plat, à l'abri de la lumière directe." },
      { q: "Puis-je laver mes abayas en machine ?", a: "Nos abayas en viscose et crêpe supportent un cycle délicat à 30°C, à l'envers, dans un filet de protection." },
      { q: "Comment repasser mes pièces ?", a: "Fer à basse température sur l'envers du tissu. Évitez la vapeur directe sur les broderies." },
    ],
  },
];

function Page() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Aide</p>
        <h1 className="mt-4 font-serif text-5xl text-foreground">FAQ</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Vous trouverez ici les réponses aux questions les plus fréquentes.
        </p>
      </header>

      <div className="mt-14 space-y-12">
        {sections.map((sec) => (
          <section key={sec.title}>
            <h2 className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-foreground/70">{sec.title}</h2>
            <Accordion type="single" collapsible className="w-full">
              {sec.items.map((item, i) => (
                <AccordionItem key={i} value={`${sec.title}-${i}`} className="border-border/60">
                  <AccordionTrigger className="text-left font-serif text-lg hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </div>
  );
}