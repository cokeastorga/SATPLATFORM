export function generateExpressionIdeasPrompt(dificultad: string,
  tema: string,
  subtema: string
): string {
  return `
You are an expert SAT test generator. Create ONE multiple-choice question in the "Expression of Ideas" category of the SAT Reading and Writing section.

📌 Requirements:
- "pasaje": A formal academic passage of **20 to 120 words ONLY** (strictly enforced). The topic must be related to science, history, or social studies, but do NOT use overused SAT topics (e.g., penicillin, Rosetta Stone, Industrial Revolution). Do NOT simply copy the topic into the question or options.
- The passage must allow for a question about improving **organization**, **clarity**, **transitions**, or **rhetorical effectiveness**.
- "pregunta": One question targeting expression of ideas (e.g., combining sentences, improving clarity, transitions, or word choice). The question must directly require information from the passage.
- "opciones": Exactly four unique and concise answer choices (plain text, no labels).
- "respuesta": The exact text of one correct option from "opciones" (do NOT use labels like "A", only the text).
- "explicacion": 2–5 sentences in plain English explaining why the correct answer is best and the others are not.
- "categoria": Must be "Expression of Ideas".
Use ONLY the assigned topic: ${tema} (subtopic: ${subtema}).

⚠️ Output Format Instructions:
- Respond ONLY with a valid JSON object.
- The JSON MUST:
  - Start with '{' and end with '}'
  - Use only double quotes (")
  - Contain NO markdown, code blocks, or extra text
  - Be ASCII-only (do NOT use Unicode special characters)
  - Have "respuesta" match **exactly** one of the four options (text only)

✅ Example:
{
  "pasaje": "A formal, well-structured passage between 20–120 words...",
  "pregunta": "Question?",
  "opciones": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "respuesta": "Option",
  "explicacion": "Explanation of why this option is better.",
  "categoria": "Expression of Ideas"
}

💡 Difficulty: Use "${dificultad}" (choose from "easy", "medium", or "hard"). The question and distractors must match this level.
`.trim();
}
