import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const description = String(body.description ?? "").trim();

    if (!name || !email || !description) {
      return NextResponse.json(
        { error: "Name, email, and description are required." },
        { status: 400 }
      );
    }

    if (name.length > 120 || email.length > 254 || description.length > 5000) {
      return NextResponse.json(
        { error: "One or more fields exceed the maximum length." },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await sendContactEmail({ name, email, description });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to send message. Please try again later.",
      },
      { status: 500 }
    );
  }
}
