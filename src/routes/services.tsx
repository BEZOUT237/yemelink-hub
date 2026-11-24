import { lazy, Suspense, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, Smartphone, Palette, PenTool, Megaphone, FileText, ArrowRight, Check } from "lucide-react";
import { SERVICES } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import servicesPoster from "@/assets/services-poster.png";
import { GlassCard } from "@/components/motion/GlassCard";
import { Magnetic } from "@/components/motion/Magnetic";
import { ScrambleText, ScrollReveal, ScrollSkewHeading, SplitReveal } from "@/components/motion/KineticText";

const Ecosystem3D = lazy(() => import("@/components/three/Ecosystem3D"));

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe, smartphone: Smartphone, palette: Palette,
  "pen-tool": PenTool, megaphone: Megaphone, "file-text": FileText,
};

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — YEMELINK" },
      { name: "description", content: "Web development, mobile apps, design, content, marketing & copywriting. Production-grade digital services." },
      { property: "og:title", content: "YEMELINK Services" },
      { property: "og:description", content: "Six pillars of digital excellence: web, mobile, design, content, marketing, copy." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [activePillar, setActivePillar] = useState<number | null>(null);

  const slugToPillar = (slug: string): number | null => {
    if (slug === "web-development") return 0;
    if (slug === "mobile-apps") return 1;
    if (slug === "graphic-design" || slug === "content-creation") return 2;
    if (slug === "digital-marketing" || slug === "copywriting") return 3;
    return null;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-6">
            <span className="text-primary">●</span> Six pillars of excellence
          </div>
          <ScrollSkewHeading>
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <SplitReveal text="Services that" mode="words" immediate />{" "}
              <SplitReveal text="scale" mode="words" immediate delay={0.14} itemClassName="text-gradient" />{" "}
              <SplitReveal text="your business" mode="words" immediate delay={0.22} />
            </h1>
          </ScrollSkewHeading>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            From idea to launch, we handle every layer of your digital presence with craftsmanship, speed, and measurable results.
          </p>
          <Magnetic>
            <Link to="/contact">
              <Button variant="hero" size="lg">
                <ScrambleText text="Get a Custom Quote" /> <ArrowRight className="size-4" />
              </Button>
            </Link>
          </Magnetic>
        </div>
        <ScrollReveal clip className="relative">
          <div className="absolute inset-0 bg-primary/30 blur-[100px]" />
          <img src={servicesPoster} alt="YEMELINK services" className="relative rounded-3xl shadow-deep transition-transform duration-700 hover:scale-[1.02]" />
        </ScrollReveal>
      </div>

      <Suspense fallback={null}>
        <Ecosystem3D activeIndex={activePillar} onHover={setActivePillar} />
      </Suspense>

      <div className="grid md:grid-cols-2 gap-6">
        {SERVICES.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Globe;
          const highlighted = activePillar !== null && slugToPillar(s.slug) === activePillar;
          return (
            <ScrollReveal key={s.slug} delay={i * 0.06}>
              <GlassCard
                highlighted={highlighted}
                onMouseEnter={() => setActivePillar(slugToPillar(s.slug))}
                onMouseLeave={() => setActivePillar(null)}
                className="group h-full rounded-3xl p-8"
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${s.color} mb-5 shadow-glow transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="size-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-sm text-primary/80 mb-3">{s.titleFr}</p>
                <p className="text-muted-foreground mb-5">{s.description}</p>
                <ul className="space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
