<script lang="ts">
  import { onMount } from 'svelte';
  import { generarPreguntaValida } from '$lib/ia/generarTest';
  import LoadingSpinner from './LoadingSpinner.svelte';
  import QuestionCard from './QuestionCard.svelte';

  export let dificultad: string = 'intermedio';

  let modulo = 1;
  let preguntasModulo1 = [];
  let preguntasModulo2 = [];
  let respuestas: Record<string, string> = {};
  let index = 0;
  let cargando = true;
  let finalizado = false;

  async function generarModulo(mod: number) {
    cargando = true;
    const preguntas: any[] = [];
    while (preguntas.length < 27) {
      const p = await generarPreguntaValida('reading and writing', dificultad);
      if (p) preguntas.push(p);
    }
    if (mod === 1) preguntasModulo1 = preguntas;
    else preguntasModulo2 = preguntas;
    index = 0;
    cargando = false;
  }

  function seleccionarRespuesta(respuesta: string) {
    const clave = `${modulo}-${index}`;
    respuestas[clave] = respuesta;
    if (index < 26) index++;
    else if (modulo === 1) modulo = 2;
    else finalizado = true;
  }

  onMount(() => {
    generarModulo(1);
  });
</script>

{#if cargando}
  <LoadingSpinner />
{:else if !finalizado}
  <div class="space-y-6">
    <h2 class="text-xl font-bold text-blue-800">Módulo {modulo} de 2</h2>
    <QuestionCard pregunta={(modulo === 1 ? preguntasModulo1 : preguntasModulo2)[index]} on:responder={(e) => seleccionarRespuesta(e.detail)} />
    <p class="text-sm text-gray-500">Pregunta {index + 1} de 27</p>
  </div>
{:else}
  <div class="text-center mt-10">
    <h2 class="text-2xl font-bold text-green-700 mb-4">✨ Test finalizado</h2>
    <p>Respondiste {Object.keys(respuestas).length} preguntas.</p>
    <p class="mt-2">Gracias por practicar con SATPLATFORM.</p>
  </div>
{/if}