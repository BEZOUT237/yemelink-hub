import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, Send, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Post = {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  profile?: { display_name: string | null; avatar_url: string | null } | null;
  likes_count?: number;
  comments_count?: number;
  liked_by_me?: boolean;
};

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — YEMELINK" },
      { name: "description", content: "Join the YEMELINK community: share ideas, ask questions, and connect with creators." },
      { property: "og:title", content: "YEMELINK Community" },
      { property: "og:description", content: "Real-time community feed for entrepreneurs and creators." },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!data) return;
    const userIds = [...new Set(data.map((p: any) => p.user_id))];
    const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds);
    const profMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));

    const enriched = await Promise.all(
      data.map(async (p: any) => {
        const [{ count: likes }, { count: comments }] = await Promise.all([
          supabase.from("likes").select("*", { count: "exact", head: true }).eq("post_id", p.id),
          supabase.from("comments").select("*", { count: "exact", head: true }).eq("post_id", p.id),
        ]);
        let liked = false;
        if (user) {
          const { data: l } = await supabase.from("likes").select("id").eq("post_id", p.id).eq("user_id", user.id).maybeSingle();
          liked = !!l;
        }
        return { ...p, profile: profMap.get(p.user_id) ?? null, likes_count: likes ?? 0, comments_count: comments ?? 0, liked_by_me: liked };
      })
    );
    setPosts(enriched);
  };

  useEffect(() => { load(); }, [user]);

  useEffect(() => {
    const ch = supabase
      .channel("posts-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!content.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("posts").insert({ user_id: user.id, content: content.trim() });
    setPosting(false);
    if (error) toast.error(error.message);
    else { setContent(""); }
  };

  const toggleLike = async (post: Post) => {
    if (!user) { toast.info("Sign in to like posts"); return; }
    if (post.liked_by_me) {
      await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", user.id);
    } else {
      await supabase.from("likes").insert({ post_id: post.id, user_id: user.id });
    }
    load();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-20">
      <div className="text-center mb-10 animate-fade-up">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
          The <span className="text-gradient">Community</span>
        </h1>
        <p className="text-muted-foreground">Share ideas, ask questions, build together.</p>
      </div>

      {user ? (
        <form onSubmit={submit} className="glass-strong rounded-3xl p-5 mb-6 animate-fade-up">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full bg-transparent resize-none focus:outline-none text-sm"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <Button type="button" variant="ghost" size="sm" disabled><ImageIcon className="size-4" /> Photo</Button>
            <Button type="submit" variant="hero" size="sm" disabled={posting || !content.trim()}><Send className="size-4" /> Post</Button>
          </div>
        </form>
      ) : (
        <div className="glass rounded-3xl p-6 mb-6 text-center">
          <p className="text-sm mb-3">Sign in to post and engage with the community.</p>
          <Link to="/auth"><Button variant="hero" size="sm">Sign in</Button></Link>
        </div>
      )}

      <div className="space-y-4">
        {posts.length === 0 && <p className="text-center text-muted-foreground py-12">No posts yet. Be the first!</p>}
        {posts.map((p) => (
          <article key={p.id} className="glass-strong rounded-3xl p-6 animate-fade-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-sm font-bold text-primary-foreground">
                {(p.profile?.display_name || "U")[0].toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold">{p.profile?.display_name ?? "Anonymous"}</div>
                <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</div>
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{p.content}</p>
            {p.image_url && <img src={p.image_url} alt="" className="mt-3 rounded-2xl w-full" />}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
              <button onClick={() => toggleLike(p)} className={`flex items-center gap-1.5 text-xs transition-colors ${p.liked_by_me ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                <Heart className={`size-4 ${p.liked_by_me ? "fill-current" : ""}`} /> {p.likes_count}
              </button>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><MessageCircle className="size-4" /> {p.comments_count}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
