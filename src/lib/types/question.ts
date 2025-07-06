/**
 * A non-empty string type to enforce non-empty values.
 */
type NonEmptyString = string & { __brand: 'NonEmptyString' };

/**
 * Represents a SAT-style question for math or reading and writing sections.
 */
export interface PreguntaSAT {
  /**
   * The question statement or problem description.
   * Must be a non-empty string.
   */
  enunciado: NonEmptyString;

  /**
   * Exactly 4 unique answer choices.
   */
  opciones: [string, string, string, string];

  /**
   * The correct answer, matching exactly one of the options in `opciones`.
   * Must be a non-empty string.
   */
  respuestaCorrecta: NonEmptyString;

  /**
   * A detailed explanation of the solution (3–5 sentences recommended).
   * Must be a non-empty string.
   */
  explicacion: NonEmptyString;

  /**
   * Optional context or passage for reading/writing questions (80–120 words for most categories,
   * 20–50 words for 'Standard English Conventions' or math word problems).
   * Set to empty string if not applicable.
   */
  pasaje?: string;

  /**
   * Optional mathematical formula or equation in plain text (e.g., "x^2 + 2x + 1").
   * Set to empty string if not applicable.
   */
  formula?: string;

  /**
   * The subject area of the question.
   */
  materia: 'matematicas' | 'reading and writing';

  /**
   * Specific category within the subject (e.g., "Algebra", "Craft and Structure").
   * Should be provided for all valid questions.
   */
  categoria:
    | 'Algebra'
    | 'Passport to Advanced Math'
    | 'Geometry and Measurement'
    | 'Problem Solving and Data Analysis'
    | 'Craft and Structure'
    | 'Information and Ideas'
    | 'Standard English Conventions'
    | 'Expression of Ideas';
}