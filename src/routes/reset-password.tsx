import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({ component: ResetPasswordPage });

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Mot de passe mis à jour.");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-serif text-3xl">Nouveau mot de passe</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input type="password" value={password} minLength={8} required onChange={(e) => setPassword(e.target.value)} placeholder="Nouveau mot de passe" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
        <button disabled={busy} className="w-full rounded-md bg-foreground py-2.5 text-sm font-medium text-background disabled:opacity-50">Enregistrer</button>
      </form>
    </div>
  );
}