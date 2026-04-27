import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, Smartphone, Palette, PenTool, Megaphone, FileText, ArrowRight, Check } from "lucide-react";
import { SERVICES } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import servicesPoster from "@/assets/services-poster.png";

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
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-6">
            <span className="text-primary">●</span> Six pillars of excellence
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Services that <span className="text-gradient">scale</span> your business
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl">
            From idea to launch, we handle every layer of your digital presence with craftsmanship, speed, and measurable results.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="lg">Get a Custom Quote <ArrowRight className="size-4" /></Button>
          </Link>
        </div>
        <div className="relative animate-scale-in">
          <div className="absolute inset-0 bg-primary/30 blur-[100px]" />
          <img src={servicesPoster} alt="YEMELINK services" className="relative rounded-3xl shadow-deep" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {SERVICES.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Globe;
          return (
            <div
              key={s.slug}
              className={`group relative glass-strong rounded-3xl p-8 hover:-translate-y-1 transition-all hover:shadow-elegant animate-fade-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${s.color} mb-5 shadow-glow`}>
                <Icon className="size-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{s.title}</h3>
              <p className="text-sm text-primary/80 mb-3">{s.titleFr}</p>
              <p className="text-muted-foreground mb-5">{s.description}</p>
              <ul className="space-y-2">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
