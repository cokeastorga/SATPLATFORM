export function generateInformationIdeasPrompt(dificultad: string): string {
  return `
You are an expert SAT question generator. Create ONE multiple-choice question in the "Information and Ideas" category of the SAT Reading and Writing section.

📌 Requirements:
- "pasaje": A strictly 80–120 word academic passage in English. The passage must be related to science, history, or social studies. Count words carefully. Do NOT go under or over this range.
- The passage must support a question involving **main idea**, **inference**, or **use of textual evidence**.
- "pregunta": One clear question assessing either main idea, inference, or supporting evidence.
- "opciones": Exactly four distinct and plausible answers in plain text.
- "respuesta": Must be the **exact text** of the correct answer from the list of options (no labels).
- "explicacion": 2–5 sentences explaining why the correct choice is best and the others are not, using evidence from the passage.
- "categoria": Must be "Information and Ideas".

⚠️ Output Instructions:
- Respond ONLY with a valid JSON object.
- DO NOT include headings, markdown, code blocks, comments, or any explanation outside of the JSON.
- The JSON MUST:
  - Start with \`{\` and end with \`}\`
  - Use only double quotes (")
  - Be fully valid JSON
  - Have "respuesta" match exactly one of the "opciones"

✅ Use this exact structure:
{
  "pasaje": "Academic passage text of 80–120 words...",
  "pregunta": "What inference can be made from the passage?",
  "opciones": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
  "respuesta": "Answer 2",
  "explicacion": "Explanation of correct and incorrect options.",
  "categoria": "Information and Ideas"
}

💡 Difficulty: "${dificultad}" (choose from "easy", "medium", or "hard").
`.trim();
}
