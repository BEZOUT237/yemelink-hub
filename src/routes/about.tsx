import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Target, Heart, Zap } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import portrait from "@/assets/stephane-portrait.png";
import thinking from "@/assets/stephane-thinking.png";
import { GlassCard } from "@/components/motion/GlassCard";
import { Magnetic } from "@/components/motion/Magnetic";
import {
  AnimatedCounter,
  ScrambleText,
  ScrollReveal,
  ScrollSkewHeading,
  SplitReveal,
} from "@/components/motion/KineticText";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — YEMELINK" },
      { name: "description", content: "Meet Stéphane Yemeli, founder of YEMELINK. Our mission, vision, and the team behind your next digital product." },
      { property: "og:title", content: "About YEMELINK & Stéphane Yemeli" },
      { property: "og:description", content: "The founder, mission & vision behind YEMELINK." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Target, title: "Mission", text: "Make professional digital services accessible to every entrepreneur — without compromise on quality." },
  { icon: Sparkles, title: "Vision", text: "Become Africa's leading tech hub for ambitious creators, brands, and businesses going global." },
  { icon: Heart, title: "Values", text: "Excellence, transparency, speed, and partnership. We treat your project like our own." },
  { icon: Zap, title: "Approach", text: "Lean, iterative, design-led. From discovery to launch in weeks, not months." },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-6">
            <span className="text-primary">●</span> Meet the founder
          </div>
          <ScrollSkewHeading>
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <SplitReveal text="Hi, I'm" mode="words" immediate />{" "}
              <SplitReveal text={BRAND.founder.name} mode="words" immediate delay={0.14} itemClassName="text-gradient" />
            </h1>
          </ScrollSkewHeading>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {BRAND.founder.bio}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            What started as a passion project has grown into a full tech & digital media company serving clients across multiple continents. Every project we touch is an opportunity to push the envelope on craft and impact.
          </p>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <Link to="/contact"><Button variant="hero" size="lg"><ScrambleText text="Work with me" /></Button></Link>
            </Magnetic>
            <Magnetic>
              <a href={BRAND.whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button variant="glass" size="lg">WhatsApp</Button>
              </a>
            </Magnetic>
          </div>
        </div>
        <ScrollReveal clip className="relative">
          <div className="absolute -inset-4 bg-primary/30 blur-[80px]" />
          <div className="relative grid grid-cols-2 gap-4">
            <img src={portrait} alt="Stéphane Yemeli" className="rounded-3xl shadow-deep aspect-[3/4] object-cover transition-transform duration-700 hover:scale-[1.03]" />
            <img src={thinking} alt="Stéphane Yemeli" className="rounded-3xl shadow-deep aspect-[3/4] object-cover mt-12 grayscale hover:grayscale-0 transition-all duration-700 hover:scale-[1.03]" />
          </div>
        </ScrollReveal>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-24">
        {VALUES.map((v, i) => (
          <ScrollReveal key={v.title} delay={i * 0.07}>
            <GlassCard className="h-full rounded-3xl p-6">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-primary to-primary-glow mb-4 shadow-glow">
                <v.icon className="size-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.text}</p>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <GlassCard tilt={false} className="rounded-3xl p-8 md:p-16 text-center bg-mesh">
          <ScrollSkewHeading>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <AnimatedCounter value={BRAND.stats.years} /> years • <AnimatedCounter value={`${BRAND.stats.projects}+`} /> projects
            </h2>
          </ScrollSkewHeading>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Trusted by entrepreneurs, startups, and established brands worldwide.
          </p>
          <Magnetic>
            <Link to="/portfolio"><Button variant="hero" size="lg"><ScrambleText text="See our work" /></Button></Link>
          </Magnetic>
        </GlassCard>
      </ScrollReveal>
    </div>
  );
}
