export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <p className="font-serif text-2xl tracking-widest text-foreground">NOORA</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Vêtements pensés pour la femme moderne — modestie, matières nobles et coupes intemporelles.
            Confectionnés en petites séries.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-foreground/70">Maison</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Notre histoire</li><li>Matières & savoir-faire</li><li>Livraison & retours</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-foreground/70">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>hello@noora.co</li><li>+33 1 45 22 18 90</li><li>Paris — Dubaï</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Noora. Confectionné avec soin.
      </div>
    </footer>
  );
}