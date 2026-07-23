// The edit page ("/workout/[id]/edit"). Also dynamic: it loads the workout by
// id (404 if missing) and hands it to the edit form to pre-fill the boxes.
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import EditWorkoutForm from "./EditWorkoutForm";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workoutId = Number(id);
  if (!Number.isInteger(workoutId)) notFound();

  const workout = await db.workout.findUnique({ where: { id: workoutId } });
  if (!workout) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href={`/workout/${workout.id}`}
        className="text-sm text-slate-500 transition-colors hover:text-slate-800"
      >
        ← Back to workout
      </Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        Edit workout
      </h1>
      <EditWorkoutForm workout={workout} />
    </main>
  );
}
