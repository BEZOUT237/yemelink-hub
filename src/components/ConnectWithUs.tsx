import { Youtube, Instagram, Linkedin, BookOpen, Music2, ExternalLink } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { GlassCard } from "@/components/motion/GlassCard";
import { Magnetic } from "@/components/motion/Magnetic";
import { ScrollReveal, ScrollSkewHeading } from "@/components/motion/KineticText";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
  "book-open": BookOpen,
  music: Music2,
};

export function ConnectWithUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <ScrollReveal>
        <GlassCard tilt={false} className="rounded-3xl p-8 md:p-12 text-center bg-mesh">
          <ScrollSkewHeading>
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Connect With Us</h2>
          </ScrollSkewHeading>
          <p className="text-muted-foreground mb-8">Find us on all platforms</p>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {BRAND.socials.map((s) => {
              const Icon = ICONS[s.icon] ?? ExternalLink;
              return (
                <Magnetic key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-4 rounded-2xl glass-strong hover:text-primary hover:border-primary/50 hover:-translate-y-1 hover:shadow-elegant transition-all"
                    aria-label={s.name}
                  >
                    <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                </Magnetic>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {BRAND.links.map((l) => (
              <Magnetic key={l.url}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-strong text-sm hover:text-primary hover:border-primary/50 transition-all"
                >
                  <ExternalLink className="size-4" />
                  {l.label}
                </a>
              </Magnetic>
            ))}
          </div>
        </GlassCard>
      </ScrollReveal>
    </section>
  );
}
