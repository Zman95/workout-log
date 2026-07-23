// "use server" marks every function in this file as a SERVER ACTION — code
// that only ever runs on the server, even though a browser form calls it.
// This is where we safely write to the database.
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// The shape of what a form gets back: an optional error message to display.
// (Not exported — a "use server" file may only export async functions.)
type FormState = { error?: string };

// Shared validator used by both create and update, so the rules live in ONE
// place. Returns either { data } (ready to save) or { error } (show the user).
// Not exported, so it's just a private helper — that's allowed in a "use
// server" file; only the *exported* things must be async server actions.
function parseWorkoutForm(formData: FormData) {
  const exercise = String(formData.get("exercise") ?? "").trim();
  const muscleGroup = String(formData.get("muscleGroup") ?? "").trim();
  const sets = Number(formData.get("sets"));
  const reps = Number(formData.get("reps"));
  const weightRaw = String(formData.get("weight") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!exercise || !muscleGroup) {
    return { error: "Exercise and muscle group are required." as const };
  }
  if (!Number.isFinite(sets) || sets < 1) {
    return { error: "Sets must be a number of at least 1." as const };
  }
  if (!Number.isFinite(reps) || reps < 1) {
    return { error: "Reps must be a number of at least 1." as const };
  }

  return {
    data: {
      exercise,
      muscleGroup,
      sets,
      reps,
      weight: weightRaw ? Number(weightRaw) : null,
      notes: notes || null,
    },
  };
}

// CREATE — insert a new workout, then go back to the list.
export async function createWorkout(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseWorkoutForm(formData);
  if (parsed.error) return { error: parsed.error };

  try {
    await db.workout.create({ data: parsed.data });
  } catch (error) {
    console.error("createWorkout failed:", error);
    return { error: "Something went wrong saving your workout. Please try again." };
  }

  revalidatePath("/");
  redirect("/");
}

// UPDATE — the `id` is "bound" in front by the edit form, so this function
// receives (id, prevState, formData). It overwrites that workout's fields.
export async function updateWorkout(
  id: number,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = parseWorkoutForm(formData);
  if (parsed.error) return { error: parsed.error };

  try {
    await db.workout.update({ where: { id }, data: parsed.data });
  } catch (error) {
    console.error("updateWorkout failed:", error);
    return { error: "Something went wrong updating your workout. Please try again." };
  }

  revalidatePath("/");
  revalidatePath(`/workout/${id}`);
  redirect(`/workout/${id}`);
}

// DELETE — the `id` is bound in front by the delete button's form, so this
// receives (id, formData). It removes the workout, then returns to the list.
export async function deleteWorkout(id: number, _formData: FormData): Promise<void> {
  try {
    await db.workout.delete({ where: { id } });
  } catch (error) {
    console.error("deleteWorkout failed:", error);
  }

  revalidatePath("/");
  redirect("/");
}
