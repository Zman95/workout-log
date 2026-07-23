// The shared top navigation bar. It's rendered once in the layout, so it shows
// on every page — giving the app a consistent header and easy navigation.
import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-white"
        >
          🏋️ <span className="text-lime-400">Workout</span> Log
        </Link>
        <div className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/coach"
            className="text-slate-300 transition-colors hover:text-lime-400"
          >
            Coach
          </Link>
          <Link
            href="/new"
            className="rounded-full bg-lime-400 px-4 py-2 font-semibold text-slate-950 transition-colors hover:bg-lime-300"
          >
            + Log
          </Link>
        </div>
      </nav>
    </header>
  );
}
