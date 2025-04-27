import { Redis } from "@upstash/redis";
export const runtime = "edge";

export async function POST(req: Request) {
    const { user, text } = await req.json();
    if (!text) return new Response("Bad Request", { status: 400 });

    await Redis.fromEnv().publish("chat:lobby", { user, text, ts: Date.now() });
    return Response.json({ ok: true });
}
