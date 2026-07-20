import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

const searchSchema = z.object({ next: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  component: AuthPage,
});

function isSafeNext(next?: string): string {
  if (!next) return "/";
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  return "/";
}

function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const next = isSafeNext(search.next);
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: next });
    });
  }, [navigate, next]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: next });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${next}`,
            data: { name },
          },
        });
        if (error) throw error;
        toast.success("Compte créé — vous êtes connecté(e).");
        navigate({ to: next });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("E-mail de réinitialisation envoyé.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function signInGoogle() {
    setBusy(true);
    try {
      const nextParam = next !== "/" ? `?next=${encodeURIComponent(next)}` : "";
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth${nextParam}`,
      });
      if (result.error) throw result.error;
      if (!result.redirected) navigate({ to: next });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur Google");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-serif text-3xl text-foreground">
        {mode === "signin" && "Bon retour"}
        {mode === "signup" && "Créer un compte"}
        {mode === "forgot" && "Mot de passe oublié"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "forgot"
          ? "Nous vous enverrons un lien pour choisir un nouveau mot de passe."
          : "Accédez à vos commandes, favoris et panier synchronisé."}
      </p>

      {mode !== "forgot" && (
        <button
          type="button"
          onClick={signInGoogle}
          disabled={busy}
          className="mt-8 inline-flex items-center justify-center gap-3 rounded-md border border-border bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.4-.2-2H12v3.9h5.9c-.1.9-.7 2.4-2.1 3.4l-.02.13 3.05 2.36.21.02c1.94-1.8 3.06-4.44 3.06-7.81z"/><path fill="#34A853" d="M12 23c2.76 0 5.08-.9 6.78-2.46l-3.24-2.5c-.87.6-2.03 1.03-3.54 1.03-2.7 0-5-1.78-5.82-4.24l-.12.01-3.17 2.45-.04.11C4.53 20.5 8 23 12 23z"/><path fill="#FBBC05" d="M6.18 13.83A6.8 6.8 0 015.82 12c0-.63.11-1.25.35-1.83l-.01-.12-3.2-2.49-.11.05A11 11 0 001 12c0 1.78.43 3.47 1.85 4.39l3.33-2.56z"/><path fill="#EA4335" d="M12 4.75c1.92 0 3.21.83 3.95 1.52l2.89-2.82C17.06 1.76 14.76 1 12 1 8 1 4.53 3.5 2.85 7.61l3.32 2.56C7 7.7 9.3 4.75 12 4.75z"/></svg>
          Continuer avec Google
        </button>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "signup" && (
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Nom</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </div>
        )}
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
        </div>
        {mode !== "forgot" && (
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </div>
        )}
        <button disabled={busy} className="w-full rounded-md bg-foreground py-2.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50">
          {mode === "signin" && "Se connecter"}
          {mode === "signup" && "Créer mon compte"}
          {mode === "forgot" && "Envoyer le lien"}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-sm text-muted-foreground">
        {mode === "signin" && (
          <>
            <button onClick={() => setMode("forgot")} className="underline hover:text-foreground">Mot de passe oublié ?</button>
            <p>Pas encore de compte ? <button onClick={() => setMode("signup")} className="underline hover:text-foreground">Créer un compte</button></p>
          </>
        )}
        {mode === "signup" && (
          <p>Déjà inscrit(e) ? <button onClick={() => setMode("signin")} className="underline hover:text-foreground">Se connecter</button></p>
        )}
        {mode === "forgot" && (
          <button onClick={() => setMode("signin")} className="underline hover:text-foreground">Retour à la connexion</button>
        )}
        <p className="pt-4"><Link to="/" className="hover:text-foreground">← Retour à la boutique</Link></p>
      </div>
    </div>
  );
}