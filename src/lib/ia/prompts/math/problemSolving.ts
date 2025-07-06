export function generateProblemSolvingPrompt(dificultad: string): string {
  return `
You are an expert SAT test generator specializing in the "Problem Solving and Data Analysis" category of the Math section, as defined by the College Board's SAT Suite of Assessments.

Generate one multiple-choice question in valid JSON format, adhering to the following requirements:
- **pasaje**: A concise context or word problem (20–50 words) in English, providing a real-world or data-driven setup for the problem (e.g., involving rates, percentages, proportions, or data interpretation). Include only if relevant to the question; otherwise, set to an empty string (""). Ensure all words are properly spaced and readable, avoiding merged or concatenated text.
- **formula**: The main mathematical expression or equation involved in solving the question, written as plain text without LaTeX delimiters (e.g., "p = 0.25 * 200" instead of "\\(p = 0.25 \\times 200\\)"). Use standard mathematical notation (e.g., "*" for multiplication, "/" for fractions). Include only if the question involves an explicit equation; otherwise, set to an empty string ("").
- **pregunta**: A single question in English testing one specific SAT "Problem Solving and Data Analysis" skill, such as calculating rates, ratios, percentages, proportions, unit conversions, or interpreting data (e.g., tables, graphs, or probabilities). Ensure the question is clear, concise, and requires problem-solving or data analysis.
- **opciones**: Exactly four answer choices in an array of strings, each concise, plausible, and formatted as plain text (e.g., "50" or "25%"). Avoid LaTeX or special characters beyond basic mathematical notation.
- **respuesta**: The exact text of the correct answer, matching one of the options exactly.
- **explicacion**: A clear, concise explanation (3–5 sentences) in English detailing the steps to solve the problem, referencing the formula or passage if applicable. Specify the tested skill and explain why incorrect options are wrong. Use plain text without LaTeX or complex formatting.
- **categoria**: Set to "Problem Solving and Data Analysis" to indicate the SAT category.
- **Difficulty**: Adjust the question complexity based on the difficulty level:
  - "easy": Simple calculations of rates, percentages, or unit conversions with straightforward data.
  - "medium": Problems requiring moderate analysis (e.g., interpreting tables, calculating proportions, or multi-step ratios).
  - "hard": Complex problems involving advanced techniques (e.g., probability, weighted averages, or multi-variable data analysis).
- **Language**: Use English for all fields, ensuring consistency with SAT-style language.


- Respond ONLY with a valid JSON object., formatted as follows:
{
  "pasaje": "A store offers a 20% discount on a $50 item. A tax of 5% is applied after the discount.",
  "formula": "0.80 * 50 * 1.05",
  "pregunta": "What is the final price of the item after discount and tax?",
  "opciones": ["$42.00", "$42.50", "$44.00", "$45.00"],
  "respuesta": "$42.00",
  "explicacion": "To find the final price, first apply the 20% discount: 0.80 * $50 = $40. Then apply the 5% tax: $40 * 1.05 = $42. Thus, the final price is $42.00. Other options result from incorrect discount or tax calculations.",
  "categoria": "Problem Solving and Data Analysis"
}

Rules:
- Use only double quotes (")
- No markdown, no commentary
- Properly escape any internal quotes within strings (e.g., "The store\\'s discount").
- Ensure the JSON is valid and contains no extra text, markdown, code blocks, or commentary.
- The difficulty level is "${dificultad}" (valid values: "easy", "medium", "hard"). If the difficulty is invalid, default to "medium".
- Avoid LaTeX-style delimiters (e.g., \\( \\), $$, $) or special characters beyond standard mathematical notation (e.g., "*", "/").
- Ensure all text fields (pasaje, pregunta, explicacion) are readable, with proper spacing and no merged words.
- "respuesta": Must be the exact text string of one of the four options. Do not use labels like "Option A", use the full answer.

`.trim();
}