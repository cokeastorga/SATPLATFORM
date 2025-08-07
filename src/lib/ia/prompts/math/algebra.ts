export function generateAlgebraPrompt(dificultad: string): string {
  return `
You are an expert SAT test generator specializing in the "Algebra" category of the Math section, as defined by the College Board's SAT Suite of Assessments.

Generate one multiple-choice question in valid JSON format, adhering to the following requirements:
- **pasaje**: A concise context or word problem (40-100 words) in English, providing a real-world or mathematical setup for the algebra problem (e.g., involving linear equations, systems, or inequalities). Include only if relevant to the question; otherwise, set to an empty string (""). Ensure all words are properly spaced and readable, avoiding merged or concatenated text.
- **formula**: The main mathematical expression or equation involved in solving the question, written as plain text without LaTeX delimiters (e.g., "2x + 3 = 7" instead of "\\(2x + 3 = 7\\)"). Use standard mathematical notation (e.g., "^" for exponents, "/" for fractions). Include only if the question involves an explicit equation; otherwise, set to an empty string ("").
- **pregunta**: A single question in English testing one specific SAT "Algebra" skill, such as solving linear equations, systems of equations, linear inequalities, or interpreting linear models. Ensure the question is clear, concise, and requires algebraic manipulation.
- **opciones**: Exactly four answer choices in an array of strings, each concise, plausible, and formatted as plain text (e.g., "5" or "x = 3"). Avoid LaTeX or special characters beyond basic mathematical notation.
- **respuesta**: The exact text of the correct answer, matching one of the options exactly.
- **explicacion**: A clear, concise explanation (3–5 sentences) in English detailing the algebraic steps to solve the problem, referencing the formula or passage if applicable. Specify the tested skill and explain why incorrect options are wrong. Use plain text without LaTeX or complex formatting.
- **categoria**: Set to "Algebra" to indicate the SAT category.
- **Difficulty**: Adjust the question complexity based on the difficulty level:
  - "easy": Simple linear equations or inequalities with straightforward solutions.
  - "medium": Problems requiring moderate algebraic manipulation (e.g., solving systems of equations or simplifying expressions).
  - "hard": Complex problems involving advanced techniques (e.g., systems with multiple variables or quadratic-linear systems).
- **Language**: Use English for all fields, ensuring consistency with SAT-style language.


- Respond ONLY with a valid JSON object., formatted as follows:
{
  "pasaje": "A store sells shirts for $20 each and hats for $15 each. A customer buys 3 shirts and 2 hats for $90.",
  "formula": "20x + 15y = 90",
  "pregunta": "If x is the number of shirts and y is the number of hats, what is the value of y?",
  "opciones": ["1", "2", "3", "4"],
  "respuesta": "2",
  "explicacion": "The equation 20x + 15y = 90 represents the total cost, with x = 3 shirts and y hats. Substitute x = 3: 20(3) + 15y = 90, so 60 + 15y = 90. Solve for y: 15y = 30, y = 2. Other options result from incorrect substitutions or arithmetic errors.",
  "categoria": "Algebra"
}

Rules:
- Use only double quotes (")
- No markdown, no commentary
- Properly escape any internal quotes within strings (e.g., "The equation\\'s solution").
- Ensure the JSON is valid and contains no extra text, markdown, code blocks, or commentary.
- The difficulty level is "${dificultad}" (valid values: "easy", "medium", "hard"). If the difficulty is invalid, default to "medium".
- Avoid LaTeX-style delimiters (e.g., \\( \\), $$, $) or special characters beyond standard mathematical notation.
- Ensure all text fields (pasaje, pregunta, explicacion) are readable, with proper spacing and no merged words.
- "respuesta": Must be the exact text string of one of the four options. Do not use labels like "Option A", use the full answer.

`.trim();
}