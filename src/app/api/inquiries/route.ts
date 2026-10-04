const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  if (request.headers.get("origin") && new URL(request.headers.get("origin")!).host !== (request.headers.get("host") || new URL(request.url).host)) {
    return Response.json({ message: "This request is not permitted." }, { status: 403 });
  }
  if (Number(request.headers.get("content-length") || 0) > MAX_BYTES + 65536) {
    return Response.json({ message: "Attachments must be smaller than 10 MB in total." }, { status: 413 });
  }
  let data: FormData;
  try { data = await request.formData(); } catch {
    return Response.json({ message: "Please check your form entries." }, { status: 400 });
  }
  const entries = [...data.entries()];
  const email = entries.find(([key, value]) => /email|e-mail/i.test(key) && typeof value === "string")?.[1];
  const consent = entries.some(([key, value]) => /consent|dgsvo|dsgvo|datenschutz/i.test(key) && value === "on");
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !consent || entries.length > 500) {
    return Response.json({ message: "Enter a valid email address and accept the privacy policy before submitting." }, { status: 400 });
  }
  const totalBytes = entries.reduce((sum, [, value]) => sum + (typeof value === "string" ? new TextEncoder().encode(value).length : value.size), 0);
  if (totalBytes > MAX_BYTES) return Response.json({ message: "Attachments must be smaller than 10 MB in total." }, { status: 413 });
  const endpoint = process.env.INQUIRY_WEBHOOK_URL;
  if (!endpoint) {
    return Response.json({ message: "Inquiry delivery is not connected yet. Your inquiry has not been sent. You can download your entries below." }, { status: 503 });
  }
  try {
    const headers: Record<string, string> = {};
    if (process.env.INQUIRY_WEBHOOK_TOKEN) headers.Authorization = `Bearer ${process.env.INQUIRY_WEBHOOK_TOKEN}`;
    const response = await fetch(endpoint, { method: "POST", headers, body: data, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error("Delivery failed");
    return Response.json({ message: "Thank you! Your inquiry has been sent successfully." });
  } catch {
    return Response.json({ message: "Your inquiry could not be delivered. Please try again. Your entries have been preserved." }, { status: 502 });
  }
}
