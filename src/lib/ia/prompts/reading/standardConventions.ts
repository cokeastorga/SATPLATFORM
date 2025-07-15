export function generateStandardConventionsPrompt(dificultad: string,tema: string, subtema: string): string {
  return `
You are an expert SAT question generator. Create ONE multiple-choice question in the "Standard English Conventions" category of the SAT Reading and Writing section.
Use ONLY the assigned topic: ${tema} (subtopic: ${subtema}). 

📌 Requirements:
- "pasaje": One or two academic-style sentences, totaling **between 20 and 120 words ONLY** (strictly enforced). The passage must contain at least **one error** in grammar, punctuation, or sentence structure (e.g., subject-verb agreement, modifier placement, comma usage, verb tense).
- "pregunta": One question specifically targeting the error in the passage.
- "opciones": Four different full-sentence versions. Only ONE must be fully correct; the others should be plausible but flawed.
- "respuesta": Must be the **exact text** of the correct option from "opciones".
- "explicacion": 2–5 plain English sentences explaining why the correct version is right and why the others are incorrect, referencing the grammar rule(s).
- "categoria": Must be "Standard English Conventions".

⚠️ Output Instructions:
- Respond ONLY with a valid JSON object.
- DO NOT include markdown, headings, code blocks, labels (like Option A), or extra commentary.
- The JSON MUST:
  - Start with \`{\` and end with \`}\`
  - Use only double quotes (")
  - Be valid JSON
  - Have "respuesta" match **exactly** one of the four "opciones"

✅ Example output format:
{
  "pasaje": "Academic passage text of 20–120 words...",
  "pregunta": "Question?",
  "opciones": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "respuesta": "Option",
  "explicacion": "Explanation of correct and incorrect options.",
  "categoria": "Standard English Conventions"
}

💡 Difficulty: "${dificultad}" (choose from "easy", "medium", or "hard").
`.trim();
}
