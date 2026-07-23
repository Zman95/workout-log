// "use client" — runs in the browser so it can show a loading state and errors.
// It calls the createWorkout SERVER ACTION on submit.
"use client";

import { useActionState } from "react";
import { createWorkout } from "@/app/actions";
import WorkoutFields from "@/app/WorkoutFields";

type FormState = { error?: string };

export default function NewWorkoutForm() {
  // useActionState wires the form to the server action and gives us:
  //  - state: what the action returned last (an error message, if any)
  //  - formAction: what we hand to <form action={...}>
  //  - isPending: true while saving (our loading state)
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    createWorkout,
    {}
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <WorkoutFields />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isPending ? "Saving…" : "Save workout"}
      </button>
    </form>
  );
}
