export function generateCraftStructurePrompt(dificultad: string): string {
  return `
You are an expert SAT test generator. Create ONE multiple-choice question in the "Craft and Structure" category of the Reading and Writing section.

📌 Requirements:
- "pasaje": A passage between **80 and 120 words ONLY** (strictly enforced). Use plain text from science, history, or social studies. Count your words carefully. Do not go under or over this range.
- "pregunta": One question testing purpose, structure, tone, or word meaning.
- "opciones": Four concise, unique answer choices (plain text).
- "respuesta": The exact text string of one of the options (no labels).
- "explicacion": 2–5 sentences explaining the correct and incorrect answers.
- "categoria": Must be "Craft and Structure".
- Difficulty: Use "${dificultad}" level.

⚠️ Output Rules:
- Output ONLY a valid JSON object.
- The JSON MUST:
  - Start with '{' and end with '}'
  - Use only double quotes (")
  - No markdown, no commentary
  - No labels like A/B/C — use full answer text
  - Fully valid JSON format
  - ASCII-safe only

✅ Example output:
{
  "pasaje": "Text between 80 and 120 words...",
  "pregunta": "What is the author’s main purpose?",
  "opciones": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "respuesta": "Option 1",
  "explicacion": "Explanation here...",
  "categoria": "Craft and Structure"
}
`.trim();
}
