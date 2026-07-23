// "use client" — runs in the browser so it can show a loading state and errors.
// It calls the createWorkout SERVER ACTION on submit.
"use client";

import { useActionState } from "react";
import { createWorkout } from "@/app/actions";
import WorkoutFields from "@/app/WorkoutFields";

type FormState = { error?: string };

export default function NewWorkoutForm() {
  // useActionState gives us: last returned state (error), the formAction to
  // attach to <form>, and isPending (true while saving = our loading state).
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    createWorkout,
    {}
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.error && (
        <div className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      <WorkoutFields />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-lime-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {isPending ? "Saving…" : "Save workout"}
      </button>
    </form>
  );
}
