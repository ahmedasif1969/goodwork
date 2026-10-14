import { NextRequest, NextResponse } from "next/server";
import { deliverContact, validateContact } from "@/lib/contact.mjs";
export const runtime = "nodejs";
// Best-effort per-instance throttling. Use a shared store for large deployments.
const attempts = new Map<string, { count: number; reset: number }>();
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const expected = process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
    : new URL(
        `${request.nextUrl.protocol}//${request.headers.get("host") || request.nextUrl.host}`,
      ).origin;
  if (!origin || origin !== expected)
    return NextResponse.json(
      { error: "Please submit your enquiry from our website." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json(
      { error: "Please send a valid enquiry." },
      { status: 415 },
    );
  const now = Date.now();
  for (const [key, value] of attempts)
    if (value.reset <= now) attempts.delete(key);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const attempt = attempts.get(ip) || { count: 0, reset: now + 600000 };
  if (attempt.count >= 5)
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a few minutes." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((attempt.reset - now) / 1000)),
        },
      },
    );
  let body;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 20000) {
        await reader.cancel();
        return NextResponse.json(
          { error: "Your enquiry is too long." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return NextResponse.json(
      { error: "Please send a valid enquiry." },
      { status: 400 },
    );
  }
  const result = validateContact(body);
  if (result.error)
    return NextResponse.json({ error: result.error }, { status: 400 });
  if (!result.data)
    return NextResponse.json(
      { error: "Please check your enquiry." },
      { status: 400 },
    );
  if (attempts.size >= 10000 && !attempts.has(ip))
    return NextResponse.json(
      { error: "Please try again shortly." },
      { status: 429 },
    );
  attempt.count += 1;
  attempts.set(ip, attempt);
  const delivery = await deliverContact(result.data, {
    key: process.env.RESEND_API_KEY,
    from: process.env.CONTACT_FROM_EMAIL,
    to: process.env.CONTACT_TO_EMAIL,
  });
  return NextResponse.json(
    delivery.success ? { success: true } : { error: delivery.error },
    { status: delivery.status },
  );
}
