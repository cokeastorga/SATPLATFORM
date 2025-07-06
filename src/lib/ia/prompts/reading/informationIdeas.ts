export function generateInformationIdeasPrompt(dificultad: string): string {
  return `
You are an expert SAT question generator. Create ONE multiple-choice question in the "Information and Ideas" category of the SAT Reading and Writing section.

📌 Requirements:
- "pasaje": A 80–120 word academic passage in English (science, history, or social studies). The passage must support a question involving main idea, inference, or use of evidence.
- "pregunta": One question targeting a specific skill: identifying main idea, making inferences, or selecting supporting evidence.
- "opciones": Exactly four plausible and distinct answer choices (plain text).
- "respuesta": The correct answer, matching exactly one of the options.
- "explicacion": 2–5 plain English sentences explaining why the correct answer is best and why the others are incorrect, using evidence from the passage.
- "categoria": Must be "Information and Ideas".

⚠️ Output Instructions:
- Respond ONLY with a valid JSON object.
- Do NOT include headings, markdown, comments, code blocks, or extra text.
- The response MUST:
  - Start with \`{\`
  - End with \`}\`
  - Use only double quotes (")
  - No markdown, no commentary
  - Contain no trailing commas
  - "respuesta": Must be the exact text string of one of the four options. Do not use labels like "Option A", use the full answer.


✅ Example output format:
{
  "pasaje": "Academic passage text here...",
  "pregunta": "What is the main idea of the passage?",
  "opciones": ["Option A", "Option B", "Option C", "Option D"],
  "respuesta": "Option B",
  "explicacion": "Explanation here...",
  "categoria": "Information and Ideas"
}

💡 Difficulty: "${dificultad}" (choose from "easy", "medium", or "hard").
`.trim();
}
