import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Play, Sparkles, Zap, Globe, Smartphone, Palette, PenTool, Megaphone, FileText, MapPin } from "lucide-react";
import { BRAND, SERVICES } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { ConnectWithUs } from "@/components/ConnectWithUs";
import { Globe3D } from "@/components/Globe3D";
import logoImg from "@/assets/yemelink-logo.png";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe, smartphone: Smartphone, palette: Palette,
  "pen-tool": PenTool, megaphone: Megaphone, "file-text": FileText,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YEMELINK — Online Products & Services" },
      { name: "description", content: "Tech hub for entrepreneurs. Web development, mobile apps, design, marketing & AI automation." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pt-8 pb-20 md:pt-16 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-6">
              <Sparkles className="size-3.5 text-primary" />
              <span>Your Digital Partner</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-4">
              <span className="text-gradient animate-gradient bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">YEMELINK</span>
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Online Products<br />& Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              We transform your ideas into powerful digital solutions. From stunning websites to mobile apps, we deliver excellence in every pixel and line of code.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/contact">
                <Button variant="hero" size="lg">
                  <ArrowRight className="size-4" />
                  Request a Quote
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="glass" size="lg">
                  <Play className="size-4" />
                  View Our Work
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
              {[
                { value: BRAND.stats.years, label: "Years" },
                { value: BRAND.stats.projects, label: "Projects" },
                { value: BRAND.stats.clients, label: "Clients" },
              ].map((s, i) => (
                <div key={s.label} className={`animate-fade-up delay-${(i + 1) * 100}`}>
                  <div className="text-3xl md:text-4xl font-bold text-gradient">{s.value}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Logo showcase */}
          <div className="relative animate-scale-in delay-200">
            <div className="absolute inset-0 bg-primary/30 blur-[100px] animate-pulse-glow" />
            <div className="relative glass-strong rounded-3xl p-8 md:p-16 shadow-deep aspect-square flex items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent" />
              <img
                src={logoImg}
                alt="YEMELINK"
                className="relative w-full max-w-sm animate-float drop-shadow-[0_0_60px_rgba(0,188,212,0.5)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-3">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to launch and grow your digital presence.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Zap;
            return (
              <Link
                key={s.slug}
                to="/services"
                className="group glass rounded-2xl p-6 hover:border-primary/40 hover:-translate-y-1 hover:shadow-elegant transition-all animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`size-12 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center mb-4 shadow-lg`}>
                  <Icon className="size-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                <p className="text-sm text-primary mb-2">{s.titleFr}</p>
                <p className="text-sm text-muted-foreground mb-4">{s.short}</p>
                <ul className="space-y-1.5 text-sm">
                  {s.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="size-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Global reach — 3D Globe */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-6">
              <MapPin className="size-3.5 text-primary" />
              <span>Worldwide</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.05]">
              We help clients <span className="text-gradient">all around the world</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Wherever you are — from Yaoundé to New York, Paris to Tokyo — YEMELINK delivers world-class digital products without borders. Time zones don't stop great work.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Cameroon", "Turkey", "France", "USA", "UK", "UAE", "Japan", "Brazil", "Singapore"].map((c) => (
                <span key={c} className="px-3 py-1.5 rounded-full glass text-xs font-medium">{c}</span>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 animate-scale-in">
            <Globe3D />
          </div>
        </div>
      </section>

      <ConnectWithUs />
    </>
  );
}
