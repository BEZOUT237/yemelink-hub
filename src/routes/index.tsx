import { lazy, Suspense, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Play, Sparkles, Zap, Globe, Smartphone, Palette, PenTool, Megaphone, FileText, MapPin } from "lucide-react";
import { BRAND, SERVICES } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { ConnectWithUs } from "@/components/ConnectWithUs";
import { Globe3D } from "@/components/Globe3D";
import { HeroLogoFallback } from "@/components/three/HeroLinkScene";
import { ECOSYSTEM_PILLARS } from "@/components/three/Ecosystem3D";
import { GlassCard } from "@/components/motion/GlassCard";
import { Magnetic } from "@/components/motion/Magnetic";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { ScrollytellingSection } from "@/components/motion/ScrollytellingSection";
import {
  AnimatedCounter,
  ScrambleText,
  ScrollReveal,
  ScrollSkewHeading,
  SplitReveal,
} from "@/components/motion/KineticText";

const HeroLinkScene = lazy(() => import("@/components/three/HeroLinkScene"));
const Ecosystem3D = lazy(() => import("@/components/three/Ecosystem3D"));

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
  const [activePillar, setActivePillar] = useState<number | null>(null);

  const slugToPillarIndex = (slug: string): number | null => {
    if (slug === "web-development") return 0;
    if (slug === "mobile-apps") return 1;
    if (slug === "graphic-design" || slug === "content-creation") return 2;
    if (slug === "digital-marketing" || slug === "copywriting") return 3;
    return null;
  };

  const isServiceHighlighted = (slug: string) => {
    if (activePillar === null) return false;
    return slugToPillarIndex(slug) === activePillar;
  };

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
              <SplitReveal
                text="YEMELINK"
                mode="chars"
                immediate
                itemClassName="text-gradient animate-gradient bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent"
              />
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              <SplitReveal text="Online Products" mode="words" immediate delay={0.18} />
              <br />
              <SplitReveal text="& Services" mode="words" immediate delay={0.32} />
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              We transform your ideas into powerful digital solutions. From stunning websites to mobile apps, we deliver excellence in every pixel and line of code.
            </p>

            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <Link to="/contact">
                  <Button variant="hero" size="lg">
                    <ArrowRight className="size-4" />
                    <ScrambleText text="Request a Quote" />
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to="/portfolio">
                  <Button variant="glass" size="lg">
                    <Play className="size-4" />
                    <ScrambleText text="View Our Work" />
                  </Button>
                </Link>
              </Magnetic>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
              {[
                { value: BRAND.stats.years, label: "Years" },
                { value: BRAND.stats.projects, label: "Projects" },
                { value: BRAND.stats.clients, label: "Clients" },
              ].map((s, i) => (
                <div key={s.label} className={`animate-fade-up delay-${(i + 1) * 100}`}>
                  <div className="text-3xl md:text-4xl font-bold text-gradient">
                    <AnimatedCounter value={s.value} immediate />
                  </div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive 3D YEMELINK Link Sculpture */}
          <div className="relative animate-scale-in delay-200">
            <div className="absolute inset-0 bg-primary/30 blur-[100px] animate-pulse-glow" />
            <Suspense
              fallback={
                <div className="relative liquid-glass-surface rounded-3xl shadow-deep aspect-square flex items-center justify-center">
                  <HeroLogoFallback />
                </div>
              }
            >
              <HeroLinkScene />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Velocity-reactive kinetic keyword marquee */}
      <VelocityMarquee />

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-12">
          <ScrollSkewHeading>
            <h2 className="text-3xl md:text-5xl font-bold mb-3">
              <SplitReveal text="Our Services" mode="words" />
            </h2>
          </ScrollSkewHeading>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to launch and grow your digital presence.
          </p>
        </div>

        {/* Interactive 3D 4-Pole Connected Ecosystem */}
        <Suspense
          fallback={
            <div className="liquid-glass-surface rounded-3xl h-[290px] mb-10 flex items-center justify-center gap-3">
              {ECOSYSTEM_PILLARS.map((p) => (
                <span key={p.id} className="px-4 py-2 rounded-full glass text-xs text-primary">{p.label}</span>
              ))}
            </div>
          }
        >
          <Ecosystem3D activeIndex={activePillar} onHover={setActivePillar} />
        </Suspense>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Zap;
            const highlighted = isServiceHighlighted(s.slug);
            return (
              <ScrollReveal key={s.slug} delay={i * 0.06}>
                <Link
                  to="/services"
                  onMouseEnter={() => setActivePillar(slugToPillarIndex(s.slug))}
                  onMouseLeave={() => setActivePillar(null)}
                  className="block h-full"
                >
                  <GlassCard highlighted={highlighted} className="group h-full p-6">
                    <div className={`size-12 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                      <Icon className="size-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{s.title}</h3>
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
                      Learn more <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </GlassCard>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Pinned 3D Scrollytelling Band */}
      <ScrollytellingSection />

      {/* Global reach — 3D Globe */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-6">
              <MapPin className="size-3.5 text-primary" />
              <span>Worldwide</span>
            </div>
            <ScrollSkewHeading>
              <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.05]">
                We help clients <span className="text-gradient">all around the world</span>
              </h2>
            </ScrollSkewHeading>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Wherever you are — from Yaoundé to New York, Paris to Tokyo — YEMELINK delivers world-class digital products without borders. Time zones don't stop great work.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Cameroon", "Turkey", "France", "USA", "UK", "UAE", "Japan", "Brazil", "Singapore"].map((c) => (
                <span key={c} className="px-3 py-1.5 rounded-full glass text-xs font-medium hover:border-primary/40 hover:text-primary transition-colors">{c}</span>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal clip className="order-1 lg:order-2" data-cursor="drag">
            <Globe3D />
          </ScrollReveal>
        </div>
      </section>

      <ConnectWithUs />
    </>
  );
}
