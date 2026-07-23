// The DYNAMIC detail page ("/workout/[id]"). One template serves every
// workout — /workout/1, /workout/2, etc. It reads the id from the URL, loads
// that workout from the database, and shows a 404 page if it doesn't exist.
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deleteWorkout } from "@/app/actions";

// In Next.js 16, `params` arrives as a Promise, so we await it.
export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workoutId = Number(id);

  // If the URL id isn't a whole number, treat it as not found.
  if (!Number.isInteger(workoutId)) notFound();

  // READ ONE: fetch the single workout by its id.
  const workout = await db.workout.findUnique({ where: { id: workoutId } });

  // No matching row → render the 404 page (rubric #3).
  if (!workout) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/" className="text-sm text-slate-500 transition-colors hover:text-slate-800">
        ← Back to log
      </Link>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {workout.exercise}
          </h1>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            {workout.muscleGroup}
          </span>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <Stat label="Sets" value={String(workout.sets)} />
          <Stat label="Reps" value={String(workout.reps)} />
          <Stat label="Weight" value={workout.weight ? `${workout.weight} lbs` : "—"} />
          <Stat label="Date" value={workout.date.toLocaleDateString()} />
        </dl>

        {workout.notes && (
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-700">Notes</p>
            <p className="mt-1 whitespace-pre-wrap text-slate-600">{workout.notes}</p>
          </div>
        )}
      </div>

      {/* Actions: Edit links to the edit page; Delete submits a tiny form that
          calls the deleteWorkout server action with this workout's id bound in. */}
      <div className="mt-6 flex items-center gap-3">
        <Link
          href={`/workout/${workout.id}/edit`}
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Edit
        </Link>
        <form action={deleteWorkout.bind(null, workout.id)}>
          <button
            type="submit"
            className="rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            Delete
          </button>
        </form>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
