import Groq from "groq-sdk";
import { sendChatbotEmail } from "@/lib/mail";

const SYSTEM = `You are the portfolio assistant for Imran Hasan, a Full Stack Developer. Answer visitor questions about Imran's work, skills, projects, and availability. Be friendly, concise (2-4 sentences unless more detail is asked for), and professional.

=== ABOUT IMRAN ===
Name: Imran Hasan
Role: Full Stack Developer
Experience: 3+ years, 5+ projects shipped
Status: Open to work — available for remote full-time roles and freelance
Email: imranphero@gmail.com
WhatsApp: +8801647153126
LinkedIn: https://www.linkedin.com/in/imran-hasan-399170171/
GitHub: https://github.com/imran007-Programming

=== PROJECTS ===
1. TourGuide (2025) — Full Stack Developer
   Tech: Next.js, React, Tailwind CSS, Node.js, Express, Prisma, PostgreSQL, Vercel
   Live: https://tourguide-five.vercel.app/
   Features: Destination search, VIP packages, guide onboarding, booking dashboard, testimonials

2. Quran Mazid (2025) — Frontend Developer
   Tech: React, TypeScript, Vite, Audio API
   Live: https://quranmazid-eta.vercel.app/
   Features: Multi-reciter audio, surah/juz/page navigation, Arabic font customisation, bookmarks

3. Rise at Seven (2025) — Frontend Developer
   Tech: Next.js, React, Framer Motion, Tailwind CSS
   Live: https://rise-at-seven-olive.vercel.app/
   Features: Animated hero sections, client showcase, blog listings, office locations

4. eMart (2024) — Frontend Developer
   Tech: React, JavaScript, CSS, Vercel
   Live: https://emart-frontend-main.vercel.app/
   Features: Product browsing, cart, product detail pages, checkout flow

5. Parcel Delivery App (2025) — Full Stack Developer
   Tech: React, TypeScript, Vite, Tailwind CSS, Node.js, Express, MongoDB, Mongoose
   Live: https://percel-delievey-app.vercel.app/
   Features: Real-time shipment tracking, delivery status, Express REST API, MongoDB backend

=== SKILLS ===
Frontend: React, Next.js, TypeScript, JavaScript, Tailwind CSS, Framer Motion, Vite, HTML/CSS
Backend: Node.js, Express.js, REST APIs, Prisma ORM
Databases: PostgreSQL, MongoDB, Mongoose
Tools: Git, GitHub, Vercel, Figma

=== RULES ===
- Never make up information not listed above.
- When asked about hiring or contacting, share the email and WhatsApp.
- Keep answers short unless more detail is requested.
- Use plain text only — no markdown, no bullet symbols, just clean sentences.`;

const CLASSIFY_SYSTEM = `You are a strict classifier. A user asked a question to a portfolio chatbot.
The chatbot only knows: Imran Hasan's 5 projects, his tech skills, contact details (email/WhatsApp/LinkedIn/GitHub), and that he is open to work.
Reply with exactly one word — YES if the question can be answered from that info, NO if it cannot.
Do not write anything else.`;

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY is not set");
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const { messages } = (await req.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
    };

    const lastQuestion =
      [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    const groq    = new Groq({ apiKey });
    const encoder = new TextEncoder();

    // ── Step 1: Classify (fast, non-streaming, max 3 tokens) ──────
    const classify = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 3,
      temperature: 0,
      messages: [
        { role: "system", content: CLASSIFY_SYSTEM },
        { role: "user",   content: lastQuestion },
      ],
      stream: false,
    });

    const verdict = classify.choices[0]?.message?.content?.trim().toUpperCase() ?? "";
    const canAnswer = verdict.startsWith("YES");

    // ── Step 2: Await email before streaming (ensures Vercel doesn't cut it off) ──
    if (!canAnswer) {
      const ip        = req.headers.get("x-forwarded-for")?.split(",")[0].trim()
                      ?? req.headers.get("x-real-ip")
                      ?? "unknown";
      const userAgent = req.headers.get("user-agent") ?? undefined;
      const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka", hour12: true });

      await Promise.race([
        sendChatbotEmail({ question: lastQuestion, ip, userAgent, timestamp, history: messages }),
        new Promise<void>((resolve) => setTimeout(resolve, 8000)),
      ]).catch((e) => console.error("Chatbot email failed:", e));
    }

    // ── Step 3: Stream the answer ─────────────────────────────────
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const stream = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            max_tokens: 512,
            messages: [{ role: "system", content: SYSTEM }, ...messages],
            stream: true,
          });

          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error("Groq stream error:", msg);
          controller.enqueue(encoder.encode(`[Error: ${msg}]`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
