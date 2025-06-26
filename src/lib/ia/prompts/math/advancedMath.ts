export function generateAdvancedMathPrompt(dificultad: string): string {
  return `
You are an expert SAT math question generator specialized in Passport to Advanced Math.

Generate a JSON object with the following fields:
{
  "pasaje": "Optional context or scenario for the problem (e.g., involving functions, quadratics, systems).",
  "formula": "The main expression or equation involved in solving the question, without LaTeX delimiters.",
  "pregunta": "A question that involves expressions, equations, or functions requiring algebraic manipulation.",
  "opciones": ["Option A", "Option B", "Option C", "Option D"],
  "respuesta": "The correct answer that matches one of the options.",
  "explicacion": "Detailed algebraic steps to reach the correct answer. Avoid LaTeX formatting."
   "categoria": "Advanced Math",
  
}

Rules:
- Use the ${dificultad} level of difficulty.
- Return ONLY the JSON — no markdown, no commentary.
- Avoid any LaTeX-style delimiters (\\( \\), $$, etc.).
- Use only double quotes and escape properly.
- Include the field "categoria" to specify the topic (e.g., Álgebra, Geometría).
“Make sure all words in 'pasaje' are properly spaced and readable. Avoid merging words.”
`.trim();
}
