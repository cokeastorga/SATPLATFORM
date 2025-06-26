export interface PreguntaSAT {
  enunciado: string;
  opciones: string[];
  respuestaCorrecta: string;
  explicacion: string;
  pasaje?: string;
  formula?: string; 
  categoria?: string; 
}
