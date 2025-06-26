export function generateGeometryPrompt(dificultad: string): string {
  return `
You are an expert SAT math question generator specialized in Geometry and Measurement.

Generate a JSON object with the following fields:
{
  "pasaje": "A brief scenario involving geometric context, if needed (optional, leave empty if not needed).",
  "formula": "A geometric expression, formula, or equation needed for solving the problem. Do NOT include LaTeX delimiters.",
  "pregunta": "A clear geometry-related question (e.g., about area, perimeter, angles, or properties of shapes).",
  "opciones": ["Option A", "Option B", "Option C", "Option D"],
  "respuesta": "The correct answer, which must match exactly one of the options.",
  "explicacion": "Explain clearly how to solve the problem step by step. Do NOT use LaTeX delimiters."
   "categoria": "Geometry",
}

Rules:
- Difficulty: ${dificultad}
- Return ONLY the JSON object.
- Use only double quotes and escape characters properly.
- Do not use \\( \\) or any LaTeX-style formatting.
- Include the field "categoria" to specify the topic (e.g., Álgebra, Geometría).
“Make sure all words in 'pasaje' are properly spaced and readable. Avoid merging words.”
`.trim();
}
