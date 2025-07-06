export function generateGeometryPrompt(dificultad: string): string {
  return `
You are an expert SAT test generator specializing in the "Geometry and Measurement" category of the Math section, as defined by the College Board's SAT Suite of Assessments.

Generate one multiple-choice question in valid JSON format, adhering to the following requirements:
- **pasaje**: A concise context or word problem (20–50 words) in English, providing a real-world or geometric setup for the problem (e.g., involving shapes, areas, volumes, or coordinate geometry). Include only if relevant to the question; otherwise, set to an empty string (""). Ensure all words are properly spaced and readable, avoiding merged or concatenated text.
- **formula**: The main geometric formula or equation involved in solving the question, written as plain text without LaTeX delimiters (e.g., "A = πr^2" instead of "\\(A = \\pi r^2\\)"). Use standard mathematical notation (e.g., "^" for exponents, "π" for pi). Include only if the question involves an explicit formula; otherwise, set to an empty string ("").
- **pregunta**: A single question in English testing one specific SAT "Geometry and Measurement" skill, such as calculating areas, perimeters, volumes, angles, or properties of triangles, circles, or coordinate geometry. Ensure the question is clear, concise, and requires geometric reasoning or computation.
- **opciones**: Exactly four answer choices in an array of strings, each concise, plausible, and formatted as plain text (e.g., "12" or "30 degrees"). Avoid LaTeX or special characters beyond basic mathematical notation.
- **respuesta**: The exact text of the correct answer, matching one of the options exactly.
- **explicacion**: A clear, concise explanation (3–5 sentences) in English detailing the geometric steps to solve the problem, referencing the formula or passage if applicable. Specify the tested skill and explain why incorrect options are wrong. Use plain text without LaTeX or complex formatting.
- **categoria**: Set to "Geometry and Measurement" to indicate the SAT category.
- **Difficulty**: Adjust the question complexity based on the difficulty level:
  - "easy": Simple calculations of area, perimeter, or basic angle properties.
  - "medium": Problems requiring moderate geometric reasoning (e.g., applying Pythagorean theorem, circle properties, or coordinate distance).
  - "hard": Complex problems involving advanced techniques (e.g., trigonometry, volume of composite shapes, or coordinate geometry transformations).
- **Language**: Use English for all fields, ensuring consistency with SAT-style language.


- Respond ONLY with a valid JSON object., formatted as follows:
{
  "pasaje": "A rectangular garden has a length of 10 meters and a width of 6 meters.",
  "formula": "A = l * w",
  "pregunta": "What is the area of the garden?",
  "opciones": ["16 m^2", "36 m^2", "60 m^2", "66 m^2"],
  "respuesta": "60 m^2",
  "explicacion": "To find the area of the rectangular garden, use the formula A = l * w, where l = 10 meters and w = 6 meters. Calculate A = 10 * 6 = 60 m^2. Thus, the area is 60 m^2. Other options result from incorrect multiplication or misinterpreting the dimensions.",
  "categoria": "Geometry and Measurement"
}

Rules:
- Use only double quotes (")
- No markdown, no commentary
- Properly escape any internal quotes within strings (e.g., "The triangle\\'s area").
- Ensure the JSON is valid and contains no extra text, markdown, code blocks, or commentary.
- The difficulty level is "${dificultad}" (valid values: "easy", "medium", "hard"). If the difficulty is invalid, default to "medium".
- Avoid LaTeX-style delimiters (e.g., \\( \\), $$, $) or special characters beyond standard mathematical notation (e.g., "^", "π").
- Ensure all text fields (pasaje, pregunta, explicacion) are readable, with proper spacing and no merged words.
- "respuesta": Must be the exact text string of one of the four options. Do not use labels like "Option A", use the full answer.

`.trim();
}