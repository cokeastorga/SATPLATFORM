import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { getRandomReadingPrompt } from '$lib/ia/prompts/reading';
import { getRandomMathPrompt } from '$lib/ia/prompts/math';
import pino from 'pino';

const logger = pino({ level: import.meta.env.DEV ? 'debug' : 'info' });

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
    const body = await request.json();
    const { materia, dificultad, prompt: customPrompt } = body;

    if (!materia || typeof materia !== 'string' || !dificultad || typeof dificultad !== 'string') {
      logger.warn('Invalid request: materia and dificultad are required', { materia, dificultad });
      return json({ error: 'materia y dificultad son requeridos' }, { status: 400 });
    }

    let prompt: string;
    const normalizedMateria = materia.toLowerCase();
    if (normalizedMateria !== 'matematicas' && normalizedMateria !== 'reading and writing') {
      logger.warn('Unsupported materia', { materia });
      return json({ error: `Materia no soportada: ${materia}` }, { status: 400 });
    }

    prompt = customPrompt && typeof customPrompt === 'string' ? customPrompt : normalizedMateria === 'matematicas' ? getRandomMathPrompt(dificultad) : getRandomReadingPrompt(dificultad);

    // Log del prompt para depuración
    logger.debug('Prompt usado:', { prompt, materia, dificultad });

    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 1024,
      responseMimeType: 'application/json'
    };

    logger.debug('Generating content with prompt', { materia, dificultad, promptLength: prompt.length });

    let result;
    try {
      result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings
      });
    } catch (apiError) {
      logger.error('Error en la llamada a la API de Gemini', {
        error: apiError.message,
        stack: apiError.stack,
        code: apiError.code,
        details: apiError.details || 'No details provided'
      });
      return json(
        { error: 'Error al llamar a la API de Gemini', details: apiError.message, code: apiError.code },
        { status: 500 }
      );
    }

    const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (!responseText) {
      logger.error('No response text from Gemini', { result });
      return json({ error: 'No se recibió respuesta de Gemini', raw: result }, { status: 500 });
    }

    logger.debug('🔎 RESPUESTA CRUDA GEMINI', { responseText });
    console.log('RAW GEMINI RESPONSE:', JSON.stringify(responseText, null, 2));

    // Limpieza mejorada
    let textoLimpio = responseText
      .replace(/^```json\n?/, '') // Elimina ```json
      .replace(/\n```$/, '')      // Elimina ``` final
      .replace(/[\r\n\t-\u001F\u007F-\u009F]+/g, '') // Elimina todos los caracteres de control
      .replace(/\s{2,}/g, ' ')    // Colapsa múltiples espacios
      .trim();

    logger.debug('Texto limpio después de procesamiento:', { textoLimpio });

    // Validar que sea un JSON potencialmente válido
    if (!textoLimpio.startsWith('{') && !textoLimpio.startsWith('[')) {
      logger.error('Texto limpio no parece JSON válido', { textoLimpio, responseText });
      return json({ error: 'El texto limpio no es un JSON válido', raw: textoLimpio, responseText }, { status: 500 });
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(textoLimpio);
    } catch (e) {
      logger.error('❌ JSON parse fallido', { error: e.message, textoLimpio, responseText });
      return json({ error: 'JSON inválido tras limpieza', raw: textoLimpio, responseText }, { status: 500 });
    }

    // Validate essential fields
    const camposEsperados = ['pregunta', 'opciones', 'respuesta', 'explicacion', 'categoria'];
    const camposFaltantes = camposEsperados.filter(campo => !(campo in parsedResponse) || parsedResponse[campo] === null || parsedResponse[campo] === undefined);
    
    if (camposFaltantes.length > 0) {
      logger.warn('Missing required fields', { camposFaltantes, parsedResponse });
      return json({
        error: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`,
        raw: parsedResponse
      }, { status: 500 });
    }

    // Validate opciones
    const opciones = Array.isArray(parsedResponse.opciones) ? parsedResponse.opciones : Object.values(parsedResponse.opciones);
    logger.debug('🔎 Opciones y respuesta:', { opciones, respuesta: parsedResponse.respuesta });
    if (opciones.length !== 4 || new Set(opciones).size !== 4) {
      logger.warn('Invalid opciones: must be 4 unique options', { opciones });
      return json({ error: 'Opciones inválidas: deben ser 4 opciones únicas', raw: parsedResponse }, { status: 500 });
    }

    // Validate respuesta
    if (!opciones.includes(parsedResponse.respuesta)) {
      logger.warn('Respuesta does not match any option', { respuesta: parsedResponse.respuesta, opciones });
      return json({ error: 'La respuesta no coincide con ninguna opción', raw: parsedResponse }, { status: 500 });
    }

    // Validate pasaje length if present
    if (typeof parsedResponse.pasaje === 'string' && parsedResponse.pasaje.trim().length > 0) {
      const wordCount = parsedResponse.pasaje.trim().split(/\s+/).length;
      const isStandardConventions = parsedResponse.categoria === 'Standard English Conventions';
      const isMath = normalizedMateria === 'matematicas';
      const expectedWordCount = isMath || isStandardConventions ? [25, 120] : [30, 120]; // Relajado para pruebas

      logger.debug('Validando longitud del pasaje:', { wordCount, expectedWordCount, categoria: parsedResponse.categoria });

      if (wordCount < expectedWordCount[0] || wordCount > expectedWordCount[1]) {
        logger.warn('Invalid pasaje length', { wordCount, expectedWordCount, categoria: parsedResponse.categoria });
        return json({
          error: `Pasaje inválido: longitud fuera del rango (${expectedWordCount[0]}–${expectedWordCount[1]} palabras)`,
          raw: parsedResponse
        }, { status: 500 });
      }

      // Clean pasaje
      parsedResponse.pasaje = parsedResponse.pasaje
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([^\s])([A-Z])/g, '$1 $2')
        .replace(/([a-z])([0-9])/gi, '$1 $2')
        .replace(/[,]/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    }

    // Validate categoria
    const validCategorias = [
      'Algebra',
      'Passport to Advanced Math',
      'Geometry and Measurement',
      'Problem Solving and Data Analysis',
      'Craft and Structure',
      'Information and Ideas',
      'Standard English Conventions',
      'Expression of Ideas',
      'Underlined Words'
    ];
    if (!validCategorias.includes(parsedResponse.categoria)) {
      logger.warn('Invalid categoria', { categoria: parsedResponse.categoria });
      return json({ error: 'Categoría inválida', raw: parsedResponse }, { status: 500 });
    }

    logger.debug('Respuesta válida, devolviendo JSON:', { parsedResponse });
    return json(parsedResponse, { status: 200 });
  } catch (error) {
    logger.error('Internal server error', { error: error.message, stack: error.stack });
    if (error.code === 'ERR_BLOCKED_BY_RESPONSE' && error.message.includes('Quota')) {
      const retryAfter = 30;
      return json(
        { error: 'Cuota excedida', details: `Reintenta en ${retryAfter}s` },
        { status: 429 }
      );
    }
    return json(
      { error: 'Error del servidor al procesar la solicitud', details: error.message },
      { status: 500 }
    );
  }
}