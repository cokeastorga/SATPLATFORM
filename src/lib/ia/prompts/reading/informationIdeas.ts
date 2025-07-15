export function generateInformationIdeasPrompt(
  dificultad: string,
  tema: string,
  subtema: string
): string {
  return `
You are an expert SAT question generator. Create ONE multiple-choice question in the "Information and Ideas" category of the SAT Reading and Writing section.

Use ONLY the assigned topic: ${tema} (subtopic: ${subtema}). 

📌 Requirements:
- "pasaje": An academic passage of **20–120 words ONLY** (strictly enforced, count carefully) in English. The passage must be related to science, history, or social studies, and support a question involving **main idea**, **inference**, or **use of textual evidence**.
- The passage must allow for a question that requires information from the passage (not generic).
- "pregunta": One clear question assessing either main idea, inference, or supporting evidence—**must require the passage**.
- "opciones": Exactly four distinct, plausible answers in plain text (no labels, no repeats).
- "respuesta": Must be the **exact text** of the correct answer from "opciones" (no labels).
- "explicacion": 2–5 sentences explaining why the correct choice is best and the others are not, citing evidence from the passage.
- "categoria": Must be "Information and Ideas".

⚠️ Output Instructions:
- Respond ONLY with a valid JSON object.
- The JSON MUST:
  - Start with '{' and end with '}'
  - Use only double quotes (")
  - Contain NO headings, markdown, code blocks, or commentary outside the JSON
  - Be ASCII-only (do NOT use Unicode special characters)
  - "respuesta" must match exactly one of the "opciones" (text only)

✅ Use this exact structure:
{
  "pasaje": "Academic passage text of 20–120 words...",
  "pregunta": "Question?",
  "opciones": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "respuesta": "Option",
  "explicacion": "Explanation of correct and incorrect options.",
  "categoria": "Information and Ideas"
}

💡 Difficulty: Use "${dificultad}" (choose from "easy", "medium", or "hard"). Adjust the complexity and distractors to this level.
`.trim();
}
