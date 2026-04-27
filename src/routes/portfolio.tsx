import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Project = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  image_url: string | null;
  tech_stack: string[] | null;
  featured: boolean | null;
};

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — YEMELINK" },
      { name: "description", content: "Real projects we've shipped: SkillGap, Networker, Arkigai Group, AI Automation and more." },
      { property: "og:title", content: "YEMELINK Portfolio" },
      { property: "og:description", content: "Live screenshots of our shipped products." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        setProjects((data as Project[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="text-center mb-16 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-6">
          <span className="text-primary">●</span> Selected work
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Recent <span className="text-gradient">projects</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Live products we've designed, built, and shipped. Click any tile to explore the real interface.
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-3xl glass animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <a
              key={p.id}
              href={p.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative glass-strong rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-deep transition-all animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-card">
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute top-4 right-4 size-10 rounded-full glass-strong flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ArrowUpRight className="size-5" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                {p.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{p.description}</p>}
                {p.tech_stack && p.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech_stack.slice(0, 4).map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>
                    ))}
                  </div>
                )}
                {p.url && (
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary">
                    <ExternalLink className="size-3" /> Visit live site
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
