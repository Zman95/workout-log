// The AI Coach server route. Runs on the server (so the API key stays hidden).
// It (1) loads your real workouts from the database, (2) builds a system prompt
// containing that data + the coach's role, (3) calls Claude and STREAMS the
// answer back to the browser token-by-token.
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";

// Reads ANTHROPIC_API_KEY from the environment automatically.
const anthropic = new Anthropic();

// Turn the workout rows into a plain-text summary the AI can reason over.
function buildSystemPrompt(
  workouts: Awaited<ReturnType<typeof db.workout.findMany>>
): string {
  const role =
    "You are an encouraging, knowledgeable personal training coach built into " +
    "Zubair's workout log app. Give practical, concise advice and motivation.";

  if (workouts.length === 0) {
    return (
      role +
      " Zubair hasn't logged any workouts yet. Encourage him to log his first " +
      "one, and answer general fitness questions."
    );
  }

  const lines = workouts
    .map((w) => {
      const date = w.date.toISOString().slice(0, 10);
      const weight = w.weight ? ` @ ${w.weight} lbs` : "";
      const notes = w.notes ? ` (notes: ${w.notes})` : "";
      return `- ${date}: ${w.exercise} [${w.muscleGroup}] ${w.sets}x${w.reps}${weight}${notes}`;
    })
    .join("\n");

  return (
    role +
    "\n\nHere is Zubair's full workout history (most recent first):\n" +
    lines +
    "\n\nUse this real data. You can say which muscle groups he's trained most " +
    "or least, suggest a workout based on what he's been skipping, and spot " +
    "patterns. Base answers on the data above. Keep replies short and practical."
  );
}

export async function POST(request: Request) {
  try {
    // The browser sends the whole conversation so the AI has memory.
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response("No messages provided.", { status: 400 });
    }

    // Pull the user's real data out of the database.
    const workouts = await db.workout.findMany({ orderBy: { date: "desc" } });
    const system = buildSystemPrompt(workouts);

    // Start a streaming request to Claude (Haiku keeps it cheap).
    const claudeStream = anthropic.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system,
      messages: messages as Anthropic.MessageParam[],
    });

    // Re-package Claude's stream into a plain-text stream for the browser.
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of claudeStream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (err) {
          console.error("coach stream error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("coach route error:", error);
    return new Response("Sorry, the coach is unavailable right now.", {
      status: 500,
    });
  }
}
