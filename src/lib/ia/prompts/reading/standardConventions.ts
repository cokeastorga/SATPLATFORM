export function generateStandardConventionsPrompt(dificultad: string): string {
  return `
You are an expert SAT question generator. Create ONE multiple-choice question in the "Standard English Conventions" category of the SAT Reading and Writing section.

📌 Requirements:
- "pasaje": One or two academic-style sentences (20–50 words) containing at least one error in grammar, punctuation, or sentence structure (e.g., subject-verb agreement, modifiers, comma usage).
- "pregunta": One question testing the specific error in the passage.
- "opciones": Four distinct sentence versions (strings), each grammatically plausible. Only ONE must be fully correct.
- "respuesta": The exact correct version (must match one of the options).
- "explicacion": 2–5 plain English sentences explaining why the correct version is right and why each incorrect one is wrong, referencing the grammatical rule.
- "categoria": Must be "Standard English Conventions".

⚠️ Output Instructions:
- Respond ONLY with a valid JSON object.
- The response MUST:
  - Start with \`{\`
  - End with \`}\`
  - Use only double quotes (")
  - No markdown, no commentary
  - Contain no headings, explanations, code blocks, markdown, or extra commentary
  - "respuesta": Must be the exact text string of one of the four options. Do not use labels like "Option A", use the full answer.


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
