import { generateCraftStructurePrompt } from './craftStructure';
import { generateInformationIdeasPrompt } from './informationIdeas';
import { generateStandardConventionsPrompt } from './standardConventions';
import { generateExpressionIdeasPrompt } from './expressionIdeas';

/**
 * Devuelve un prompt aleatorio de la sección Reading & Writing,
 * mezclando uniformemente entre las cuatro categorías.
 */
export function getPromptReadingAndWriting(dificultad: string): string {
  const generadores = [
    generateCraftStructurePrompt,
    generateInformationIdeasPrompt,
    generateStandardConventionsPrompt,
    generateExpressionIdeasPrompt
  ];

  const generadorAleatorio = generadores[Math.floor(Math.random() * generadores.length)];
  return generadorAleatorio(dificultad);
}
