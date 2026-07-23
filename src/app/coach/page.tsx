// The Coach page ("/coach"). A Server Component wrapper that renders the chat.
import Link from "next/link";
import Coach from "./Coach";

export default function CoachPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <Link href="/" className="text-sm text-slate-400 transition-colors hover:text-slate-200">
        ← Back to log
      </Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
        AI Coach
      </h1>
      <p className="mt-1 text-slate-400">
        Ask about your training — it knows what you&apos;ve logged.
      </p>
      <Coach />
    </main>
  );
}
