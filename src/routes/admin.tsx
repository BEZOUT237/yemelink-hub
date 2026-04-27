import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Trash2, Users, MessageSquare, Briefcase, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — YEMELINK" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"quotes" | "posts" | "projects" | "users">("quotes");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/" });
  }, [user, isAdmin, loading, navigate]);

  const load = async () => {
    let q;
    if (tab === "quotes") q = supabase.from("quotes").select("*").order("created_at", { ascending: false });
    else if (tab === "posts") q = supabase.from("posts").select("*").order("created_at", { ascending: false });
    else if (tab === "projects") q = supabase.from("projects").select("*").order("display_order");
    else q = supabase.from("profiles").select("*");
    const { data } = await q;
    setData(data ?? []);
  };

  useEffect(() => { if (isAdmin) load(); }, [tab, isAdmin]);

  if (!isAdmin) return null;

  const remove = async (table: string, id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const TABS = [
    { id: "quotes" as const, label: "Quotes", icon: MessageSquare },
    { id: "posts" as const, label: "Posts", icon: FileText },
    { id: "projects" as const, label: "Projects", icon: Briefcase },
    { id: "users" as const, label: "Users", icon: Users },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-glow">
          <Shield className="size-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Manage content & users</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? "bg-primary text-primary-foreground shadow-glow" : "glass hover:bg-card"}`}>
            <t.icon className="size-4" /> {t.label} <span className="opacity-60">({data.length})</span>
          </button>
        ))}
      </div>

      <div className="glass-strong rounded-3xl overflow-hidden">
        {data.length === 0 ? (
          <p className="p-12 text-center text-muted-foreground">No items.</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((it: any) => (
              <li key={it.id} className="p-5 flex items-center gap-4 hover:bg-card/50">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{it.name || it.title || it.display_name || it.content?.slice(0, 60) || it.email || it.id}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {it.email || it.message?.slice(0, 80) || it.url || it.bio || ""}
                  </div>
                  {it.created_at && <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(it.created_at).toLocaleString()}</div>}
                </div>
                {tab !== "users" && (
                  <Button onClick={() => remove(tab, it.id)} variant="ghost" size="sm"><Trash2 className="size-4 text-destructive" /></Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
