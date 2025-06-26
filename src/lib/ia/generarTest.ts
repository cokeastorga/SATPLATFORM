import type { PreguntaSAT } from '$lib/types/question';
import { generateCraftStructurePrompt } from "$lib/ia/prompts/reading/craftStructure";
import { generateInformationIdeasPrompt } from "$lib/ia/prompts/reading/informationIdeas";
import { generateStandardConventionsPrompt } from "$lib/ia/prompts/reading/standardConventions";
import { generateExpressionIdeasPrompt } from "$lib/ia/prompts/reading/expressionIdeas";

// Helper para delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Error personalizado
class QuotaExceededError extends Error {
  retryAfterSeconds: number;
  constructor(message: string, retryAfterSeconds: number) {
    super(message);
    this.name = 'QuotaExceededError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function normalizarMateria(m: string): string {
  const map: Record<string, string> = {
    math: 'matematicas',
    matemáticas: 'matematicas',
    'reading and writing': 'reading and writing',
    rw: 'reading and writing'
  };
  return map[m.toLowerCase().trim()] ?? m.toLowerCase().trim();
}


function getPromptReadingAndWriting(dificultad: string): string {
  const generadores = [
    generateCraftStructurePrompt,
    generateInformationIdeasPrompt,
    generateStandardConventionsPrompt,
    generateExpressionIdeasPrompt
  ];

  const generador = generadores[Math.floor(Math.random() * generadores.length)];
  return generador(dificultad);
}

function mapDifficulty(level: string): string {
  const map: Record<string, string> = {
    easy: 'easy',
    medium: 'medium',
    hard: 'challenging'
  };
  return map[level.toLowerCase().trim()] ?? 'medium';
}

// Generar pregunta individual
export async function generarUnaPregunta(materia: string, dificultad: string): Promise<PreguntaSAT | null> {
const materiaNormalizada = normalizarMateria(materia);
  const dificultadPrompt = mapDifficulty(dificultad);

  try {
    const response = await fetch('/api/generar-pregunta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ materia: materiaNormalizada, dificultad: dificultadPrompt }),

  });


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 429 && errorData.details) {
        const match = errorData.details.match(/"retryDelay":"(\d+)s"/);
        const retryAfter = match ? parseInt(match[1], 10) : 30;
        throw new QuotaExceededError(`Cuota excedida. Reintenta en ${retryAfter}s.`, retryAfter);
      }

      throw new Error(`Error ${response.status}: ${errorData.error || 'Error desconocido'}`);
    }

    let resultado;
    try {
      resultado = await response.json();
    } catch (parseError) {
      console.error('❌ Error al parsear JSON:', parseError);
      return null;
    }

    const p = Array.isArray(resultado) ? resultado[0] : resultado;

    if (
      !p ||
      typeof p.pregunta !== 'string' ||
      (!Array.isArray(p.opciones) && typeof p.opciones !== 'object') ||
      typeof p.respuesta !== 'string'
    ) {
      console.warn('❌ Pregunta malformada o incompleta:', p);
      return null;
    }

    const opcionesLimpias = Array.isArray(p.opciones)
      ? p.opciones.map((opt: any) => String(opt).trim()).filter(Boolean)
      : Object.values(p.opciones).map((opt: any) => String(opt).trim()).filter(Boolean);

    const respuesta = String(p.respuesta).trim();

    if (!opcionesLimpias.includes(respuesta)) {
      console.warn('❌ La respuesta no coincide con ninguna opción.');
      return null;
    }

    const preguntaFormateada: PreguntaSAT = {
      enunciado: p.pregunta.trim(),
      opciones: opcionesLimpias,
      respuestaCorrecta: respuesta,
      explicacion:
        typeof p.explicacion === 'string' && p.explicacion.trim().length > 5
          ? p.explicacion.trim()
          : '⚠️ Explicación no disponible.',
    };

    if (typeof p.pasaje === 'string' && p.pasaje.trim().length > 0) {
      preguntaFormateada.pasaje = p.pasaje.trim();
    }

    return preguntaFormateada;
  } catch (err: any) {
    if (err instanceof QuotaExceededError) {
      throw err;
    }

    console.error('❌ Error generando pregunta:', err);
    return null;
  }
}

// Función con reintentos y backoff
export async function generarPreguntaValida(materia: string, dificultad: string): Promise<PreguntaSAT> {
  const maxIntentos = 5;
  let intentos = 0;
  const baseDelay = 1000;

  while (intentos < maxIntentos) {
    try {
      const pregunta = await generarUnaPregunta(materia, dificultad);

      if (
        pregunta &&
        typeof pregunta.enunciado === 'string' &&
        Array.isArray(pregunta.opciones) &&
        pregunta.opciones.length === 4 &&
        typeof pregunta.respuestaCorrecta === 'string' &&
        pregunta.opciones.includes(pregunta.respuestaCorrecta)
      ) {
        return pregunta;
      } else {
        console.warn('❌ Pregunta inválida. Reintentando...');
      }
    } catch (err: any) {
      if (err instanceof QuotaExceededError) {
        console.warn(`⏳ Esperando ${err.retryAfterSeconds}s por cuota...`);
        await delay(err.retryAfterSeconds * 1000 + 1000);
        continue;
      }
      console.error('❌ Error inesperado:', err);
    }

    intentos++;
    if (intentos < maxIntentos) {
      const waitTime = baseDelay * Math.pow(2, intentos - 1);
      console.warn(`🕒 Reintento ${intentos} en ${waitTime / 1000}s...`);
      await delay(waitTime);
    }
  }

  throw new Error(`❌ Falló tras ${maxIntentos} intentos: no se pudo generar una pregunta válida.`);
}
