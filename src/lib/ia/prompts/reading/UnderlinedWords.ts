export function generateUnderlinedWordsPrompt(
  dificultad: string,
  tema: string,
  subtema: string
): string {
  return `
You are an expert SAT test generator. Create ONE multiple-choice question in the "Standard English Conventions" category for the Reading and Writing section, focusing on an Underlined Words or phrase.
“The passage, question, options, answer, and explanation must be written entirely in English. The response must be in JSON format.”
📌 Requirements:
- "pasaje": Write a sentence or very short passage **40 to 100 words. In the passage, one word or phrase must be **underlined** using double underscores before and after it, like __this__. Only one underlined section per passage.
- "pregunta": Ask which choice most effectively replaces the underlined word or phrase, or if it should remain as is.
- "opciones": Four concise answer choices. The **first option must always be 'NO CHANGE'**, meaning the underlined part is already correct. The other three options must be alternative phrasings or words (do not label with A/B/C, just the text).
- "respuesta": The exact text of the correct answer (must be one of the options).
- "explicacion": English explaining why the correct answer is best than others.
- "categoria": "Underlined Words"
- Difficulty: Use "${dificultad}" level.
Use ONLY the assigned topic for create the pasaje: ${tema} (subtopic: ${subtema}).

⚠️ Output Format Instructions:
- Output ONLY a valid JSON object.
- The JSON MUST:
  - Start with '{' and end with '}'
  - Use only double quotes (")
  - Contain NO markdown, code blocks, or extra text
  - Be ASCII-only (no Unicode special characters)
  - The "respuesta" must exactly match one of the four options.


`.trim();
}
