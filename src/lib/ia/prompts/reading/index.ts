import { generateCraftStructurePrompt } from './craftStructure';
import { generateInformationIdeasPrompt } from './informationIdeas';
import { generateStandardConventionsPrompt } from './standardConventions';
import { generateExpressionIdeasPrompt } from './expressionIdeas';
import { generateUnderlinedWordsPrompt } from './UnderlinedWords';

/**
 * Devuelve un prompt aleatorio de la sección Reading & Writing,
 * mezclando uniformemente entre las cuatro categorías.
 */
export function getRandomReadingPrompt(dificultad: string, tema: string, subtema: string): string {
const generadores = [
  { generador: generateCraftStructurePrompt, peso: 0.26 },
  { generador: generateInformationIdeasPrompt, peso: 0.22 },
  { generador: generateStandardConventionsPrompt, peso: 0.25 },
  { generador: generateExpressionIdeasPrompt, peso: 0.14 },
  { generador: generateUnderlinedWordsPrompt, peso: 0.13 }
];
  const rand = Math.random();
  let acumulado = 0;
  for (const { generador, peso } of generadores) {
    acumulado += peso;
    if (rand <= acumulado) {
      return generador(dificultad, tema, subtema);
    }
  }
  return generadores[0].generador(dificultad, tema, subtema); // Fallback
}