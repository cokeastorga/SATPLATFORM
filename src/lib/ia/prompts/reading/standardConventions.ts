export function generateStandardConventionsPrompt(dificultad: string): string {
  return `
You are an expert SAT test generator for "Standard English Conventions".

Generate one multiple-choice question that includes:
- A short sentence or two with grammatical issues (if any).
- A question that tests grammar, punctuation, or sentence structure.
- Four answer options in array format.
- The correct answer.
- An explanation.

Respond ONLY in valid JSON format, like this:
{
  "pasaje": "Original sentence(s).",
  "pregunta": "Which version is grammatically correct?",
  "opciones": ["Option A", "Option B", "Option C", "Option D"],
  "respuesta": "Option B",
  "explicacion": "Option B is the only version with proper punctuation and subject-verb agreement."
}

Rules:
- Output only JSON (no markdown, no extra text).
- Use only double quotes and escape correctly.
- Match the ${dificultad} difficulty level.
`.trim();
}
