export function generateAdvancedMathPrompt(dificultad: string): string {
  return `
You are an expert SAT Math generator focused on Advanced Math.

Generate one problem that includes:
- A short mathematical or real-world context as "pasaje" (e.g. quadratic motion, exponential growth).
- One question involving functions, quadratics, or expressions.
- Four options, one correct, with explanation.

Format:
{
  "pasaje": "The height \\( h \\) of a ball in meters after \\( t \\) seconds is given by \\( h(t) = -5t^2 + 20t + 1 \\).",
  "pregunta": "What is the maximum height the ball reaches?",
  "opciones": ["16", "21", "26", "30"],
  "respuesta": "21",
  "explicacion": "Max height at vertex: \\( t = -b/2a = -20/(2×-5) = 2 \\). \\( h(2) = -5(4) + 40 + 1 = 21 \\)."
}

Use ${dificultad} level. Only double quotes. Output only the JSON.
`.trim();
}
