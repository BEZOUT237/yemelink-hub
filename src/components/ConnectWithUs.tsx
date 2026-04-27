import { Youtube, Instagram, Linkedin, BookOpen, Music2, ExternalLink } from "lucide-react";
import { BRAND } from "@/lib/brand";

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
      <div className="glass rounded-3xl p-8 md:p-12 text-center bg-mesh">
        <h2 className="text-2xl md:text-4xl font-bold mb-2">Connect With Us</h2>
        <p className="text-muted-foreground mb-8">Find us on all platforms</p>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {BRAND.socials.map((s) => {
            const Icon = ICONS[s.icon] ?? ExternalLink;
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl glass-strong hover:text-primary hover:border-primary/50 hover:-translate-y-1 hover:shadow-elegant transition-all"
                aria-label={s.name}
              >
                <Icon className="size-6" />
              </a>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {BRAND.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-strong text-sm hover:text-primary hover:border-primary/50 transition-all"
            >
              <ExternalLink className="size-4" />
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
