// "use client" — the edit form. Pre-fills the fields with the existing workout
// and calls updateWorkout on submit.
"use client";

import { useActionState } from "react";
import { updateWorkout } from "@/app/actions";
import WorkoutFields from "@/app/WorkoutFields";

type FormState = { error?: string };

type WorkoutData = {
  id: number;
  exercise: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight: number | null;
  notes: string | null;
};

export default function EditWorkoutForm({ workout }: { workout: WorkoutData }) {
  // .bind(null, workout.id) locks in which workout to update.
  const action = updateWorkout.bind(null, workout.id);
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    action,
    {}
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.error && (
        <div className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <WorkoutFields defaults={workout} />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-lime-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
