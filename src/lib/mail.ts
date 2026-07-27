import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(apiKey);
}

const FROM = process.env.MAIL_FROM ?? "Portfolio <onboarding@resend.dev>";
const TO   = process.env.MAIL_TO   ?? "imranphero@gmail.com";

export type ContactEmailPayload = {
  name: string;
  email: string;
  description: string;
};

export async function sendContactEmail({
  name,
  email,
  description,
}: ContactEmailPayload) {
  const resend = getResend();

  await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: `Portfolio inquiry from ${name}`,
    text: [`Name: ${name}`, `Email: ${email}`, "", "Message:", description].join("\n"),
    html: `
      <h2>New portfolio message</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(description)}</p>
    `,
  });
}

export type ChatbotEmailPayload = {
  question: string;
  ip?: string;
  userAgent?: string;
  timestamp?: string;
  history?: Array<{ role: string; content: string }>;
};

export async function sendChatbotEmail({
  question,
  ip,
  userAgent,
  timestamp,
  history,
}: ChatbotEmailPayload) {
  const resend = getResend();

  const historyText =
    history
      ?.map((m) => `${m.role === "user" ? "Visitor" : "Bot"}: ${m.content}`)
      .join("\n") ?? "";

  const historyHtml =
    history
      ?.map(
        (m) =>
          `<tr>
            <td style="padding:4px 8px;font-weight:bold;color:${m.role === "user" ? "#0f172a" : "#2dd4bf"};white-space:nowrap;vertical-align:top">
              ${m.role === "user" ? "Visitor" : "Bot"}
            </td>
            <td style="padding:4px 8px;color:#0f172a">${escapeHtml(m.content)}</td>
          </tr>`
      )
      .join("") ?? "";

  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: "Chatbot: unanswered visitor question",
    text: [
      `A visitor asked something your chatbot couldn't answer:`,
      `"${question}"`,
      ``,
      `--- Visitor Info ---`,
      ip        ? `IP Address : ${ip}`        : "",
      userAgent ? `Browser    : ${userAgent}` : "",
      timestamp ? `Time       : ${timestamp}` : "",
      ``,
      `--- Conversation ---`,
      historyText,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <h2 style="color:#0f172a">Unanswered chatbot question</h2>
      <p>A visitor asked something your portfolio assistant couldn't answer:</p>
      <blockquote style="border-left:4px solid #2dd4bf;padding:10px 16px;margin:16px 0;background:#f0fdfc;border-radius:4px;font-style:italic;color:#0f172a">
        "${escapeHtml(question)}"
      </blockquote>

      <h3 style="color:#0f172a;margin-top:24px">Visitor Info</h3>
      <table style="border-collapse:collapse;font-size:14px">
        ${ip        ? `<tr><td style="padding:3px 12px 3px 0;color:#64748b;font-weight:bold">IP Address</td><td style="padding:3px 0;color:#0f172a">${escapeHtml(ip)}</td></tr>` : ""}
        ${userAgent ? `<tr><td style="padding:3px 12px 3px 0;color:#64748b;font-weight:bold">Browser</td><td style="padding:3px 0;color:#0f172a;font-size:12px">${escapeHtml(userAgent)}</td></tr>` : ""}
        ${timestamp ? `<tr><td style="padding:3px 12px 3px 0;color:#64748b;font-weight:bold">Time</td><td style="padding:3px 0;color:#0f172a">${escapeHtml(timestamp)}</td></tr>` : ""}
      </table>

      ${historyHtml ? `
      <h3 style="color:#0f172a;margin-top:24px">Full Conversation</h3>
      <table style="border-collapse:collapse;font-size:14px;width:100%;background:#f8fafc;border-radius:6px;overflow:hidden">
        ${historyHtml}
      </table>` : ""}

      <p style="color:#64748b;font-size:13px;margin-top:24px">Consider adding this information to the chatbot's knowledge base.</p>
    `,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
