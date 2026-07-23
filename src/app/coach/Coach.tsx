// "use client" — the chat UI. It keeps the whole conversation in state (that's
// the AI's "memory"), streams each reply in live, and shows loading/empty/error
// states.
"use client";

import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What muscle group have I been skipping?",
  "Suggest a workout for today.",
  "How am I doing this week?",
];

export default function Coach() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;

    setError("");
    const history: Msg[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error("Coach unavailable");

      // Read the streamed text chunk-by-chunk and grow the assistant bubble.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setError("Sorry, the coach is unavailable right now. Please try again.");
      setMessages((prev) =>
        prev.filter(
          (m, i) =>
            !(i === prev.length - 1 && m.role === "assistant" && m.content === "")
        )
      );
    } finally {
      setLoading(false);
    }
  }

  const streaming =
    loading &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].content === "";

  return (
    <div className="mt-6">
      <div className="min-h-[320px] space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
        {/* EMPTY STATE */}
        {messages.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <p className="font-medium text-slate-200">Ask your coach anything</p>
            <p className="mt-1 text-sm">It knows your logged workouts.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span
              className={
                "inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm " +
                (m.role === "user"
                  ? "bg-lime-400 text-slate-950"
                  : "bg-slate-800 text-slate-100")
              }
            >
              {m.content || (streaming ? "Thinking…" : "")}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="mt-3 rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Suggestion chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={loading}
            className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-lime-400 hover:text-lime-300 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your coach…"
          className="flex-1 rounded-full border border-slate-700 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-colors focus:border-lime-400 focus:ring-2 focus:ring-lime-400/30"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {loading ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
