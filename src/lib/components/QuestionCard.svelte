<script lang="ts">
  // Importa la interfaz PreguntaSAT desde tu archivo de tipos
  // Asegúrate de que la ruta sea correcta si tu interfaz está en otro lugar
  import type { PreguntaSAT } from '$lib/types/question'; 
  import MathText from '$lib/components/MathText.svelte';

  import TextOrMath from '$lib/components/TextOrMath.svelte';

  // Ahora tipamos 'pregunta' usando la interfaz PreguntaSAT
  export let pregunta: PreguntaSAT;

  export let numero: number;
  export let testFinalizado: boolean = false;
  export let respuestasUsuario: Record<number, string>;
  export let onRespuesta: (index: number, respuesta: string) => void;

  function seleccionarOpcion(opcion: string) {
    if (!testFinalizado) {
      // Importante: tu `onRespuesta` en +page.svelte usa `preguntaActual` como índice,
      // que es 0-based. Aquí `numero` es 1-based, así que ajustamos.
      onRespuesta(numero - 1, opcion); // Usa numero - 1 para que el índice coincida con el array 'preguntas'
    }
  }


  

  // Las propiedades reactivas que tenías están bien
  $: respuesta = respuestasUsuario[numero - 1]; 
  $: esCorrecta = respuesta === pregunta.respuestaCorrecta;
</script>

<div class="mb-6 p-6 border border-gray-200 rounded-xl shadow-sm bg-white animate-fade-in">
  {#if pregunta.pasaje && pregunta.pasaje.trim().length > 0}
    <div class="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md">
      <h4 class="font-semibold text-blue-700 mb-2">Pasaje de Lectura:</h4>
      <TextOrMath content={pregunta.pasaje} />
    </div>
  {/if}

  <h3 class="font-semibold text-gray-800 text-lg mb-4">
    {numero}. <TextOrMath content={pregunta.enunciado} />
  </h3>

  <div class="space-y-2">
    {#each pregunta.opciones as opcion}
      <button
        class={`w-full text-left px-4 py-2 rounded-md border transition
          ${respuesta === opcion ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${testFinalizado
            ? opcion === pregunta.respuestaCorrecta
              ? 'border-green-600 bg-green-50 font-semibold'
              : respuesta === opcion
                ? 'border-red-500 bg-red-50 text-red-700'
                : ''
            : ''}`}
        on:click={() => seleccionarOpcion(opcion)}
        disabled={testFinalizado}
      >
        <TextOrMath content={opcion} inline />
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
      <p><em>Explicación:</em> <TextOrMath content={pregunta.explicacion} /></p>
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
</style>