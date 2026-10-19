import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, ArrowUpRight } from "lucide-react";

type Project = {
  title: string;
  description: string;
  url: string;
  image: string;
  tags: string[];
};

const PROJECTS: Project[] = [
  { title: "YEMELINK Tech Hub", description: "Our flagship platform: services, portfolio, community, blog and AI assistant.", url: "https://yemelink.vercel.app", image: "/projects/yemelink.jpg", tags: ["React", "Vite", "Three.js", "AI"] },
  { title: "SkillGap", description: "Smart learning platform that helps students learn right, at their own pace.", url: "https://skillgap-bheta.vercel.app", image: "/projects/skillgap.jpg", tags: ["React", "EdTech", "UI/UX"] },
  { title: "Livora Hub", description: "Modern lifestyle & services hub with a clean, conversion-focused interface.", url: "https://livora-hub.vercel.app", image: "/projects/livora.jpg", tags: ["React", "Tailwind", "Web App"] },
  { title: "CS Eng Portfolio — Stéphane YEMELI", description: "Personal portfolio of our founder, computer science engineer.", url: "https://stephane-yemeli.vercel.app", image: "/projects/stephane.jpg", tags: ["Portfolio", "Branding", "React"] },
  { title: "Arkigai Group", description: "Corporate website for Arkigai Group, built for trust and clarity.", url: "https://arkigai-group.com", image: "/projects/arkigai.jpg", tags: ["Corporate", "Web Design", "SEO"] },
  { title: "YEMELINK on YouTube", description: "Tech videos, tutorials and digital culture content from our channel.", url: "https://www.youtube.com/@YEMELINK2000", image: "/projects/youtube.jpg", tags: ["Video", "Content", "Media"] },
];

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — YEMELINK" },
      { name: "description", content: "Real projects we've shipped: YEMELINK Hub, SkillGap, Livora Hub, Arkigai Group and more." },
      { property: "og:title", content: "YEMELINK Portfolio" },
      { property: "og:description", content: "Live screenshots of our shipped products." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((p, i) => (
          <a
            key={p.url}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative glass-strong rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-deep transition-all animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="aspect-[16/10] relative overflow-hidden bg-card">
              <img
                src={p.image}
                alt={`${p.title} interface`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 size-10 rounded-full glass-strong flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ArrowUpRight className="size-5" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t}</span>
                ))}
              </div>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary">
                <ExternalLink className="size-3" /> Visit live site
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
