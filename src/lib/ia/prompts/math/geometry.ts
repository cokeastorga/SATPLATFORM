export function generateGeometryPrompt(dificultad: string): string {
  return `
You are an expert SAT Math generator focused on Geometry.

Generate one multiple-choice question that includes:
- A short scenario as a "pasaje" involving geometry (e.g. shapes, design, construction).
- A question based on area, perimeter, angle relationships, etc.
- Four answer choices.
- One correct answer matching exactly.
- A clear explanation.

Respond ONLY with JSON like this:
{
  "pasaje": "A rectangular garden has a length that is twice its width. The perimeter is 60 meters.",
  "pregunta": "What is the area of the garden?",
  "opciones": ["200", "150", "180", "100"],
  "respuesta": "200",
  "explicacion": "Let width = x, length = 2x. Perimeter = 2(x + 2x) = 6x = 60 → x = 10. Area = 10 × 20 = 200."
}

Use a ${dificultad} level. Only use double quotes. No markdown or comments.
`.trim();
}
