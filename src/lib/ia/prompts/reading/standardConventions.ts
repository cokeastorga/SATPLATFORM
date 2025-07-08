export function generateStandardConventionsPrompt(dificultad: string): string {
  return `
You are an expert SAT question generator. Create ONE multiple-choice question in the "Standard English Conventions" category of the SAT Reading and Writing section.

📌 Requirements:
- "pasaje": One or two academic-style sentences, totaling **between 20 and 150 words ONLY** (strictly enforced). The passage must contain at least **one error** in grammar, punctuation, or sentence structure (e.g., subject-verb agreement, modifier placement, comma usage, verb tense).
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
  "pasaje": "The committee of experts have released its findings, which was unexpected.",
  "pregunta": "Which revision best corrects the grammatical errors in the sentence?",
  "opciones": [
    "The committee of experts have released its findings, which was unexpected.",
    "The committee of experts has released their findings, which were unexpected.",
    "The committee of experts has released its findings, which were unexpected.",
    "The committee of experts have released their findings, which was unexpected."
  ],
  "respuesta": "The committee of experts has released its findings, which were unexpected.",
  "explicacion": "The subject 'committee' is singular and requires 'has'. The pronoun 'its' agrees with 'committee', and 'findings' is plural, requiring 'were'. The other options either mismatch subject-verb or pronoun-antecedent agreement.",
  "categoria": "Standard English Conventions"
}

💡 Difficulty: "${dificultad}" (choose from "easy", "medium", or "hard").
`.trim();
}
