import { Resend } from "resend";

const FROM = process.env.MAIL_FROM ?? "Portfolio <onboarding@resend.dev>";
const TO = process.env.MAIL_TO ?? "imranphero@gmail.com";

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const body = (await req.json()) as { referrer?: string; page?: string };

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    const userAgent = req.headers.get("user-agent") ?? "unknown";
    const timestamp = new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Dhaka",
      hour12: true,
    });

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: FROM,
      to: TO,
      subject: "🟢 New visitor on your portfolio!",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:500px">
          <h2 style="color:#0f172a;margin-bottom:4px">👋 Someone just visited your portfolio</h2>
          <p style="color:#64748b;margin-top:0">Here are the details:</p>
          
          <table style="border-collapse:collapse;font-size:14px;width:100%;margin-top:16px">
            <tr>
              <td style="padding:8px 12px;color:#64748b;font-weight:600;border-bottom:1px solid #f1f5f9">Time</td>
              <td style="padding:8px 12px;color:#0f172a;border-bottom:1px solid #f1f5f9">${timestamp}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;color:#64748b;font-weight:600;border-bottom:1px solid #f1f5f9">IP Address</td>
              <td style="padding:8px 12px;color:#0f172a;border-bottom:1px solid #f1f5f9">${escapeHtml(ip)}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;color:#64748b;font-weight:600;border-bottom:1px solid #f1f5f9">Page</td>
              <td style="padding:8px 12px;color:#0f172a;border-bottom:1px solid #f1f5f9">${escapeHtml(body.page ?? "/")}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;color:#64748b;font-weight:600;border-bottom:1px solid #f1f5f9">Referrer</td>
              <td style="padding:8px 12px;color:#0f172a;border-bottom:1px solid #f1f5f9">${escapeHtml(body.referrer || "Direct")}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;color:#64748b;font-weight:600">Browser</td>
              <td style="padding:8px 12px;color:#0f172a;font-size:12px">${escapeHtml(userAgent)}</td>
            </tr>
          </table>

          <p style="color:#94a3b8;font-size:12px;margin-top:20px">This alert is sent once per visitor session.</p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[visit alert]", err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
