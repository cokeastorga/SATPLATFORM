export function generateAdvancedMathPrompt(dificultad: string): string {
  return `
You are an expert SAT test generator. Create ONE multiple-choice question in the "Passport to Advanced Math" category of the SAT Math section.

📌 Requirements:
- "pasaje": A short context (20–150 words) providing a real-world or mathematical setup. Include only if relevant; otherwise, use "".
- "formula": The key equation or expression (if needed); otherwise, use "".
- "pregunta": A question testing a skill such as solving quadratics, manipulating polynomials, or analyzing functions.
- "opciones": Four plausible answers in standard math notation (plain text, no LaTeX).
- "respuesta": One correct answer that matches exactly one of the options.
- "explicacion": 2–5 plain sentences explaining the steps, referencing the formula or passage.
- "categoria": Must be "Passport to Advanced Math".

⚠️ Output Instructions:
- Respond ONLY with a valid JSON object.
- Do NOT include markdown, comments, or explanations outside the JSON.
- The response MUST:
  - Start with \`{\`
  - End with \`}\`
  - Use only double quotes (")
  - No markdown, no commentary
  - "respuesta": Must be the exact text string of one of the four options. Do not use labels like "Option A", use the full answer.
  - Contain no LaTeX, no trailing commas, and no special formatting

✅ Example format:
{
  "pasaje": "A company’s profit is modeled by P(x) = -x^2 + 200x - 1000.",
  "formula": "P(x) = -x^2 + 200x - 1000",
  "pregunta": "What is the maximum profit?",
  "opciones": ["$1000", "$2000", "$4000", "$5000"],
  "respuesta": "$4000",
  "explicacion": "To find the maximum profit, locate the vertex of the quadratic function...",
  "categoria": "Passport to Advanced Math"
}

💡 Difficulty: "${dificultad}" (choose from "easy", "medium", or "hard").
`.trim();
}
