import { generateGeometryPrompt } from './geometry';
import { generateAlgebraPrompt } from './algebra';
import { generateAdvancedMathPrompt } from './advancedMath';
import { generateProblemSolvingPrompt } from './problemSolving';

const generators = [
  generateGeometryPrompt,
  generateAlgebraPrompt,
  generateAdvancedMathPrompt,
  generateProblemSolvingPrompt
];

export function getRandomMathPrompt(dificultad: string): string {
  const generator = generators[Math.floor(Math.random() * generators.length)];
  return generator(dificultad);
}
