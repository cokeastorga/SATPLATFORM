export function generateCraftStructurePrompt(dificultad: string, tema: string, subtema: string): string {
  return `
You are an expert SAT test generator. Create ONE multiple-choice question in the "Craft and Structure" category of the Reading and Writing section.



📌 Requirements:
- "pasaje": A passage between **20 and 120 words ONLY** (strictly enforced). Count your words carefully. Do not go under or over this range.
- "pregunta": One question testing purpose, structure, tone, or word meaning, directly requiring information from the passage.
- "opciones": Four concise, unique answer choices (plain text, no labels).
- "respuesta": The exact text string of one of the options (no labels).
- "explicacion": 2–5 sentences explaining the correct and incorrect answers.
- "categoria": Must be "Craft and Structure".
- Difficulty: Use "${dificultad}" level (match official SAT standards: vocabulary, complexity, distractors, etc).
Use ONLY the assigned topic: ${tema} (subtopic: ${subtema}).

⚠️ Output Rules:
- Output ONLY a valid JSON object.
- The JSON MUST:
  - Start with '{' and end with '}'
  - Use only double quotes (")
  - No markdown, no commentary, no explanations outside JSON
  - Do NOT escape characters unnecessarily; ASCII-safe only; no Unicode special symbols
  - No labels like A/B/C — use full answer text only
  - Fully valid JSON format

✅ Example output:
{
  "pasaje": "Text between 20 and 120 words...",
  "pregunta": "Question?",
  "opciones": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "respuesta": "Option",
  "explicacion": "Explanation here...",
  "categoria": "Craft and Structure"
}
`.trim();
}
