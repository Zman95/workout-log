// The list page ("/"). This is a SERVER COMPONENT — it runs on the server, so
// it can talk to the database directly (no API route needed). The `async`
// keyword lets us `await` the database query right inside the component.
import Link from "next/link";
import { db } from "@/lib/db";

export default async function HomePage() {
  // READ: fetch every workout from the database, newest first.
  const workouts = await db.workout.findMany({ orderBy: { date: "desc" } });

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Workout Log
        </h1>
        <Link
          href="/new"
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          + Log workout
        </Link>
      </div>

      {/* EMPTY STATE: shown when there are no workouts yet (rubric #5). */}
      {workouts.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-slate-300 py-16 text-center">
          <p className="text-lg font-medium text-slate-900">No workouts yet</p>
          <p className="mt-1 text-slate-500">Log your first one to get started.</p>
          <Link
            href="/new"
            className="mt-6 inline-block rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            + Log your first workout
          </Link>
        </div>
      ) : (
        // THE LIST: one card per workout. Each card links to its detail page
        // at /workout/[id] — that's the dynamic route we'll build next.
        <ul className="mt-8 space-y-3">
          {workouts.map((w) => (
            <li key={w.id}>
              <Link
                href={`/workout/${w.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{w.exercise}</span>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                    {w.muscleGroup}
                  </span>
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {w.sets} sets × {w.reps} reps
                  {w.weight ? ` @ ${w.weight} lbs` : ""}
                </div>
                <div className="mt-1 text-xs text-slate-400">
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
