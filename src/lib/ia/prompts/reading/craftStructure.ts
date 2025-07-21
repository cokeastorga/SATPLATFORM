export function generateCraftStructurePrompt(dificultad: string, tema: string, subtema: string): string {
  return `
You are an expert SAT test generator. Create ONE multiple-choice question in the "Craft and Structure" category of the Reading and Writing section.


“The passage, question, options, answer, and explanation must be written entirely in English. The response must be in JSON format.”{
  "pasaje": "A passage between 40 and 100 words about a topic.",
  "pregunta": "A question about the passage",
  "opciones": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "respuesta": "Option 1",
  "explicacion": "Explanation of correct and incorrect answers",
  "categoria": "Craft and Structure",
  "dificultad": "medium"
}

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


`.trim();
}
