export function generateAlgebraPrompt(dificultad: string): string {
  return `
You are an expert SAT math question generator.

Generate one multiple-choice algebra question that includes:

- A short contextual or word-based math problem (optional passage).
- If needed, include a formula (but write it plainly, without LaTeX delimiters like \\( or \\)).
- Exactly four answer choices as a string array.
- The correct answer (must match exactly one of the options).
- A clear explanation of the solution.
- Include the field "categoria" to specify the topic (e.g., Álgebra, Geometría).
“Make sure all words in 'pasaje' are properly spaced and readable. Avoid merging words.”


Respond ONLY in valid JSON format like this:
{
  "pasaje": "A ball is thrown upward with velocity 64 ft/s.",
  "formula": "h(t) = -16t^2 + 64t",
  "pregunta": "What is the maximum height the ball reaches?",
  "opciones": ["32", "64", "96", "128"],
  "respuesta": "64",
  "explicacion": "The vertex of the parabola h(t) = -16t^2 + 64t occurs at t = -b/2a = 2. Substituting, h(2) = -16(4) + 64(2) = 64."
   "categoria": "Algebra"
}

Rules:
- Do not use \\( or \\) or other LaTeX delimiters.
- Use only double quotes and escape them properly.
- Keep the math expressions in plain text.
- Use a ${dificultad} level of difficulty.
- Output ONLY the JSON — no commentary or markdown.
`.trim();
}
