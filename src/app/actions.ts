// "use server" marks every function in this file as a SERVER ACTION — code
// that only ever runs on the server, even though a browser form calls it.
// This is where we safely write to the database.
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// The shape of what the form gets back: an optional error message to display.
// (Not exported — a "use server" file may only export async functions.)
type FormState = { error?: string };

// createWorkout receives the previous state and the submitted form data.
export async function createWorkout(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Pull the values out of the submitted form by their `name` attributes.
  const exercise = String(formData.get("exercise") ?? "").trim();
  const muscleGroup = String(formData.get("muscleGroup") ?? "").trim();
  const sets = Number(formData.get("sets"));
  const reps = Number(formData.get("reps"));
  const weightRaw = String(formData.get("weight") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  // Validate. If something's wrong, return an error the form will show.
  if (!exercise || !muscleGroup) {
    return { error: "Exercise and muscle group are required." };
  }
  if (!Number.isFinite(sets) || sets < 1) {
    return { error: "Sets must be a number of at least 1." };
  }
  if (!Number.isFinite(reps) || reps < 1) {
    return { error: "Reps must be a number of at least 1." };
  }

  try {
    // CREATE: insert a new row into the Workout table.
    await db.workout.create({
      data: {
        exercise,
        muscleGroup,
        sets,
        reps,
        weight: weightRaw ? Number(weightRaw) : null,
        notes: notes || null,
      },
    });
  } catch (error) {
    console.error("createWorkout failed:", error);
    return { error: "Something went wrong saving your workout. Please try again." };
  }

  // Tell Next.js the list page's data changed so it re-fetches, then send the
  // user back to the list where they'll see their new workout.
  revalidatePath("/");
  redirect("/");
}
