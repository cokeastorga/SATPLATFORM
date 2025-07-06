export function generateCraftStructurePrompt(dificultad: string): string {
  return `
You are an expert SAT test generator. Create ONE multiple-choice question in the "Craft and Structure" category of the Reading and Writing section.

📌 Requirements:
- "pasaje": A passage of 80–120 words (science, history, or social studies). Use proper spacing. No merged words.
- "pregunta": One question testing purpose, structure, tone, or word meaning.
- "opciones": Four concise, unique answer choices (plain text).
- "respuesta": The exact text matching one of the options.
- "explicacion": 2–5 sentences in plain English explaining the correct choice and the incorrect ones.
- "categoria": Must be "Craft and Structure".
- Difficulty: Use "${dificultad}" level.

⚠️ Output Rules:
- Respond ONLY with a valid JSON object.
- The response MUST:
  - Start with '{'
  - End with '}'
  - Use only double quotes (")
  - No markdown, no commentary
  - Contain NO introductory text, comments, explanations, markdown or code blocks.
  - Be fully valid JSON.
  - "respuesta": Must be the exact text string of one of the four options. Do not use labels like "Option A", use the full answer.

- Use only ASCII-safe characters and double quotes.

✅ Example output format:
{
  "pasaje": "Formal passage text...",
  "pregunta": "What is the author’s main purpose?",
  "opciones": ["A", "B", "C", "D"],
  "respuesta": "A",
  "explicacion": "Explanation here...",
  "categoria": "Craft and Structure"
}
`.trim();
}
