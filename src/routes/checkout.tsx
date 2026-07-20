import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Lock, Truck, ShieldCheck } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useCart, findProduct } from "@/lib/cart";
import { placeOrder } from "@/lib/account.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Paiement — Sayyina" },
      { name: "description", content: "Finalisez votre commande Sayyina en toute sécurité." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, isAuthenticated, clear } = useCart();
  const navigate = useNavigate();
  const submitOrder = useServerFn(placeOrder);
  const [busy, setBusy] = useState(false);

  const shipping = useMemo(() => (subtotal === 0 ? 0 : subtotal >= 120 ? 0 : 6.9), [subtotal]);
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    country: "France",
    phone: "",
    method: "card" as "card" | "paypal",
    card: "",
    exp: "",
    cvc: "",
  });

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!isAuthenticated) {
      toast("Connectez-vous pour finaliser votre commande.");
      navigate({ to: "/auth", search: { next: "/checkout" } });
      return;
    }
    setBusy(true);
    try {
      const orderItems = items
        .map((i) => {
          const p = findProduct(i.productId);
          if (!p) return null;
          return {
            product_id: p.id,
            product_name: p.name,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
            unit_price: p.price,
          };
        })
        .filter(Boolean) as Array<{
          product_id: string; product_name: string; size: string; color: string; quantity: number; unit_price: number;
        }>;
      await submitOrder({ data: { items: orderItems } });
      toast.success("Commande confirmée ! Merci pour votre confiance.");
      clear();
      navigate({ to: "/_authenticated/commandes" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la commande");
    } finally {
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-10">
        <p className="font-serif text-3xl">Votre panier est vide</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Ajoutez des pièces avant de passer commande.
        </p>
        <Link
          to="/boutique"
          className="mt-8 inline-flex rounded-full bg-primary px-8 py-3 text-xs font-medium uppercase tracking-widest text-primary-foreground transition hover:bg-[color:var(--taupe-hover)]"
        >
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <Link to="/boutique" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Continuer mes achats
      </Link>
      <h1 className="mt-6 font-serif text-4xl text-foreground sm:text-5xl">Paiement</h1>

      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
        {/* LEFT — Address + payment */}
        <div className="space-y-10">
          <section>
            <h2 className="font-serif text-2xl">Coordonnées</h2>
            <div className="mt-5">
              <Field label="Email" value={form.email} type="email" required onChange={(v) => set("email", v)} />
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl">Adresse de livraison</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Prénom" value={form.firstName} required onChange={(v) => set("firstName", v)} />
              <Field label="Nom" value={form.lastName} required onChange={(v) => set("lastName", v)} />
              <div className="sm:col-span-2">
                <Field label="Adresse" value={form.address} required onChange={(v) => set("address", v)} />
              </div>
              <Field label="Code postal" value={form.zip} required onChange={(v) => set("zip", v)} />
              <Field label="Ville" value={form.city} required onChange={(v) => set("city", v)} />
              <Field label="Pays" value={form.country} required onChange={(v) => set("country", v)} />
              <Field label="Téléphone" value={form.phone} type="tel" required onChange={(v) => set("phone", v)} />
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-sm border border-border/70 bg-secondary/40 p-4 text-sm">
              <Truck className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-medium text-foreground">Livraison standard — 3 à 5 jours ouvrés</p>
                <p className="mt-1 text-muted-foreground">
                  Offerte dès 120€ d'achat, sinon 6,90€. Retours gratuits 30 jours.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl">Paiement</h2>
            <div className="mt-5 space-y-3">
              <MethodRadio
                checked={form.method === "card"}
                onChange={() => set("method", "card")}
                label="Carte bancaire"
                sub="Visa, Mastercard, Amex"
              />
              <MethodRadio
                checked={form.method === "paypal"}
                onChange={() => set("method", "paypal")}
                label="PayPal"
                sub="Vous serez redirigée pour finaliser."
              />
            </div>

            {form.method === "card" && (
              <div className="mt-5 grid gap-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <Field label="Numéro de carte" value={form.card} placeholder="1234 5678 9012 3456" onChange={(v) => set("card", v)} />
                </div>
                <div className="sm:col-span-3">
                  <Field label="Expiration" value={form.exp} placeholder="MM/AA" onChange={(v) => set("exp", v)} />
                </div>
                <div className="sm:col-span-3">
                  <Field label="CVC" value={form.cvc} placeholder="123" onChange={(v) => set("cvc", v)} />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT — Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-sm border border-border/70 bg-secondary/30 p-6">
            <p className="font-serif text-xl">Récapitulatif</p>
            <ul className="mt-5 space-y-4">
              {items.map((it, idx) => {
                const p = findProduct(it.productId);
                if (!p) return null;
                return (
                  <li key={idx} className="flex gap-4">
                    <div className="relative">
                      <img src={p.image} alt={p.name} className="h-20 w-16 rounded-sm object-cover" />
                      <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1 text-[10px] text-background">
                        {it.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="font-serif text-sm leading-snug">{p.name}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                        {it.color} · {it.size}
                      </p>
                      <p className="mt-auto text-sm">{(p.price * it.quantity).toFixed(0)}€</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 space-y-2 border-t border-border/60 pt-5 text-sm">
              <Row label="Sous-total" value={`${subtotal.toFixed(2)}€`} />
              <Row
                label="Livraison"
                value={shipping === 0 ? "Offerte" : `${shipping.toFixed(2)}€`}
                muted={shipping === 0}
              />
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t border-border/60 pt-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Total</span>
              <span className="font-serif text-2xl">{total.toFixed(2)}€</span>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-xs font-medium uppercase tracking-widest text-primary-foreground transition hover:bg-[color:var(--taupe-hover)] disabled:opacity-60"
            >
              <Lock className="h-3.5 w-3.5" />
              {busy ? "Traitement…" : `Payer ${total.toFixed(2)}€`}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              Paiement 100% sécurisé
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-widest text-foreground/70">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-sm border border-border/70 bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground/60"
      />
    </label>
  );
}

function MethodRadio({ checked, onChange, label, sub }: { checked: boolean; onChange: () => void; label: string; sub: string; }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-4 rounded-sm border p-4 transition ${
        checked ? "border-foreground/70 bg-background" : "border-border/70 bg-background/60 hover:border-foreground/30"
      }`}
    >
      <input type="radio" checked={checked} onChange={onChange} className="h-4 w-4 accent-[color:var(--primary)]" />
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </label>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={muted ? "text-primary" : "text-foreground"}>{value}</span>
    </div>
  );
}