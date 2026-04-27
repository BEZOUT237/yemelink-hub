import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, User as UserIcon, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — YEMELINK" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setDisplayName((data as any).display_name ?? "");
        setBio((data as any).bio ?? "");
      }
    });
  }, [user]);

  if (!user) return null;

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id, display_name: displayName, bio,
    });
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Profile updated.");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-20">
      <div className="glass-strong rounded-3xl p-8 md:p-12 animate-fade-up">
        <div className="flex items-center gap-4 mb-8">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-2xl font-bold text-primary-foreground">
            {(displayName || user.email || "U")[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{displayName || "Your profile"}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Mail className="size-3" />{user.email}</p>
            {isAdmin && <span className="inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary"><Shield className="size-3" /> Admin</span>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="dn"><UserIcon className="inline size-3 mr-1" />Display name</Label>
            <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1.5 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          <Button onClick={save} variant="hero" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
          {isAdmin && <Link to="/admin"><Button variant="glass"><Shield className="size-4" /> Admin Panel</Button></Link>}
          <Button onClick={() => { signOut(); navigate({ to: "/" }); }} variant="ghost"><LogOut className="size-4" /> Sign out</Button>
        </div>
      </div>
    </div>
  );
}
