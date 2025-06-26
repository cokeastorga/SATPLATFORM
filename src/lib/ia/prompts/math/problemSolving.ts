export function generateProblemSolvingPrompt(dificultad: string): string {
  return `
You are an expert SAT math question generator focused on Problem Solving and Data Analysis.

Generate a JSON object with the following fields:
{
  "pasaje": "A short context involving data, rates, percentages, proportions, or real-world quantities.",
  "formula": "Any relevant equation or numeric expression used to solve the problem. Avoid LaTeX delimiters.",
  "pregunta": "A clear question that involves problem solving or data interpretation.",
  "opciones": ["Option A", "Option B", "Option C", "Option D"],
  "respuesta": "The correct answer, which must exactly match one of the options.",
  "explicacion": "Provide a step-by-step explanation with the correct logic and math. Do NOT use LaTeX delimiters."
   "categoria": "Problem Solving",
}

Rules:
- Difficulty: ${dificultad}
- Output only valid JSON.
- Do not include LaTeX markers like \\( \\) or $$.
- Use only double quotes for strings and escape properly.
- Include the field "categoria" to specify the topic (e.g., Álgebra, Geometría).
“Make sure all words in 'pasaje' are properly spaced and readable. Avoid merging words.”
`.trim();
}
