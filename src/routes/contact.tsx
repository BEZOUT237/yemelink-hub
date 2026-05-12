import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { BRAND, SERVICES } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — YEMELINK" },
      { name: "description", content: "Tell us about your project. WhatsApp, email, or send a quote request — we reply within 24 hours." },
      { property: "og:title", content: "Contact YEMELINK" },
      { property: "og:description", content: "Get a free quote for your next digital project." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    timeline: "",
    message: "",
  });

  const setField = <K extends keyof typeof form>(k: K, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fullMessage = [
      form.message,
      form.budget && `\n\n💰 Budget: ${form.budget}`,
      form.timeline && `\n⏱️ Timeline: ${form.timeline}`,
    ].filter(Boolean).join("");
    const { error } = await supabase.from("quotes").insert({
      name: form.name,
      email: form.email,
      service: form.service || null,
      message: fullMessage,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not send — please try WhatsApp instead.");
      return;
    }
    setSent(true);
    toast.success("Thanks — we'll reply within 24h.");
  };

  const BUDGETS = ["< $500", "$500 – $2k", "$2k – $5k", "$5k+", "Not sure yet"];
  const TIMELINES = ["ASAP", "1–2 weeks", "1 month", "2–3 months", "Flexible"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="text-center mb-16 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-6">
          <span className="text-primary">●</span> Let's talk
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-4">
          Start your <span className="text-gradient">project</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Tell us what you're building. Free 30-minute consultation included — no pressure.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-strong rounded-3xl p-6 md:p-10 animate-fade-up">
          {sent ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="size-16 text-primary mx-auto mb-4 animate-scale-in" />
              <h3 className="text-2xl font-bold mb-2">You're in! 🎉</h3>
              <p className="text-muted-foreground">We've received your request and will reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">What should we call you? *</Label>
                  <Input id="name" required placeholder="Your name" value={form.name} onChange={(e) => setField("name", e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email">Where can we reach you? *</Label>
                  <Input id="email" type="email" required placeholder="you@email.com" value={form.email} onChange={(e) => setField("email", e.target.value)} className="mt-1.5" />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Which service interests you?</Label>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => (
                    <button
                      type="button"
                      key={s.slug}
                      onClick={() => setField("service", form.service === s.title ? "" : s.title)}
                      className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all border ${
                        form.service === s.title
                          ? "bg-primary text-primary-foreground border-primary shadow-glow"
                          : "glass border-glass-border hover:border-primary/50"
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Budget range (optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setField("budget", form.budget === b ? "" : b)}
                      className={`px-3.5 py-2 rounded-full text-sm transition-all border ${
                        form.budget === b
                          ? "bg-primary text-primary-foreground border-primary shadow-glow"
                          : "glass border-glass-border hover:border-primary/50"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Timeline (optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {TIMELINES.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setField("timeline", form.timeline === t ? "" : t)}
                      className={`px-3.5 py-2 rounded-full text-sm transition-all border ${
                        form.timeline === t
                          ? "bg-primary text-primary-foreground border-primary shadow-glow"
                          : "glass border-glass-border hover:border-primary/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="message">Tell us about your project *</Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  className="mt-1.5"
                  placeholder="What are you building? Any inspiration, goals, or features in mind? Don't worry — there's no wrong answer."
                />
              </div>

              <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
                <Send className="size-4" /> {loading ? "Sending…" : "Send my request"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">We reply within 24 hours, usually much faster ⚡</p>
            </form>
          )}
        </div>

        <div className="space-y-4 animate-fade-up delay-100">
          <a href={BRAND.whatsappLink} target="_blank" rel="noopener noreferrer" className="block glass-strong rounded-3xl p-6 hover:-translate-y-1 hover:shadow-glow transition-all group">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 mb-3 shadow-glow">
              <MessageCircle className="size-5 text-white" />
            </div>
            <h3 className="font-bold mb-1 group-hover:text-primary">WhatsApp</h3>
            <p className="text-sm text-muted-foreground">{BRAND.whatsapp}</p>
            <p className="text-xs text-primary mt-2">Fastest response →</p>
          </a>
          <a href={`mailto:${BRAND.email}`} className="block glass-strong rounded-3xl p-6 hover:-translate-y-1 hover:shadow-elegant transition-all group">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-primary to-primary-glow mb-3 shadow-glow">
              <Mail className="size-5 text-primary-foreground" />
            </div>
            <h3 className="font-bold mb-1 group-hover:text-primary">Email</h3>
            <p className="text-sm text-muted-foreground break-all">{BRAND.email}</p>
          </a>
          <a href={`tel:${BRAND.whatsapp}`} className="block glass-strong rounded-3xl p-6 hover:-translate-y-1 hover:shadow-elegant transition-all group">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 mb-3 shadow-glow">
              <Phone className="size-5 text-white" />
            </div>
            <h3 className="font-bold mb-1 group-hover:text-primary">Call</h3>
            <p className="text-sm text-muted-foreground">{BRAND.whatsapp}</p>
          </a>
        </div>
      </div>
    </div>
  );
}
