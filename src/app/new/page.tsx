// The create page ("/new"). A Server Component that just renders the form.
import Link from "next/link";
import NewWorkoutForm from "./NewWorkoutForm";

export default function NewWorkoutPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/" className="text-sm text-slate-500 transition-colors hover:text-slate-800">
        ← Back to log
      </Link>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        Log a workout
      </h1>
      <NewWorkoutForm />
    </main>
  );
}
