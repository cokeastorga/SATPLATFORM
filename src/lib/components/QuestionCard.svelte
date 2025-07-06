<script lang="ts">
  import type { PreguntaSAT } from '$lib/types/question';
  import MathText from '$lib/components/MathText.svelte';
  import TextOrMath from '$lib/components/TextOrMath.svelte';
  import { createEventDispatcher } from 'svelte';

  export let pregunta: PreguntaSAT;
  export let numero: number;
  export let testFinalizado: boolean = false;
  export let respuestasUsuario: Record<number, string>;

  const dispatch = createEventDispatcher<{
    respuesta: { idx: number; respuesta: string };
  }>();

  function seleccionarOpcion(opcion: string) {
    if (!testFinalizado && pregunta.opciones.includes(opcion)) {
      dispatch('respuesta', { idx: numero - 1, respuesta: opcion });
    }
  }

  $: respuesta = respuestasUsuario[numero - 1] ?? '';
  $: esCorrecta = respuesta === pregunta.respuestaCorrecta;
</script>

<div class="mb-6 p-6 border border-gray-200 rounded-xl shadow-sm bg-white animate-fade-in">
  <p class="text-sm text-gray-500 mb-2">
    📘 Materia: <strong>{pregunta.materia === 'matematicas' ? 'Matemáticas' : 'Reading and Writing'}</strong>
    | Categoría: <strong>{pregunta.categoria}</strong>
  </p>

  {#if pregunta.pasaje && pregunta.pasaje.trim().length > 0}
    <div class="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md">
      <h4 class="font-semibold text-blue-700 mb-2">Pasaje de Lectura:</h4>
      <TextOrMath content={pregunta.pasaje} />
    </div>
  {/if}

  {#if pregunta.formula && pregunta.formula.trim().length > 0}
    <div class="mb-4 px-4 py-3 bg-gray-50 rounded-md overflow-x-auto">
      <h4 class="font-semibold text-gray-700 mb-2">Fórmula:</h4>
      <MathText content={pregunta.formula} />
    </div>
  {/if}

  <h3 class="font-semibold text-gray-800 text-lg mb-4">
    {numero}. 
    {#if pregunta.materia === 'matematicas'}
      <MathText content={pregunta.enunciado} />
    {:else}
      <TextOrMath content={pregunta.enunciado} />
    {/if}
  </h3>

  <div class="space-y-2">
    {#each pregunta.opciones as opcion, index}
      <button
        class={`w-full text-left px-4 py-2 rounded-md border transition
          ${respuesta === opcion ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${testFinalizado
            ? opcion === pregunta.respuestaCorrecta
              ? 'border-green-600 bg-green-50 font-semibold'
              : respuesta === opcion && respuesta !== pregunta.respuestaCorrecta
                ? 'border-red-500 bg-red-50 text-red-700'
                : ''
            : ''}`}
        on:click={() => seleccionarOpcion(opcion)}
        disabled={testFinalizado}
        aria-label={`Opción ${index + 1}: ${opcion}`}
        aria-disabled={testFinalizado}
      >
        {#if pregunta.materia === 'matematicas'}
          <MathText content={opcion} inline />
        {:else}
          <TextOrMath content={opcion} inline />
        {/if}
        {#if testFinalizado && opcion === pregunta.respuestaCorrecta}
          <span class="ml-2">✅</span>
        {:else if testFinalizado && respuesta === opcion && respuesta !== pregunta.respuestaCorrecta}
          <span class="ml-2">❌</span>
        {/if}
      </button>
    {/each}
  </div>

  {#if testFinalizado}
    <div class="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
      <p class="mb-1">
        <strong>{esCorrecta ? '✅ ¡Correcto!' : '❌ Incorrecto.'}</strong>
      </p>
      <p>
        <em>Explicación:</em> 
        {#if pregunta.materia === 'matematicas'}
          <MathText content={pregunta.explicacion} />
        {:else}
          <TextOrMath content={pregunta.explicacion} />
        {/if}
      </p>
    </div>
  {/if}
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }

  .katex-content {
    font-size: 1.05rem;
    line-height: 1.6;
    overflow-x: auto;
    max-width: 100%;
    padding: 0.125rem 0;
  }

  button {
    word-break: break-word;
    white-space: normal;
  }
</style>