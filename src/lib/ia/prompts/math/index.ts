import { generateAlgebraPrompt } from './algebra';
import { generateGeometryPrompt } from './geometry';
import { generateProblemSolvingPrompt } from './problemSolving';
import { generateAdvancedMathPrompt } from './advancedMath';

const generators = [
  generateAlgebraPrompt,
  generateGeometryPrompt,
  generateProblemSolvingPrompt,
  generateAdvancedMathPrompt
];

export function getRandomMathPrompt(dificultad: string): string {
  const generator = generators[Math.floor(Math.random() * generators.length)];
  return generator(dificultad);
}
