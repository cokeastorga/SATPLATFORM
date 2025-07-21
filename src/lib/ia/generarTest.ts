import type { PreguntaSAT } from '$lib/types/question';
import { generateCraftStructurePrompt } from '$lib/ia/prompts/reading/craftStructure';
import { generateInformationIdeasPrompt } from '$lib/ia/prompts/reading/informationIdeas';
import { generateStandardConventionsPrompt } from '$lib/ia/prompts/reading/standardConventions';
import { generateExpressionIdeasPrompt } from '$lib/ia/prompts/reading/expressionIdeas';
import { generateAlgebraPrompt } from '$lib/ia/prompts/math/algebra';
import { generateAdvancedMathPrompt } from '$lib/ia/prompts/math/advancedMath';
import { generateGeometryPrompt } from '$lib/ia/prompts/math/geometry';
import { generateProblemSolvingPrompt } from '$lib/ia/prompts/math/problemSolving';
import { temasStore } from '$lib/stores/temasStore'; // agrega esta línea arriba


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class QuotaExceededError extends Error {
  retryAfterSeconds: number;
  constructor(message: string, retryAfterSeconds: number) {
    super(message);
    this.name = 'QuotaExceededError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function normalizarMateria(m: string): PreguntaSAT['materia'] {
  const map: Record<string, PreguntaSAT['materia']> = {
    math: 'matematicas',
    matemáticas: 'matematicas',
    matematicas: 'matematicas',
    'reading and writing': 'reading and writing',
    'reading & writing': 'reading and writing',
    rw: 'reading and writing'
  };
  const normalized = map[m.toLowerCase().trim()];
  if (!normalized || !['matematicas', 'reading and writing'].includes(normalized)) {
    throw new Error(`Materia inválida: ${m}`);
  }
  return normalized;
}

function getPrompt(materia: PreguntaSAT['materia'], dificultad: string, tema: string, subtema: string): string {
  const readingPrompts = [
    generateCraftStructurePrompt,
    generateInformationIdeasPrompt,
    generateStandardConventionsPrompt,
    generateExpressionIdeasPrompt
  ];
  const mathPrompts = [
    generateAlgebraPrompt,
    generateAdvancedMathPrompt,
    generateGeometryPrompt,
    generateProblemSolvingPrompt
  ];
  const generadores = materia === 'matematicas' ? mathPrompts : readingPrompts;
  const generador = generadores[Math.floor(Math.random() * generadores.length)];
  // Ahora cada generador debe aceptar también tema y subtema
  return generador(dificultad, tema, subtema);
}


function mapDifficulty(level: string): string {
  const map: Record<string, string> = {
    easy: 'easy',
    fácil: 'easy',
    medium: 'medium',
    medio: 'medium',
    hard: 'challenging',
    difícil: 'challenging'
  };
  return map[level.toLowerCase().trim()] ?? 'medium';
}

function normalizarOpciones(opciones: string[] | Record<string, string>): [string, string, string, string] | null {
  const opcionesArray = Array.isArray(opciones)
    ? opciones
    : Object.values(opciones).map(opt => String(opt).trim());

  const opcionesLimpias = opcionesArray
    .map(opt => String(opt).trim())
    .filter(opt => opt.length > 0);

  if (opcionesLimpias.length !== 4 || new Set(opcionesLimpias).size !== 4) {
    console.warn('❌ Opciones inválidas: deben ser 4 opciones únicas.', opcionesLimpias);
    return null;
  }

  return opcionesLimpias as [string, string, string, string];
}

export async function generarUnaPregunta(materia: string, dificultad: string): Promise<PreguntaSAT | null> {
  let materiaNormalizada: PreguntaSAT['materia'];
  try {
    materiaNormalizada = normalizarMateria(materia);
  } catch (err) {
    console.error('❌ Error en materia:', err.message);
    return null;
  }

  const dificultadPrompt = mapDifficulty(dificultad);
 const temaObj = temasStore.nextTema();
const tema = temaObj?.tema || 'General';
const subtema = temaObj?.subtema || 'General';
const prompt = getPrompt(materiaNormalizada, dificultadPrompt, tema, subtema);

  try {
    const response = await fetch('/api/generar-pregunta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materia: materiaNormalizada, dificultad: dificultadPrompt, prompt })
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

    // Validación base
    if (
      !p ||
      typeof p.pregunta !== 'string' || p.pregunta.trim().length === 0 ||
      (!Array.isArray(p.opciones) && typeof p.opciones !== 'object') ||
      typeof p.respuesta !== 'string' || p.respuesta.trim().length === 0 ||
      typeof p.explicacion !== 'string' || p.explicacion.trim().length === 0 ||
      typeof p.categoria !== 'string' ||
      ![
        'Algebra',
        'Passport to Advanced Math',
        'Geometry and Measurement',
        'Problem Solving and Data Analysis',
        'Craft and Structure',
        'Information and Ideas',
        'Standard English Conventions',
        'Expression of Ideas'
      ].includes(p.categoria)
    ) {
      console.warn('❌ Pregunta malformada o incompleta:', p);
      return null;
    }

    const opcionesLimpias = normalizarOpciones(p.opciones);
    if (!opcionesLimpias) {
      return null;
    }

    const respuesta = p.respuesta.trim();
    if (!opcionesLimpias.includes(respuesta)) {
      console.warn('❌ La respuesta no coincide con ninguna opción:', respuesta, opcionesLimpias);
      return null;
    }

    // Validar longitud del pasaje según la materia y categoría
    let pasajeValido = true;
    if (typeof p.pasaje === 'string' && p.pasaje.trim().length > 0) {
      const wordCount = p.pasaje.trim().split(/\s+/).length;
      if (materiaNormalizada === 'reading and writing') {
        const isStandardConventions = p.categoria === 'Standard English Conventions';
        const expectedWordCount = isStandardConventions ? [25, 120] : [30, 120];
        if (wordCount < expectedWordCount[0] || wordCount > expectedWordCount[1]) {
          console.warn(`❌ Pasaje inválido: longitud fuera del rango (${expectedWordCount[0]}–${expectedWordCount[1]} palabras).`);
          pasajeValido = false;
        }
      } else if (materiaNormalizada === 'matematicas') {
        if (wordCount < 20 || wordCount > 50) {
          console.warn('❌ Pasaje inválido: longitud fuera del rango (20–50 palabras) para matemáticas.');
          pasajeValido = false;
        }
      }
    }

    if (!pasajeValido) {
      return null;
    }

    // Ensamblar objeto PreguntaSAT
    const preguntaFormateada: PreguntaSAT = {
      enunciado: p.pregunta.trim() as NonEmptyString,
      opciones: opcionesLimpias,
      respuestaCorrecta: respuesta as NonEmptyString,
      explicacion: p.explicacion.trim() as NonEmptyString,
      materia: materiaNormalizada,
      categoria: p.categoria as PreguntaSAT['categoria']
    };

    if (typeof p.pasaje === 'string' && p.pasaje.trim().length > 0) {
      preguntaFormateada.pasaje = p.pasaje.trim();
    }

    if (typeof p.formula === 'string' && p.formula.trim().length > 0) {
      preguntaFormateada.formula = p.formula.trim();
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

export async function generarPreguntaValida(materia: string, dificultad: string): Promise<PreguntaSAT> {
  const maxIntentos = 5;
  let intentos = 0;
  const baseDelay = 1000;

  while (intentos < maxIntentos) {
    try {
      const pregunta = await generarUnaPregunta(materia, dificultad);
      if (
        pregunta &&
        typeof pregunta.enunciado === 'string' && pregunta.enunciado.length > 0 &&
        pregunta.opciones.length === 4 &&
        typeof pregunta.respuestaCorrecta === 'string' && pregunta.respuestaCorrecta.length > 0 &&
        pregunta.opciones.includes(pregunta.respuestaCorrecta) &&
        typeof pregunta.explicacion === 'string' && pregunta.explicacion.length > 0 &&
        ['matematicas', 'reading and writing'].includes(pregunta.materia) &&
        pregunta.categoria
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