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

    if (!materia || typeof materia !== 'string' || !dificultad) {
      return json({ error: 'materia y dificultad son requeridos' }, { status: 400 });
    }

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
  .replace(/\\"/g, '"') // mantener comillas escapadas
  .replace(/\\\$/g, '$') // ← esto es clave para evitar errores como \$
  .replace(/\\\(/g, '(') // opcional: para fórmulas si vienen mal escapadas
  .replace(/\\\)/g, ')')
  .replace(/,\s*}/g, '}')
  .replace(/,\s*]/g, ']')
  .trim();

// Eliminar etiquetas tipo A. B. C. D.
textoLimpio = textoLimpio.replace(/"([A-D])\.\s*/g, '"');
console.log('🔧 Texto limpio para parsear:', textoLimpio);


   let parsedResponse;
try {
  parsedResponse = JSON.parse(textoLimpio);

  // Formatear el pasaje si está presente y es string
if (parsedResponse.pasaje && typeof parsedResponse.pasaje === 'string') {
  let p = parsedResponse.pasaje.trim();

  // Si es sospechosamente largo sin espacios (probablemente corrompido)
  const pocasEspacios = (p.match(/\s/g) || []).length < 3;

  // Intenta arreglar por si viene todo pegado con comas
  if (pocasEspacios || /[a-z]{10,}/i.test(p)) {
    // reemplaza comas por espacio y divide en palabras (si es posible)
    p = p.replace(/([a-z])([A-Z])/g, '$1 $2')  // divide camelCase
         .replace(/([^\s])([A-Z])/g, '$1 $2')  // divide cosas como )F
         .replace(/([a-z])([0-9])/gi, '$1 $2') // divide letra y número
         .replace(/[,]/g, ' ')                 // coma por espacio
         .replace(/\s{2,}/g, ' ');             // colapsa espacios
  }

  parsedResponse.pasaje = p;
}


} catch (e) {
  console.error('❌ Error al parsear JSON limpio:', e);
  return json({ error: 'JSON inválido tras limpieza', raw: textoLimpio }, { status: 500 });
}


    // Validar campos esenciales para garantizar integridad (opcional)
    const camposEsperados = ['pregunta', 'opciones', 'respuesta', 'explicacion'];
    const camposFaltantes = camposEsperados.filter(campo => !(campo in parsedResponse));

    if (camposFaltantes.length > 0) {
      return json({
        error: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`,
        raw: parsedResponse
      }, { status: 500 });
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
