// The DYNAMIC detail page ("/workout/[id]"). One template serves every
// workout. It reads the id from the URL, loads that workout, and 404s if it
// doesn't exist.
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deleteWorkout } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // In Next.js 16 `params` is a Promise, so we await it.
  const { id } = await params;
  const workoutId = Number(id);

  if (!Number.isInteger(workoutId)) notFound();

  // READ ONE.
  const workout = await db.workout.findUnique({ where: { id: workoutId } });
  if (!workout) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <Link href="/" className="text-sm text-slate-400 transition-colors hover:text-slate-200">
        ← Back to log
      </Link>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {workout.exercise}
          </h1>
          <span className="rounded-full bg-lime-400/10 px-3 py-1 text-sm font-medium text-lime-300">
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
            <p className="text-sm font-medium text-slate-300">Notes</p>
            <p className="mt-1 whitespace-pre-wrap text-slate-400">{workout.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Link
          href={`/workout/${workout.id}/edit`}
          className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-lime-300"
        >
          Edit
        </Link>
        <form action={deleteWorkout.bind(null, workout.id)}>
          <button
            type="submit"
            className="rounded-full border border-red-900 px-5 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-950/50"
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
    <div className="rounded-lg bg-slate-800/60 px-3 py-2">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-semibold text-white">{value}</dd>
    </div>
  );
}
