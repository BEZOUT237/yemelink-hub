import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SYSTEM_PROMPT = `You are YEMELINK's helpful AI assistant.

YEMELINK is a tech & digital media company founded by Stéphane Yemeli, offering:
- Full-Stack Web Development (websites, platforms, SaaS)
- Android Mobile Applications
- Graphic Design (logos, UI/UX, brand identity)
- Content Creation (texts, visuals, videos)
- Digital Marketing & Social Media
- Persuasive Copywriting

Stats: 2+ years experience, 16+ projects shipped, 16+ happy clients, based in Turkey/Cameroon serving worldwide.

Contact:
- WhatsApp: +90 505 740 4314
- Email: yemelink@gmail.com
- Website portfolio includes SkillGap, Networker, Arkigai Group, AI Automation Agency.

Be friendly, concise, and helpful. If asked about pricing, suggest the visitor request a custom quote via /contact or WhatsApp. Encourage exploring the portfolio at /portfolio. Reply in the user's language (English or French).`;

type ChatInput = { messages: Array<{ role: "user" | "assistant"; content: string }> };

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: ChatInput) => {
    if (!input?.messages || !Array.isArray(input.messages)) throw new Error("Invalid input");
    if (input.messages.length > 50) throw new Error("Too many messages");
    return input;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...data.messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`AI gateway error: ${err.slice(0, 200)}`);
    }
    const json: any = await res.json();
    const reply = json?.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a reply.";

    // Persist if authenticated (best-effort, ignored on failure)
    try {
      const { getWebRequest } = await import("@tanstack/react-start/server");
      const req = getWebRequest();
      const authHeader = req?.headers.get("authorization");
      if (authHeader) {
        const { createClient } = await import("@supabase/supabase-js");
        const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data: u } = await sb.auth.getUser();
        if (u?.user) {
          const last = data.messages[data.messages.length - 1];
          await sb.from("chat_messages").insert([
            { user_id: u.user.id, role: "user", content: last.content },
            { user_id: u.user.id, role: "assistant", content: reply },
          ]);
        }
      }
    } catch {}

    return { reply };
  });

// re-export to satisfy unused import lint when middleware not used
export { requireSupabaseAuth };
