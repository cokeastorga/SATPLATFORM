import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { getRandomReadingPrompt } from '$lib/ia/prompts/reading';
import { getRandomMathPrompt } from '$lib/ia/prompts/math';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
];

export async function POST({ request }) {
  try {
    const { materia, dificultad } = await request.json();

    if (!materia  || typeof materia  !== 'string' || !dificultad) {
      return json({ error: 'materia y dificultad son requeridos' }, { status: 400 });
    }

       // Obtener prompt según materia
    let prompt: string;
    switch (materia.toLowerCase()) {
      case 'matematicas':
        prompt = getRandomMathPrompt(dificultad);
        break;
      case 'reading and writing':
         prompt = getRandomReadingPrompt(dificultad);
        break;
      default:
        return json({ error: `Materia no soportada: ${materia}` }, { status: 400 });
    }

    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 1024,
      responseMimeType: 'application/json'
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings
    });

    const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (import.meta.env.DEV) {
      console.log('📥 Respuesta cruda de Gemini:', responseText);
    }

    const jsonMatch = responseText.match(/\{[\s\S]*?\}|\[[\s\S]*?\]/);
    if (!jsonMatch) {
      return json(
        { error: 'No se encontró un JSON válido en la respuesta', raw: responseText },
        { status: 500 }
      );
    }

    let textoLimpio = jsonMatch[0]
      .replace(/\n/g, ' ')
      .replace(/\r/g, '')
      .replace(/\t/g, ' ')
      .replace(/\\/g, '\\')
      .replace(/\"/g, '"')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .trim();

    // Eliminar etiquetas tipo A. B. C. D.
    textoLimpio = textoLimpio.replace(/\"[A-D]\.\s*/g, '"');

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(textoLimpio);
    } catch (e) {
      console.error('❌ Error al parsear JSON limpio:', e);
      return json({ error: 'JSON inválido tras limpieza', raw: textoLimpio }, { status: 500 });
    }

    return json(parsedResponse, { status: 200 });
  } catch (error) {
    console.error('❌ Error interno del endpoint:', error);

    const status = error?.status || 500;
    const message = error?.message || 'Error inesperado en el servidor';
    return json(
      { error: 'Error del servidor al procesar la solicitud', details: message },
      { status }
    );
  }
}
