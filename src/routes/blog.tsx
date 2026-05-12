import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, ExternalLink, BookOpen, Youtube, Instagram, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/brand";

type Video = { id: string; title: string; thumbnail: string; published: string; link: string };
type Article = { title: string; link: string; pubDate: string; thumbnail: string | null; description: string };

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & Videos — YEMELINK" },
      { name: "description", content: "Latest YouTube videos, blog articles and Instagram posts from YEMELINK — tech, design, marketing, and entrepreneurship." },
      { property: "og:title", content: "YEMELINK Blog & Videos" },
      { property: "og:description", content: "Tutorials, insights, and behind-the-scenes from YEMELINK." },
    ],
  }),
  component: BlogPage,
});

// ---------- Featured curated content ----------

const ytId = (url: string) => {
  const m = url.match(/youtu\.be\/([^?&/]+)/) || url.match(/[?&]v=([^&]+)/);
  return m?.[1] ?? "";
};

const FEATURED_VIDEO_URLS = [
  "https://youtu.be/nRpVOerMd6A",
  "https://youtu.be/OuXQivHfTwE",
  "https://youtu.be/NLeUJa0FmGk",
  "https://youtu.be/5Lo-luw6QLU",
  "https://youtu.be/rQRyWzJrpMU",
];

const FEATURED_VIDEOS = FEATURED_VIDEO_URLS.map((u) => {
  const id = ytId(u);
  return {
    id,
    link: `https://www.youtube.com/watch?v=${id}`,
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
});

const slugToTitle = (url: string) => {
  const slug = url.replace(/\/$/, "").split("/").pop() ?? "";
  return slug.replace(/-/g, " ").replace(/\.html$/, "").replace(/\b\w/g, (c) => c.toUpperCase());
};

const FEATURED_ARTICLES = [
  "https://yemelink.blogspot.com/2024/12/hyperconnectes-mais-deconnectes-le.html",
  "https://yemelink.blogspot.com/2024/10/lia-notre-futur-medecin-ou-un-potentiel.html",
  "https://yemelink.blogspot.com/2024/12/bilan-technologique-de-2024-ce-que-nous.html",
  "https://yemelink.blogspot.com/2025/06/lintelligence-artificielle-nous-rend.html",
  "https://yemelink.blogspot.com/2025/12/lia-nest-plus-un-gadget.html",
  "https://yemelink.blogspot.com/2024/10/la-6g.html",
].map((url) => ({ url, title: slugToTitle(url) }));

const FEATURED_POSTS = [
  "https://www.instagram.com/p/DXg4VebDBC7/",
  "https://www.instagram.com/p/DYAis_wjKlr/",
  "https://www.instagram.com/p/DYPBBXkDVcr/",
  "https://www.instagram.com/p/DTnJqo3jLzL/",
];

// ---------- Page ----------

function BlogPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [tab, setTab] = useState<"featured" | "videos" | "articles" | "posts">("featured");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ytFeed = "https://www.youtube.com/feeds/videos.xml?user=YEMELINK2000";
    const blogFeed = "https://yemelink.blogspot.com/feeds/posts/default?alt=rss";

    const fetchRss = async (url: string) => {
      const proxied = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
      const res = await fetch(proxied);
      if (!res.ok) throw new Error("rss fetch failed");
      return res.json();
    };

    Promise.all([
      fetchRss(ytFeed).catch(() => null),
      fetchRss(blogFeed).catch(() => null),
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-4">
          <Sparkles className="size-3.5 text-primary" /> Insights from YEMELINK
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Blog, Videos & <span className="text-gradient">Posts</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
          Our most-watched videos, top articles, and latest social posts — all in one place.
        </p>
        <div className="inline-flex flex-wrap justify-center glass rounded-full p-1 gap-1">
          {([
            ["featured", Sparkles, "Featured"],
            ["videos", Youtube, "All videos"],
            ["articles", BookOpen, "All articles"],
            ["posts", Instagram, "Posts"],
          ] as const).map(([key, Icon, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === key ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Icon className="inline size-4 mr-1.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "featured" && (
        <div className="space-y-16">
          {/* Featured videos */}
          <section>
            <div className="flex items-end justify-between mb-5">
              <h2 className="text-2xl md:text-3xl font-bold">🔥 Most-watched videos</h2>
              <a href={BRAND.socials[0].url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">YouTube channel →</a>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED_VIDEOS.map((v, i) => (
                <a key={v.id} href={v.link} target="_blank" rel="noopener noreferrer" className="group glass-strong rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-deep transition-all animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="aspect-video relative overflow-hidden bg-card">
                    <img src={v.thumbnail} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-14 rounded-full bg-primary/90 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                        <Play className="size-6 text-primary-foreground fill-current" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Featured articles */}
          <section>
            <div className="flex items-end justify-between mb-5">
              <h2 className="text-2xl md:text-3xl font-bold">📰 Top articles</h2>
              <a href={BRAND.socials[3].url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Visit blog →</a>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED_ARTICLES.map((a, i) => (
                <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer" className="group glass-strong rounded-3xl p-6 hover:-translate-y-1 hover:shadow-deep transition-all animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <BookOpen className="size-8 text-primary mb-3" />
                  <h3 className="font-bold leading-snug line-clamp-3 group-hover:text-primary transition-colors mb-3">{a.title}</h3>
                  <span className="inline-flex items-center gap-1 text-xs text-primary"><ExternalLink className="size-3" /> Read on YEMELINK Blog</span>
                </a>
              ))}
            </div>
          </section>

          {/* Featured posts */}
          <section>
            <div className="flex items-end justify-between mb-5">
              <h2 className="text-2xl md:text-3xl font-bold">📸 Latest posts</h2>
              <a href={BRAND.socials[1].url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Instagram →</a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {FEATURED_POSTS.map((url, i) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="group aspect-square relative glass-strong rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-deep transition-all animate-fade-up bg-gradient-to-br from-fuchsia-500/30 via-purple-500/20 to-orange-400/30 flex items-center justify-center" style={{ animationDelay: `${i * 60}ms` }}>
                  <Instagram className="size-12 text-white/90 group-hover:scale-110 transition-transform" />
                  <div className="absolute bottom-3 left-3 right-3 text-xs text-white/90 font-medium">View post →</div>
                </a>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "videos" && (
        loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-video rounded-2xl glass animate-pulse" />)}</div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16 glass rounded-3xl">
            <p className="text-muted-foreground mb-4">Couldn't load the live feed. See featured videos instead.</p>
            <a href={BRAND.socials[0].url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit YouTube →</a>
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
      )}

      {tab === "articles" && (
        loading ? (
          <div className="grid md:grid-cols-2 gap-6">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 rounded-2xl glass animate-pulse" />)}</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 glass rounded-3xl">
            <p className="text-muted-foreground mb-4">Couldn't load the live blog feed.</p>
            <a href={BRAND.socials[3].url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit blog →</a>
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

      {tab === "posts" && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {FEATURED_POSTS.map((url, i) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="group aspect-square relative glass-strong rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-deep transition-all animate-fade-up bg-gradient-to-br from-fuchsia-500/30 via-purple-500/20 to-orange-400/30 flex items-center justify-center" style={{ animationDelay: `${i * 60}ms` }}>
              <Instagram className="size-14 text-white/90 group-hover:scale-110 transition-transform" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white/90 font-medium text-center">View on Instagram →</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
