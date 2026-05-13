// Vercel Serverless Function — Node runtime.
// Proxies chat requests to the Lovable AI Gateway using the server-only LOVABLE_API_KEY.

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

type Msg = { role: "user" | "assistant"; content: string };

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const messages: Msg[] = body?.messages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      res.status(400).json({ error: "Invalid messages" });
      return;
    }

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "LOVABLE_API_KEY not configured" });
      return;
    }

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      res.status(502).json({ error: `AI gateway error: ${err.slice(0, 200)}` });
      return;
    }

    const json: any = await upstream.json();
    const reply = json?.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a reply.";
    res.status(200).json({ reply });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Unknown error" });
  }
}
