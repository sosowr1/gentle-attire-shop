import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listMyOrders } from "@/lib/account.functions";

export const Route = createFileRoute("/_authenticated/commandes")({ component: OrdersPage });

function OrdersPage() {
  const fetchOrders = useServerFn(listMyOrders);
  const { data: orders } = useQuery({ queryKey: ["orders"], queryFn: () => fetchOrders() });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-10">
      <h1 className="font-serif text-4xl">Mes commandes</h1>
      <div className="mt-10 space-y-6">
        {(!orders || orders.length === 0) && (
          <p className="text-muted-foreground">Aucune commande pour le moment. <Link to="/boutique" className="underline">Découvrir la boutique</Link></p>
        )}
        {orders?.map((o: any) => (
          <div key={o.id} className="rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Commande #{o.id.slice(0, 8)}</p>
                <p className="mt-1 text-sm">{new Date(o.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{o.status}</p>
                <p className="mt-1 font-serif text-lg">{Number(o.total).toFixed(2)} €</p>
              </div>
            </div>
            <ul className="mt-4 divide-y divide-border/60 text-sm">
              {o.order_items?.map((it: any, i: number) => (
                <li key={i} className="flex justify-between py-2">
                  <span>{it.product_name} <span className="text-muted-foreground">— {it.size} / {it.color} × {it.quantity}</span></span>
                  <span>{(Number(it.unit_price) * it.quantity).toFixed(2)} €</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}