export function generateExpressionIdeasPrompt(dificultad: string): string {
  return `
You are an expert SAT test generator for the "Expression of Ideas" category.

Generate one multiple-choice question that includes:
- A short passage (50–100 words) that requires revision.
- A question focused on improving clarity, conciseness, or logical progression.
- Exactly four answer options in an array format.
- The correct answer (must match exactly one of the options).
- A brief but clear explanation.

Respond ONLY in valid JSON format like this:
{
  "pasaje": "Short paragraph needing revision.",
  "pregunta": "Which revision most improves clarity?",
  "opciones": ["Revision A", "Revision B", "Revision C", "Revision D"],
  "respuesta": "Revision A",
  "explicacion": "Option A improves clarity and removes redundancy."
}

Rules:
- Use only double quotes.
- Escape all internal quotes properly.
- Difficulty level: ${dificultad}
- Output ONLY the JSON object — no markdown, no extra text.
`.trim();
}
