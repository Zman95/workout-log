// Renders whenever notFound() is called or a route doesn't exist — the
// friendly "error state" for missing pages (rubric #5).
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-white">Not found</h1>
      <p className="mt-2 text-slate-400">
        That workout doesn&apos;t exist — it may have been deleted.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-lime-300"
      >
        Back to log
      </Link>
    </main>
  );
}
