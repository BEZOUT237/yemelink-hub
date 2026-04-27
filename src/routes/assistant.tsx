import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Bot, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { chatWithAssistant } from "@/server/assistant";
import { toast } from "sonner";

type Msg = { id?: string; role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — YEMELINK" },
      { name: "description", content: "Chat with YEMELINK's AI assistant — get instant help on services, pricing, and tech advice." },
      { property: "og:title", content: "YEMELINK AI Assistant" },
      { property: "og:description", content: "Your 24/7 digital partner — powered by AI." },
    ],
  }),
  component: AssistantPage,
});

const SUGGESTIONS = [
  "What services do you offer?",
  "How much does a website cost?",
  "Can you help me with my mobile app idea?",
  "Tell me about your portfolio",
];

function AssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("chat_messages").select("*").eq("user_id", user.id).order("created_at").limit(50).then(({ data }) => {
      if (data) setMessages(data.map((m: any) => ({ id: m.id, role: m.role, content: m.content })));
    });
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);
    try {
      const result = await chatWithAssistant({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: result.reply }]);
    } catch (e: any) {
      toast.error(e.message ?? "Assistant unavailable");
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12 h-[calc(100vh-100px)] flex flex-col">
      <div className="text-center mb-6 animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium mb-3">
          <Sparkles className="size-3.5 text-primary" /> Powered by Lovable AI
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold">YEMELINK <span className="text-gradient">Assistant</span></h1>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto glass-strong rounded-3xl p-5 mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="size-14 text-primary mx-auto mb-3" />
            <p className="text-muted-foreground mb-6">Ask me anything about YEMELINK or your project.</p>
            <div className="grid sm:grid-cols-2 gap-2 max-w-xl mx-auto">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-left text-sm glass rounded-xl p-3 hover:border-primary/50 hover:-translate-y-0.5 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`size-8 rounded-full shrink-0 flex items-center justify-center ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"}`}>
              {m.role === "user" ? <UserIcon className="size-4" /> : <Bot className="size-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "glass"}`}>
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex gap-3">
            <div className="size-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center"><Bot className="size-4 text-primary-foreground" /></div>
            <div className="glass rounded-2xl px-4 py-3 flex gap-1.5">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              <span className="size-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="size-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
      </div>

      {!user && (
        <div className="glass rounded-2xl p-3 mb-3 text-sm text-center">
          <Link to="/auth" className="text-primary hover:underline font-medium">Sign in</Link> to save your conversations.
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="glass-strong rounded-2xl p-2 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          className="flex-1 bg-transparent px-3 py-2 focus:outline-none text-sm"
        />
        <Button type="submit" variant="hero" size="sm" disabled={streaming || !input.trim()}><Send className="size-4" /></Button>
      </form>
    </div>
  );
}
