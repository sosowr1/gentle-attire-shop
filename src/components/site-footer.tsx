import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";
import { toast } from "sonner";

type FooterLink = {
  label: string;
  to: "/boutique" | "/" | "/auth" | "/livraison-retours" | "/faq" | "/cgv" | "/mentions-legales";
  search?: { cat: "Abayas" | "Hijabs" | "Ensembles" | "Accessoires" };
  hash?: string;
};

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="md:col-span-2">
      <p className="text-xs font-medium uppercase tracking-widest text-foreground/70">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              search={l.search as never}
              hash={l.hash}
              className="hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const [email, setEmail] = useState("");

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Entrez un email valide.");
    toast.success("Merci ! Vous êtes inscrite à la newsletter Sayyina.");
    setEmail("");
  }

  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-12 lg:px-10">
        <div className="md:col-span-5">
          <Link to="/" className="font-serif italic text-3xl tracking-[0.15em] text-foreground">
            Sayyina
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Sayyina habille la femme moderne — pudeur, matières nobles et coupes intemporelles,
            confectionnées en petites séries entre Paris et Dubaï.
          </p>
          <form onSubmit={subscribe} className="mt-8">
            <label htmlFor="footer-newsletter" className="text-xs font-medium uppercase tracking-widest text-foreground/70">
              Newsletter
            </label>
            <div className="mt-3 flex items-center overflow-hidden rounded-full border border-border/70 bg-background focus-within:border-foreground/50">
              <Mail className="ml-4 h-4 w-4 text-muted-foreground" />
              <input
                id="footer-newsletter"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                className="m-1 rounded-full bg-primary px-5 py-2.5 text-[11px] font-medium uppercase tracking-widest text-primary-foreground transition hover:bg-[color:var(--taupe-hover)]"
              >
                S'inscrire
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              -10% sur votre première commande. Désinscription à tout moment.
            </p>
          </form>
        </div>

        <FooterCol
          title="Boutique"
          links={[
            { label: "Toute la collection", to: "/boutique" },
            { label: "Abayas", to: "/boutique", search: { cat: "Abayas" as const } },
            { label: "Hijabs", to: "/boutique", search: { cat: "Hijabs" as const } },
            { label: "Nouveautés", to: "/boutique" },
          ]}
        />
        <FooterCol
          title="Aide"
          links={[
            { label: "Livraison & Retours", to: "/livraison-retours" },
            { label: "FAQ", to: "/faq" },
            { label: "Contact", to: "/faq" },
          ]}
        />
        <FooterCol
          title="Maison"
          links={[
            { label: "Nos valeurs", to: "/", hash: "valeurs" },
            { label: "Mon compte", to: "/auth" },
            { label: "CGV", to: "/cgv" },
            { label: "Mentions légales", to: "/mentions-legales" },
          ]}
        />

        <div className="md:col-span-1 md:justify-self-end">
          <p className="text-xs font-medium uppercase tracking-widest text-foreground/70">Suivre</p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="mt-4 grid h-10 w-10 place-items-center rounded-full border border-border/70 text-foreground/70 transition hover:border-foreground hover:text-foreground"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} Sayyina. Tous droits réservés.</p>
          <p>Paiement sécurisé · CB · Apple Pay · PayPal</p>
        </div>
      </div>
    </footer>
  );
}