export function generateAlgebraPrompt(dificultad: string): string {
  return `
You are an expert SAT Math generator focused on Algebra.

Generate one multiple-choice math question that includes:
- A short real-world context or scenario as a "pasaje" (if not needed, set "pasaje" to an empty string).
- One algebra question involving solving equations, systems, or factoring.
- Four answer options in an array.
- The correct answer (exactly matching one of the options).
- A clear explanation of the answer.

Return ONLY a valid JSON object like:
{
  "pasaje": "A school sells 120 tickets for a play. Adult tickets cost $10 and student tickets cost $5. Total revenue was $900.",
  "pregunta": "How many adult tickets were sold?",
  "opciones": ["30", "40", "50", "60"],
  "respuesta": "60",
  "explicacion": "Let a = adult tickets, s = student tickets. a + s = 120 and 10a + 5s = 900. Solving gives a = 60."
}

Use a ${dificultad} level of difficulty. Use only double quotes. Output only the JSON object.
`.trim();
}
