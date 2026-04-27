import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, ExternalLink, BookOpen, Youtube } from "lucide-react";
import { BRAND } from "@/lib/brand";

type Video = { id: string; title: string; thumbnail: string; published: string; link: string };
type Article = { title: string; link: string; pubDate: string; thumbnail: string | null; description: string };

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & Videos — YEMELINK" },
      { name: "description", content: "Latest YouTube videos and blog articles from YEMELINK — tech, design, marketing, and entrepreneurship." },
      { property: "og:title", content: "YEMELINK Blog & Videos" },
      { property: "og:description", content: "Tutorials, insights, and behind-the-scenes from YEMELINK." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [tab, setTab] = useState<"videos" | "articles">("videos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ytFeed = "https://www.youtube.com/feeds/videos.xml?user=YEMELINK2000";
    const ytChannelFeed = "https://www.youtube.com/feeds/videos.xml?channel_id=";
    const blogFeed = "https://yemelink.blogspot.com/feeds/posts/default?alt=rss";

    const fetchRss = async (url: string) => {
      const proxied = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
      const res = await fetch(proxied);
      if (!res.ok) throw new Error("rss fetch failed");
      return res.json();
    };

    Promise.all([
      fetchRss(ytFeed).catch(() => fetchRss("https://www.youtube.com/@YEMELINK2000")),
      fetchRss(blogFeed),
    ]).then(([yt, blog]) => {
      const vids: Video[] = (yt?.items ?? []).map((it: any) => {
        const id = it.guid?.split(":").pop() ?? it.link?.split("v=")[1]?.split("&")[0] ?? "";
        return {
          id,
          title: it.title,
          thumbnail: it.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          published: it.pubDate,
          link: it.link,
        };
      });
      setVideos(vids);

      const arts: Article[] = (blog?.items ?? []).map((it: any) => {
        const m = (it.description || it.content || "").match(/<img[^>]+src=["']([^"']+)["']/);
        return {
          title: it.title,
          link: it.link,
          pubDate: it.pubDate,
          thumbnail: m?.[1] ?? null,
          description: (it.description || "").replace(/<[^>]+>/g, "").slice(0, 160),
        };
      });
      setArticles(arts);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="text-center mb-10 animate-fade-up">
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Blog & <span className="text-gradient">Videos</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
          Tutorials, insights & stories from YEMELINK — auto-synced from YouTube and our blog.
        </p>
        <div className="inline-flex glass rounded-full p-1">
          <button onClick={() => setTab("videos")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${tab === "videos" ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"}`}>
            <Youtube className="inline size-4 mr-1.5" /> Videos
          </button>
          <button onClick={() => setTab("articles")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${tab === "articles" ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"}`}>
            <BookOpen className="inline size-4 mr-1.5" /> Articles
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-video rounded-2xl glass animate-pulse" />)}
        </div>
      ) : tab === "videos" ? (
        videos.length === 0 ? (
          <div className="text-center py-16 glass rounded-3xl">
            <p className="text-muted-foreground mb-4">Videos couldn't load right now.</p>
            <a href={BRAND.socials[0].url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit our YouTube channel →</a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v, i) => (
              <a key={v.id} href={v.link} target="_blank" rel="noopener noreferrer" className="group glass-strong rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-deep transition-all animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="aspect-video relative overflow-hidden bg-card">
                  <img src={v.thumbnail} alt={v.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-14 rounded-full bg-primary/90 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                      <Play className="size-6 text-primary-foreground fill-current" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{v.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(v.published).toLocaleDateString()}</p>
                </div>
              </a>
            ))}
          </div>
        )
      ) : (
        articles.length === 0 ? (
          <div className="text-center py-16 glass rounded-3xl">
            <p className="text-muted-foreground mb-4">Articles couldn't load right now.</p>
            <a href={BRAND.socials[3].url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit our blog →</a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((a, i) => (
              <a key={a.link} href={a.link} target="_blank" rel="noopener noreferrer" className="group glass-strong rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-deep transition-all animate-fade-up flex" style={{ animationDelay: `${i * 60}ms` }}>
                {a.thumbnail && (
                  <div className="w-1/3 relative overflow-hidden bg-card shrink-0">
                    <img src={a.thumbnail} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 flex-1">
                  <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">{a.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.description}</p>
                  <div className="text-xs text-primary mt-3 inline-flex items-center gap-1"><ExternalLink className="size-3" /> Read article</div>
                </div>
              </a>
            ))}
          </div>
        )
      )}
    </div>
  );
}
