// "use client" — the edit form. Same idea as the new form, but it (1) pre-fills
// the fields with the existing workout and (2) calls updateWorkout instead.
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
  // .bind(null, workout.id) "locks in" the id as the first argument, so the
  // server action knows WHICH workout to update. The form still supplies the
  // rest (prevState, formData).
  const action = updateWorkout.bind(null, workout.id);
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    action,
    {}
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <WorkoutFields defaults={workout} />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
