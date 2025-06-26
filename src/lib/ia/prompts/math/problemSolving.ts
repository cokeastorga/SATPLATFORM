export function generateProblemSolvingPrompt(dificultad: string): string {
  return `
You are an expert SAT Math generator focused on Problem Solving and Data Analysis.

Generate one real-world math question that includes:
- A short scenario or data-based setup as a "pasaje".
- A question involving ratios, percentages, units, or statistics.
- Four answer options.
- The correct answer and an explanation.

Respond with JSON like this:
{
  "pasaje": "A car travels 300 miles using 12 gallons of gasoline.",
  "pregunta": "What is the car’s average fuel efficiency in miles per gallon?",
  "opciones": ["20", "24", "25", "30"],
  "respuesta": "25",
  "explicacion": "Efficiency = 300 ÷ 12 = 25 mpg."
}

Use a ${dificultad} level. Use double quotes. Output ONLY the JSON object.
`.trim();
}
