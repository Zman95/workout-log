// Shared form fields used by BOTH the "new" and "edit" forms, so the input
// markup lives in one place. It accepts optional `defaults` to pre-fill the
// boxes (the edit form passes the existing workout; the new form passes none).
type Defaults = {
  exercise?: string;
  muscleGroup?: string;
  sets?: number;
  reps?: number;
  weight?: number | null;
  notes?: string | null;
};

const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Cardio",
];

export default function WorkoutFields({ defaults }: { defaults?: Defaults }) {
  return (
    <>
      <Field label="Exercise">
        <input
          name="exercise"
          required
          defaultValue={defaults?.exercise ?? ""}
          placeholder="e.g. Bench Press"
          className={inputClass}
        />
      </Field>

      <Field label="Muscle group">
        <select
          name="muscleGroup"
          required
          defaultValue={defaults?.muscleGroup ?? ""}
          className={inputClass}
        >
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
            defaultValue={defaults?.sets ?? ""}
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
            defaultValue={defaults?.reps ?? ""}
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
          defaultValue={defaults?.weight ?? ""}
          placeholder="135"
          className={inputClass}
        />
      </Field>

      <Field label="Notes — optional">
        <textarea
          name="notes"
          rows={3}
          defaultValue={defaults?.notes ?? ""}
          placeholder="How it felt, form cues, etc."
          className={inputClass}
        />
      </Field>
    </>
  );
}

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
