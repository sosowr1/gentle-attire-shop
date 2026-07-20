import { X, Minus, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart, findProduct } from "@/lib/cart";

export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, updateQty, removeItem } = useCart();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <p className="font-serif text-xl">Votre panier</p>
          <button onClick={closeCart} aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-serif text-lg">Votre panier est vide</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Découvrez nos nouvelles pièces pour l'habiller.
              </p>
              <Link
                to="/boutique"
                onClick={closeCart}
                className="mt-6 inline-flex items-center rounded-full bg-foreground px-6 py-3 text-xs font-medium uppercase tracking-widest text-background transition hover:opacity-90"
              >
                Découvrir la boutique
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {items.map((item, idx) => {
                const p = findProduct(item.productId);
                if (!p) return null;
                return (
                  <li key={idx} className="flex gap-4 py-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-24 w-20 rounded-md object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="font-serif text-base leading-snug">{p.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.color} · Taille {item.size}
                          </p>
                        </div>
                        <p className="text-sm">{(p.price * item.quantity).toFixed(0)}€</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center rounded-full border border-border/70">
                          <button
                            className="grid h-8 w-8 place-items-center"
                            onClick={() => updateQty(idx, item.quantity - 1)}
                            aria-label="Diminuer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            className="grid h-8 w-8 place-items-center"
                            onClick={() => updateQty(idx, item.quantity + 1)}
                            aria-label="Augmenter"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(idx)}
                          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/60 px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm uppercase tracking-widest text-muted-foreground">
                Sous-total
              </span>
              <span className="font-serif text-2xl">{subtotal.toFixed(0)}€</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Livraison offerte dès 120€.</p>
            <button className="mt-5 w-full rounded-full bg-foreground py-4 text-xs font-medium uppercase tracking-widest text-background transition hover:opacity-90">
              Passer commande
            </button>
          </div>
        )}
      </aside>
    </>
  );
}