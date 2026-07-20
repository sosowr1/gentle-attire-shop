import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile } from "@/lib/account.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/compte")({ component: AccountPage });

function AccountPage() {
  const navigate = useNavigate();
  const fetchProfile = useServerFn(getMyProfile);
  const updateProfile = useServerFn(updateMyProfile);
  const { data: profile, refetch } = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });
  const [name, setName] = useState("");

  useEffect(() => {
    if (profile?.display_name) setName(profile.display_name);
  }, [profile]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await updateProfile({ data: { display_name: name } });
    await refetch();
    toast.success("Profil mis à jour");
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10">
      <h1 className="font-serif text-4xl text-foreground">Mon compte</h1>
      <div className="mt-10 grid gap-8 md:grid-cols-[220px_1fr]">
        <nav className="flex flex-col gap-1 text-sm">
          <Link to="/_authenticated/compte" className="rounded-md bg-muted px-3 py-2 font-medium">Profil</Link>
          <Link to="/_authenticated/commandes" className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground">Mes commandes</Link>
          <Link to="/_authenticated/favoris" className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground">Mes favoris</Link>
          <button onClick={signOut} className="mt-4 rounded-md px-3 py-2 text-left text-muted-foreground hover:text-foreground">Se déconnecter</button>
        </nav>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Nom d'affichage</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <button className="rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90">Enregistrer</button>
        </form>
      </div>
    </div>
  );
}