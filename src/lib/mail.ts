import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local"
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

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
  const to = process.env.MAIL_TO ?? process.env.SMTP_USER;
  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER;

  if (!to || !from) {
    throw new Error("MAIL_TO or SMTP_USER must be set");
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Portfolio Contact" <${from}>`,
    to,
    replyTo: email,
    subject: `Portfolio inquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      description,
    ].join("\n"),
    html: `
      <h2>New portfolio message</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(description)}</p>
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
