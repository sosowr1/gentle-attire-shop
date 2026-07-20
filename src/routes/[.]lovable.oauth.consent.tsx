import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Local typed wrapper — the supabase.auth.oauth namespace is beta and TS can't see it.
type OAuthClient = { name?: string; redirect_uri?: string } | null;
type OAuthDetails = { client?: OAuthClient; redirect_url?: string; redirect_to?: string; scope?: string } | null;
interface OAuthResult { data: OAuthDetails | null; error: { message: string } | null }
interface AuthOAuth {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) {
      // TS can't see /auth in the generated tree during authoring — cast is ok here.
      throw redirect({ to: "/auth", search: { next } } as never);
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const oauth = (supabase.auth as unknown as { oauth: AuthOAuth }).oauth;
    const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate } as never);
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-md p-8 text-center">
      <h1 className="font-serif text-2xl">Impossible de charger cette demande</h1>
      <p className="mt-2 text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const oauth = (supabase.auth as unknown as { oauth: AuthOAuth }).oauth;
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorization_id)
      : await oauth.denyAuthorization(authorization_id);
    if (error) { setBusy(false); setError(error.message); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); setError("Redirection manquante."); return; }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "cette application";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-serif text-3xl">Connecter {clientName} à Noora</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {clientName} pourra utiliser les outils de la boutique <strong>en votre nom</strong> :
        parcourir le catalogue, consulter vos commandes, vos favoris et votre panier.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Cela ne contourne pas les règles d'accès de la boutique.
      </p>
      {error && <p className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">{error}</p>}
      <div className="mt-8 flex gap-3">
        <button disabled={busy} onClick={() => decide(true)} className="flex-1 rounded-md bg-foreground py-2.5 text-sm font-medium text-background disabled:opacity-50">Approuver</button>
        <button disabled={busy} onClick={() => decide(false)} className="flex-1 rounded-md border border-border py-2.5 text-sm font-medium disabled:opacity-50">Refuser</button>
      </div>
    </main>
  );
}