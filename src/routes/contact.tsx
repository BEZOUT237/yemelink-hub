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
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("quotes").insert({
      name: form.name, email: form.email, service: form.service || null, message: form.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not send — please try WhatsApp instead.");
      return;
    }
    setSent(true);
    toast.success("Thanks — we'll reply within 24h.");
  };

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
          Tell us what you're building. Free 30-minute consultation included.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-strong rounded-3xl p-8 md:p-10 animate-fade-up">
          {sent ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="size-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Message sent!</h3>
              <p className="text-muted-foreground">We've received your request and will reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="service">Service of interest</Label>
                <select
                  id="service"
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select a service…</option>
                  {SERVICES.map((s) => (
                    <option key={s.slug} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="message">Project details *</Label>
                <Textarea id="message" required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1.5" placeholder="Tell us about your goals, timeline, and budget…" />
              </div>
              <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
                <Send className="size-4" /> {loading ? "Sending…" : "Send request"}
              </Button>
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
