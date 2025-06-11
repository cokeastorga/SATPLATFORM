// src/lib/ia/generarTest.ts
import type { PreguntaSAT } from '$lib/types/question';

// --- Helper para crear un delay ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Clase de error personalizada para exceso de cuota ---
class QuotaExceededError extends Error {
    retryAfterSeconds: number;
    constructor(message: string, retryAfterSeconds: number) {
        super(message);
        this.name = 'QuotaExceededError';
        this.retryAfterSeconds = retryAfterSeconds;
    }
}

// --- Función para generar una pregunta individual ---
export async function generarUnaPregunta(materia: string, dificultad: string): Promise<PreguntaSAT | null> {
    let prompt: string;

    const materiaNormalizada = materia.toLowerCase().trim();
    const dificultadNormalizada = dificultad.toLowerCase().trim();

    let dificultadPrompt: string;
    switch (dificultadNormalizada) {
        case 'easy':
            dificultadPrompt = 'easy';
            break;
        case 'medium':
            dificultadPrompt = 'medium';
            break;
        case 'hard':
            dificultadPrompt = 'challenging';
            break;
        default:
            dificultadPrompt = 'medium'; // Por defecto a medium si no se reconoce
    }

    // --- PROMPTS PARA GEMINI ---
    // ¡Ajusta y afina estos prompts para que Gemini genere exactamente el JSON que necesitas!
    // Recuerda que ahora le pedimos a Gemini que responda en JSON directamente desde el +server.ts

    if (materiaNormalizada === 'reading') {
        prompt = `
You are an SAT practice test question generator.
Your task is to generate ONE SAT-style reading question, including a passage, options, and explanation.
The output MUST be a JSON array containing a single object, like this:

[
  {
    "pasaje": "A short to medium-length reading passage (50-150 words) relevant to SAT topics.",
    "pregunta": "The SAT-style multiple-choice question.",
    "opciones": ["Option A", "Option B", "Option C", "Option D"],
    "respuesta": "Correct Answer (must match one of the options)",
    "explicacion": "A brief explanation justifying the correct answer based on the passage, suitable for a high school student."
  }
]

Rules:
- Return only the JSON array. No extra text, no markdown backticks, no explanations outside JSON.
- Use strict JSON format (double quotes, no trailing commas).
- Escape any double quotes within string values using a backslash (\\").
- The passage should be concise (50-150 words) and relevant to SAT-style topics.
- The question must be directly and unambiguously answerable from the provided passage.
- Options must be 4 unique strings.
- The correct answer must exactly match one of the options.
- Ensure the complexity matches the specified difficulty.
- The explanation must be clear, concise, and justify the answer based on the passage.

📚 Subject: Reading
🧠 Difficulty: ${dificultadPrompt}
`;
    } else {
        // PROMPT para otras materias (sin pasaje)
        prompt = `
You are a question generator for official SAT practice tests.
Your task is to generate ONE original multiple-choice SAT-style question (e.g., Math, Writing, Vocabulary).
The output MUST be a JSON array containing a single object, like this:

[
  {
    "pregunta": "The concise, well-structured question text.",
    "opciones": ["Option A", "Option B", "Option C", "Option D"],
    "respuesta": "Correct Answer (must match one of the options)",
    "explicacion": "A clear and complete explanation walking through the solution steps, suitable for a high school student."
  }
]

Rules:
- Return only the JSON array. No extra text, no markdown backticks, no explanations outside JSON.
- Use strict JSON format (double quotes, no trailing commas).
- Escape any double quotes within string values using a backslash (\\").
- The question must be original and relevant to SAT subjects.
- Options must be 4 unique strings.
- The correct answer must exactly match one of the options.
- Ensure the complexity matches the specified difficulty.
- The explanation must be clear, concise, and justify the answer.

📚 Subject: ${materia}
🧠 Difficulty: ${dificultadPrompt}
`;
    }

    try {
        const response = await fetch('/api/generar-pregunta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Error desde el endpoint /api/generar-pregunta:', errorData);

            // Verificar si el error es 429 y si incluye un retryDelay
            if (response.status === 429 && errorData.details) {
                const match = errorData.details.match(/"retryDelay":"(\d+)s"/);
                const retryAfter = match ? parseInt(match[1], 10) : 30; // Default a 30s si no se encuentra
                throw new QuotaExceededError(`Excedido límite de cuota (429). Reintentar en ${retryAfter} segundos.`, retryAfter);
            }

            throw new Error(`Error en el endpoint: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }

        const resultado = await response.json();
        console.log('✅ Respuesta final de la API (procesada por tu endpoint):', resultado);

        const p = Array.isArray(resultado) ? resultado.find((q: any) => q.pregunta && q.opciones && q.respuesta) : resultado;

        if (!p || !p.pregunta || !Array.isArray(p.opciones) || p.opciones.length !== 4 || !p.respuesta) {
            console.warn('❌ No se encontró una pregunta válida con el formato esperado en la respuesta procesada.');
            console.warn('Respuesta recibida:', resultado);
            return null;
        }

        const preguntaFormateada: PreguntaSAT = {
            enunciado: p.pregunta.trim() ?? 'Pregunta sin texto',
            opciones: p.opciones.map((opt: string) => typeof opt === 'string' ? opt.trim() : String(opt)),
            respuestaCorrecta: typeof p.respuesta === 'string' ? p.respuesta.trim() : String(p.respuesta),
            explicacion:
                typeof p.explicacion === 'string' && p.explicacion.trim().length > 5
                    ? p.explicacion.trim()
                    : '⚠️ Esta pregunta no tiene una explicación clara.'
        };

        if (p.pasaje && typeof p.pasaje === 'string' && p.pasaje.trim().length > 0) {
            preguntaFormateada.pasaje = p.pasaje.trim();
        }

        return preguntaFormateada;

    } catch (err: any) { // Usamos 'any' para manejar el tipo personalizado QuotaExceededError
        console.error('❌ Error generando pregunta (desde frontend):', err);
        // Si es un error de cuota, lanzamos el error personalizado para que generarPreguntaValida lo capture
        if (err instanceof QuotaExceededError) {
            throw err;
        }
        // Para otros errores, devolvemos null para reintentar (con backoff)
        return null;
    }
}

// --- Función para generar una pregunta válida (con reintentos y backoff) ---
export async function generarPreguntaValida(materia: string, dificultad: string): Promise<PreguntaSAT> {
    const maxIntentos = 5;
    let intentos = 0;
    let baseDelay = 1000; // 1 segundo de retraso inicial

    while (intentos < maxIntentos) {
        try {
            const pregunta = await generarUnaPregunta(materia, dificultad);
            if (
                pregunta &&
                typeof pregunta.enunciado === 'string' &&
                pregunta.enunciado.trim().length > 0 &&
                Array.isArray(pregunta.opciones) &&
                pregunta.opciones.length === 4 &&
                typeof pregunta.respuestaCorrecta === 'string'
            ) {
                const opcionesValidas = pregunta.opciones.every(opt => typeof opt === 'string' && opt.trim().length > 0);
                if (opcionesValidas) {
                    return pregunta;
                } else {
                    console.warn('❌ Opciones de pregunta inválidas (vacías o no strings). Reintentando...');
                }
            } else {
                console.warn('❌ Formato de pregunta inválido. Reintentando...');
            }
        } catch (err: any) {
            if (err instanceof QuotaExceededError) {
                console.warn(`⚠️ ${err.message} Esperando ${err.retryAfterSeconds}s.`);
                await delay(err.retryAfterSeconds * 1000 + 1000); // Esperar el tiempo sugerido + 1 segundo extra de seguridad
                // No incrementar intentos si fue un error de cuota con sugerencia de retryDelay,
                // ya que es un problema de ritmo, no de formato.
                // Podrías ajustar esta lógica dependiendo de si quieres que los errores de cuota cuenten como un "intento fallido".
                // Para este caso, asumimos que no queremos agotar los 5 intentos si solo es un problema de velocidad.
                continue; // Reintentar inmediatamente después del delay
            } else {
                console.error('❌ Error inesperado durante la generación de pregunta:', err);
            }
        }

        intentos++;
        if (intentos < maxIntentos) {
            const waitTime = baseDelay * Math.pow(2, intentos - 1); // Backoff exponencial
            console.warn(`⏳ Esperando ${waitTime / 1000}s antes del intento ${intentos + 1}...`);
            await delay(waitTime);
        }
    }

    throw new Error(`❌ No se pudo generar una pregunta válida tras ${maxIntentos} intentos.`);
}