import { Redis } from "@upstash/redis";
export const runtime = "edge";

export async function GET() {
    const redis = Redis.fromEnv();
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    const sub = redis.subscribe("chat:lobby");
    sub.on("message", (data) => {
        writer.write(`data: ${JSON.stringify(data)}\n\n`);
    });

    return new Response(readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
