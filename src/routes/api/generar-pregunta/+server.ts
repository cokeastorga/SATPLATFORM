// src/routes/api/generar-pregunta/+server.ts
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private'; // Importa tu clave de API de forma segura
import { json } from '@sveltejs/kit'; // Para devolver respuestas JSON

// Inicializa el modelo Gemini con tu clave de API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Configuración de seguridad (opcional, pero buena práctica)
// Ajusta estos umbrales según tu caso de uso y requisitos de contenido
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE, // Bloquear nada para pruebas, ajustar a BLOCK_LOW, BLOCK_MEDIUM, etc.
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

/**
 * Manejador de solicitud POST para generar preguntas usando la API de Gemini.
 * @param {object} params - Parámetros de la solicitud, incluyendo el objeto request.
 * @returns {Response} - Respuesta JSON con la pregunta generada o un mensaje de error.
 */
export async function POST({ request }) {
    try {
        const { prompt } = await request.json(); // Recibe el 'prompt' del frontend

        if (!prompt) {
            console.error('Error: Prompt no recibido del frontend.');
            return json({ error: 'Prompt es requerido' }, { status: 400 });
        }

        // Configuración de generación para la respuesta de Gemini
        // Ajusta estos valores para controlar el comportamiento de la generación
        const generationConfig = {
            temperature: 0.7, // Controla la creatividad (0.0 a 1.0)
            topP: 0.95,       // Controla la diversidad mediante muestreo de núcleo
            topK: 64,         // Controla la diversidad mediante muestreo de top-k
            maxOutputTokens: 1024, // Máximo número de tokens en la respuesta (ajustar según la longitud esperada)
            responseMimeType: "application/json", // ¡Pide explícitamente a Gemini que responda en JSON!
        };

        // Realiza la llamada a la API de Gemini
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
            safetySettings,
        });

        const apiResponse = result.response;
        const responseText = apiResponse.text(); // Obtiene el texto de la respuesta de Gemini

        console.log('Respuesta cruda de Gemini (texto):', responseText);

        // Intenta parsear el JSON de la respuesta de Gemini
        let parsedResponse;
        try {
            // Asegúrate de que la respuesta sea un JSON válido antes de parsear
            // A veces Gemini puede añadir texto extra, por lo que buscamos el primer y último corchete
           const jsonMatch = responseText.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
if (jsonMatch) {
  // Limpieza preventiva: dobla las barras invertidas para que LaTeX no rompa el JSON
 const textoCrudo = jsonMatch[0];

// 🔧 Intenta corregir el escape excesivo de Gemini
const textoLimpio = textoCrudo
  .replace(/\\\\/g, '\\') // convierte \\\\ en \ (dobles barras en una)
  .replace(/\\"/g, '"');   // corrige comillas escapadas excesivamente
  try {
    parsedResponse = JSON.parse(textoLimpio);
  } catch (e) {
    console.error('❌ Error al parsear JSON tras limpieza:', e);
    return json({ error: 'JSON parse error after cleanup', raw: textoLimpio }, { status: 500 });
  }
} else {
  console.error("No se encontró JSON válido en la respuesta de Gemini:", responseText);
  return json({ error: 'Respuesta de Gemini no contiene un JSON válido', raw: responseText }, { status: 500 });
}
        } catch (jsonParseError) {
            console.error("Error al parsear el JSON de Gemini:", jsonParseError);
            console.error("Respuesta cruda que intentó parsear:", responseText);
            return json({ error: 'Formato JSON inválido recibido de Gemini', details: jsonParseError.message, raw: responseText }, { status: 500 });
        }

        // Envía la respuesta JSON (ya parseada) de Gemini de vuelta al frontend
        return json(parsedResponse, { status: 200 });

    } catch (error) {
        console.error('Error al llamar a la API de Gemini desde el endpoint (+server.ts):', error);

        // Intenta extraer detalles del error de la API si es posible
        let errorMessage = 'Error desconocido al generar pregunta.';
        let statusCode = 500;

        if (error.status) { // SDK de Gemini puede adjuntar status al error
            statusCode = error.status;
            errorMessage = `Error de API Gemini: ${error.status} - ${error.message || 'Sin mensaje específico'}`;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return json({ error: 'Error del servidor al procesar la solicitud', details: errorMessage }, { status: statusCode });
    }
}