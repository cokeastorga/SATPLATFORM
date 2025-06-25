export function generateInformationIdeasPrompt(dificultad: string): string {
  return `
You are an expert SAT test generator focused on the "Information and Ideas" category of the Reading and Writing section.

Generate one multiple-choice question that includes:
- A short reading passage (80–120 words).
- A question testing comprehension, inference, or locating supporting evidence.
- Exactly four answer options in array format.
- The correct answer (must match one of the options exactly).
- A clear explanation.

Respond ONLY in valid JSON format, like this:
{
  "pasaje": "A passage that supports inferencing.",
  "pregunta": "What can be inferred about the author's opinion?",
  "opciones": ["They strongly agree.", "They are neutral.", "They are skeptical.", "They are unaware."],
  "respuesta": "They are skeptical.",
  "explicacion": "The author's word choice implies skepticism toward the subject."
}

Rules:
- Use only double quotes.
- Escape all internal quotes properly.
- Difficulty level: ${dificultad}.
- Output ONLY the JSON object — no markdown, no commentary.
`.trim();
}
