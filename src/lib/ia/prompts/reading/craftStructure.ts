export function generateCraftStructurePrompt(dificultad: string): string {
  return `
You are an expert SAT test generator focused on the "Craft and Structure" category of the Reading and Writing section.

Generate one multiple-choice question that includes:

- A short literary or informational passage (80–120 words).
- One question about vocabulary in context, purpose, tone, or structure.
- Exactly four answer options in an array format.
- The correct answer (must match exactly one of the options).
- A brief but clear explanation.

Respond ONLY in valid JSON format, like this:
{
  "pasaje": "Text passage goes here.",
  "pregunta": "What is the main purpose of the second paragraph?",
  "opciones": ["To introduce a new character.", "To explain a conflict.", "To provide background.", "To describe a setting."],
  "respuesta": "To provide background.",
  "explicacion": "The second paragraph gives historical context relevant to the topic."
}

Rules:
- Use only double quotes.
- Escape all internal quotes properly.
- Use a ${dificultad} level of difficulty.
- Output ONLY the JSON object — no markdown, no commentary.
`.trim();
}
