export function generateExpressionIdeasPrompt(dificultad: string): string {
  return `
You are an expert SAT test generator. Create ONE multiple-choice question in the "Expression of Ideas" category of the SAT Reading and Writing section.

📌 Requirements:
- "pasaje": A formal academic passage of **80 to 120 words ONLY** (strictly enforced). Topic must be related to science, history, or social studies. Count your words carefully. No less than 80, no more than 120.
- The passage must allow for a question about improving **organization**, **clarity**, **transitions**, or **rhetorical effectiveness**.
- "pregunta": One question targeting expression (e.g., combining sentences, improving clarity, transitions, or word choice).
- "opciones": Exactly four unique and concise answer choices (plain text).
- "respuesta": The exact text of one correct option from "opciones".
- "explicacion": 2–5 sentences in plain English explaining why the correct answer is best and the others are not.
- "categoria": Must be "Expression of Ideas".

⚠️ Output Format Instructions:
- Respond ONLY with a valid JSON object.
- DO NOT include any commentary, code blocks, or markdown formatting.
- The JSON MUST:
  - Start with \`{\` and end with \`}\`
  - Use only double quotes (")
  - Contain NO markdown or extra text
  - Be fully valid JSON
  - Have "respuesta" match **exactly** one of the four options — do NOT use labels like "A" or "Option B", only the text.

Use this exact format:
{
  "pasaje": "A formal, well-structured passage between 80–120 words...",
  "pregunta": "Which revision best improves the clarity of the sentence?",
  "opciones": ["First option text", "Second option text", "Third option text", "Fourth option text"],
  "respuesta": "Second option text",
  "explicacion": "Explanation of why this option is better.",
  "categoria": "Expression of Ideas"
}

💡 Difficulty: "${dificultad}" (choose from "easy", "medium", or "hard").
`.trim();
}
