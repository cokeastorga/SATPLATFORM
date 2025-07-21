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
    { generador: generateCraftStructurePrompt, peso: 0.28 }, // 26–30%
    { generador: generateInformationIdeasPrompt, peso: 0.23 }, // 20–26%
    { generador: generateStandardConventionsPrompt, peso: 0.26 }, // 24–28%
    { generador: generateExpressionIdeasPrompt, peso: 0.20 },  // 18–22%
    { generador: generateUnderlinedWordsPrompt, peso: 0.20 }  // 18–22%
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