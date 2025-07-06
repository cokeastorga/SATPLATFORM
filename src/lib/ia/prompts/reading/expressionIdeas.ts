export function generateExpressionIdeasPrompt(dificultad: string): string {
  return `
You are an expert SAT test generator. Create ONE multiple-choice question in the "Expression of Ideas" category of the SAT Reading and Writing section.

📌 Requirements:
- "pasaje": A 80–120 word formal, academic passage about science, history, or social studies. The passage must allow for a question about improving organization, clarity, transitions, or rhetorical effectiveness.
- "pregunta": One question targeting expression, such as combining sentences, clarifying transitions, or improving word choice.
- "opciones": Exactly four plausible and unique answers (as plain text).
- "respuesta": The exact text of one correct option.
- "explicacion": 2–5 sentences in plain English explaining why the correct choice improves the passage and why the others don’t.
- "categoria": Must be "Expression of Ideas".

⚠️ Output Instructions:
- Respond ONLY with a valid JSON object.
- Do NOT include headings, notes, explanations, markdown, or comments.
- The response MUST:
  - Start with \`{\`
  - End with \`}\`
  - Use only double quotes (")
  - No markdown, no commentary
  - Be valid JSON with no trailing commas
  - "respuesta": Must be the exact text string of one of the four options. Do not use labels like "Option A", use the full answer.


Use this exact format:
{
  "pasaje": "A formal, well-structured passage...",
  "pregunta": "Which revision best improves the clarity of the sentence?",
  "opciones": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "respuesta": "Option 1",
  "explicacion": "Clear explanation of why it's correct.",
  "categoria": "Expression of Ideas"
}

💡 Difficulty: "${dificultad}" (choose from "easy", "medium", or "hard").
`.trim();
}
