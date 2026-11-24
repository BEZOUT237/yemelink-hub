import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  MarqueeProjects,
  type PortfolioProject,
  type ProjectCategory,
} from "@/components/portfolio/MarqueeProjects";
import { ScrollSkewHeading, SplitReveal } from "@/components/motion/KineticText";

const BUILTIN_PROJECTS: PortfolioProject[] = [
  { title: "YEMELINK Tech Hub", description: "Our flagship platform: services, portfolio, community, blog and AI assistant.", url: "https://yemelink.vercel.app", image: "/projects/yemelink.jpg", tags: ["React", "Vite", "Three.js", "AI"], category: "Web" },
  { title: "SkillGap", description: "Smart learning platform that helps students learn right, at their own pace.", url: "https://skillgap-bheta.vercel.app", image: "/projects/skillgap.jpg", tags: ["React", "EdTech", "UI/UX"], category: "Web" },
  { title: "Livora Hub", description: "Modern lifestyle & services hub with a clean, conversion-focused interface.", url: "https://livora-hub.vercel.app", image: "/projects/livora.jpg", tags: ["React", "Tailwind", "Web App"], category: "Mobile" },
  { title: "CS Eng Portfolio — Stéphane YEMELI", description: "Personal portfolio of our founder, computer science engineer.", url: "https://stephane-yemeli.vercel.app", image: "/projects/stephane.jpg", tags: ["Portfolio", "Branding", "React"], category: "Design" },
  { title: "Arkigai Group", description: "Corporate website for Arkigai Group, built for trust and clarity.", url: "https://arkigai-group.com", image: "/projects/arkigai.jpg", tags: ["Corporate", "Web Design", "SEO"], category: "Design" },
  { title: "YEMELINK on YouTube", description: "Tech videos, tutorials and digital culture content from our channel.", url: "https://www.youtube.com/@YEMELINK2000", image: "/projects/youtube.jpg", tags: ["Video", "Content", "Media"], category: "Marketing" },
];

function inferCategory(tags: string[], category?: string | null): ProjectCategory {
  const haystack = `${category ?? ""} ${tags.join(" ")}`.toLowerCase();
  if (haystack.includes("mobile") || haystack.includes("android") || haystack.includes("app")) return "Mobile";
  if (haystack.includes("design") || haystack.includes("brand") || haystack.includes("ui")) return "Design";
  if (haystack.includes("market") || haystack.includes("video") || haystack.includes("media") || haystack.includes("seo")) return "Marketing";
  return "Web";
}

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
  const [projects, setProjects] = useState<PortfolioProject[]>(BUILTIN_PROJECTS);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("projects")
      .select("title, description, url, image_url, tech_stack")
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (cancelled || !data || data.length === 0) return;
        const seen = new Set(BUILTIN_PROJECTS.map((p) => p.url.replace(/\/$/, "")));
        const extras: PortfolioProject[] = [];
        for (const row of data) {
          if (!row.url || !row.image_url) continue;
          const norm = row.url.replace(/\/$/, "");
          if (seen.has(norm)) continue;
          seen.add(norm);
          const tags = Array.isArray(row.tech_stack) ? row.tech_stack : [];
          extras.push({
            title: row.title,
            description: row.description ?? "",
            url: row.url,
            image: row.image_url,
            tags,
            category: inferCategory(tags, `${row.title} ${row.description ?? ""}`),
          });
        }
        if (extras.length > 0) setProjects([...BUILTIN_PROJECTS, ...extras]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="py-12 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-6">
          <span className="text-primary">●</span> Selected work
        </div>
        <ScrollSkewHeading>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-4">
            <SplitReveal text="Recent" mode="words" immediate />{" "}
            <SplitReveal text="projects" mode="words" immediate delay={0.14} itemClassName="text-gradient" />
          </h1>
        </ScrollSkewHeading>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Live products we've designed, built, and shipped. Click any tile to explore the real interface.
        </p>
      </div>

      <MarqueeProjects projects={projects} />
    </div>
  );
}
