import { Link } from "@tanstack/react-router";
import { Mail, Phone, ExternalLink, Youtube, Instagram, Linkedin, BookOpen, Music2 } from "lucide-react";
import { BRAND, SERVICES } from "@/lib/brand";
import { Logo } from "./Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { ScrambleText, ScrollSkewHeading } from "@/components/motion/KineticText";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
  "book-open": BookOpen,
  music: Music2,
};

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* CTA */}
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ScrollSkewHeading>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Not sure what you need?
          </h2>
        </ScrollSkewHeading>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Let's discuss your project and find the perfect solution together. Free consultation included!
        </p>
        <Magnetic>
          <Link
            to="/contact"
            className="liquid-btn inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-elegant hover:shadow-glow transition-all hover:-translate-y-0.5"
          >
            <ScrambleText text="Book Free Consultation →" />
          </Link>
        </Magnetic>
      </div>

      <div className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-14 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              {BRAND.tagline}. Your trusted tech partner for web development, mobile apps, design, and digital marketing.
            </p>
            <div className="mt-5 flex gap-2">
              {BRAND.socials.map((s) => {
                const Icon = ICONS[s.icon] ?? ExternalLink;
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg glass hover:text-primary hover:border-primary/40 transition-colors"
                    aria-label={s.name}
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="link-underline hover:text-primary">Home</Link></li>
              <li><Link to="/services" className="link-underline hover:text-primary">Services</Link></li>
              <li><Link to="/portfolio" className="link-underline hover:text-primary">Portfolio</Link></li>
              <li><Link to="/community" className="link-underline hover:text-primary">Community</Link></li>
              <li><Link to="/blog" className="link-underline hover:text-primary">Blog</Link></li>
              <li><Link to="/contact" className="link-underline hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link to="/services" className="hover:text-primary">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-primary">{BRAND.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary" />
                <a href={BRAND.whatsappLink} className="hover:text-primary">{BRAND.whatsapp}</a>
              </li>
              {BRAND.links.map((l) => (
                <li key={l.url} className="flex items-center gap-2">
                  <ExternalLink className="size-4 text-primary" />
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} YEMELINK. All rights reserved.</p>
            <p>Crafted with passion · Online Products & Services</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
