// "use client" — this form runs in the browser so it can track a loading state
// and show errors. It calls the createWorkout SERVER ACTION on submit.
"use client";

import { useActionState } from "react";
import { createWorkout } from "@/app/actions";

type FormState = { error?: string };
const initialState: FormState = {};

const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Cardio",
];

export default function NewWorkoutForm() {
  // useActionState wires the form to the server action. It gives us:
  //  - state: whatever the action returned last (our error message, if any)
  //  - formAction: what we hand to the <form action={...}>
  //  - isPending: true while the action is running (our loading state)
  const [state, formAction, isPending] = useActionState(
    createWorkout,
    initialState
  );

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {/* ERROR STATE (rubric #5): only shows if the action returned an error */}
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <Field label="Exercise">
        <input
          name="exercise"
          required
          placeholder="e.g. Bench Press"
          className={inputClass}
        />
      </Field>

      <Field label="Muscle group">
        <select name="muscleGroup" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select a muscle group…
          </option>
          {MUSCLE_GROUPS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Sets">
          <input
            name="sets"
            type="number"
            min={1}
            required
            placeholder="3"
            className={inputClass}
          />
        </Field>
        <Field label="Reps">
          <input
            name="reps"
            type="number"
            min={1}
            required
            placeholder="10"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Weight (lbs) — optional">
        <input
          name="weight"
          type="number"
          min={0}
          step="0.5"
          placeholder="135"
          className={inputClass}
        />
      </Field>

      <Field label="Notes — optional">
        <textarea
          name="notes"
          rows={3}
          placeholder="How it felt, form cues, etc."
          className={inputClass}
        />
      </Field>

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

// Small helper so every field has a consistent label + spacing.
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";
