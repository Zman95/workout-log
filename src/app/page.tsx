// The list page ("/"). A SERVER COMPONENT — it runs on the server, so it can
// query the database directly (no API route needed).
import Link from "next/link";
import { db } from "@/lib/db";

// Render on every request (never cached at build) so newly added workouts
// always show up immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // READ: fetch every workout from the database, newest first.
  const workouts = await db.workout.findMany({ orderBy: { date: "desc" } });

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-white">
        Your workouts
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        {workouts.length} logged {workouts.length === 1 ? "entry" : "entries"}
      </p>

      {/* EMPTY STATE (rubric #5) */}
      {workouts.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-700 py-16 text-center">
          <p className="text-lg font-medium text-white">No workouts yet</p>
          <p className="mt-1 text-slate-400">Log your first one to get started.</p>
          <Link
            href="/new"
            className="mt-6 inline-block rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-lime-300"
          >
            + Log your first workout
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {workouts.map((w) => (
            <li key={w.id}>
              <Link
                href={`/workout/${w.id}`}
                className="block rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-lime-400/50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{w.exercise}</span>
                  <span className="rounded-full bg-lime-400/10 px-2.5 py-0.5 text-xs font-medium text-lime-300">
                    {w.muscleGroup}
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-300">
                  {w.sets} sets × {w.reps} reps
                  {w.weight ? ` @ ${w.weight} lbs` : ""}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {w.date.toLocaleDateString()}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
