"use client";
import { useEffect, useRef, useState } from "react";
interface Msg { user: string; text: string; ts: number }

export default function ChatPage() {
    const [log, setLog] = useState<Msg[]>([]);
    const input = useRef<HTMLInputElement>(null);
    const nick = useRef(`user-${Math.floor(Math.random()*999)}`);

    useEffect(() => {
        const es = new EventSource("/api/stream");
        es.onmessage = ev => setLog(l => [...l, JSON.parse(ev.data)]);
        return () => es.close();
    }, []);

    const send = async () => {
        const text = input.current?.value.trim();
        if (!text) return;
        await fetch("/api/send", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ user:nick.current, text })
        });
        input.current!.value = "";
    };

    return (
        <div className="max-w-lg mx-auto p-6 space-y-4">
            <ul className="h-72 overflow-y-auto border rounded p-2">
                {log.map(({user,text,ts})=> <li key={ts}><b>{user}</b>: {text}</li>)}
            </ul>
            <div className="flex gap-2">
                <input ref={input} className="flex-1 border p-2 rounded" />
                <button onClick={send} className="border px-4 rounded">Send</button>
            </div>
        </div>
    );
}
