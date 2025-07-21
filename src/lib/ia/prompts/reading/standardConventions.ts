export function generateStandardConventionsPrompt(dificultad: string,tema: string, subtema: string): string {
  return `
You are an expert SAT question generator. Create ONE multiple-choice question in the "Standard English Conventions" category of the SAT Reading and Writing section.
Use ONLY the assigned topic: ${tema} (subtopic: ${subtema}). 
“The passage, question, options, answer, and explanation must be written entirely in English. The response must be in JSON format.”
📌 Requirements:
- "pasaje": One or two academic-style sentences, totaling **between 40 and 100 words ONLY** (strictly enforced). The passage must contain at least **one error** in grammar, punctuation, or sentence structure (e.g., subject-verb agreement, modifier placement, comma usage, verb tense).
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



💡 Difficulty: "${dificultad}" (choose from "easy", "medium", or "hard").
`.trim();
}
