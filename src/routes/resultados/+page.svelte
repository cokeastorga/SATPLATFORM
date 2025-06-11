<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
   import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

  let preguntas: any[] = [];
  let respuestasUsuario: Record<number, string> = {};
  let respuestasCorrectas = 0;
  let puntaje = 0;
  let cargando = true;

 onMount(() => {
  const dataString = localStorage.getItem('resultadosTest');

  if (!dataString) {
    goto('/');
    return;
  }

  try {
    const data = JSON.parse(dataString);
    preguntas = data.preguntas;
    respuestasUsuario = data.respuestasUsuario;
    respuestasCorrectas = data.respuestasCorrectas;
    puntaje = Math.round((respuestasCorrectas / preguntas.length) * 1000 + 400);
  } catch (error) {
    console.error('Error leyendo resultados:', error);
    goto('/');
  }

  // Simulamos un pequeño tiempo de carga
  setTimeout(() => {
    cargando = false;
  }, 1000);
});


  function esCorrecta(i: number) {
    return respuestasUsuario[i + 1] === preguntas[i].respuestaCorrecta;
  }

  function volverResumen() {
    goto('/resumen');
  }
</script>

<svelte:head>
  <title>Resultados del Test</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
  <div class="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 transition-all">
    {#if cargando}
       <LoadingSpinner mensaje="🧠 Calculando resultados..." />
    {:else}
      <h1 class="text-3xl font-bold text-center text-blue-700 mb-4" in:fade={{ duration: 500 }}>
        📊 Resultados del Test
      </h1>

      <div class="text-center mb-8" in:fade={{ delay: 200, duration: 600 }}>
        <p class="text-lg text-gray-700">
          Respondiste correctamente 
          <strong class="text-green-600">{respuestasCorrectas}</strong> de 
          <strong class="text-blue-700">{preguntas.length}</strong> preguntas.
        </p>
        <p class="text-xl font-bold text-indigo-600 mt-2">
          🧠 Puntaje final: {puntaje}
        </p>
      </div>

      <div class="space-y-6">
        {#each preguntas as pregunta, i (i)}
          <div
            class={`p-6 rounded-xl border-2 shadow-sm transition-all bg-white ${
              esCorrecta(i) ? 'border-green-300' : 'border-red-300'
            }`}
            in:fade={{ delay: 300 + i * 100, duration: 500 }}
          >
            <div class="flex items-start gap-3">
              <div class="text-2xl mt-1">
                {esCorrecta(i) ? '✅' : '❌'}
              </div>
              <div class="flex-1">
                <h2 class="text-md font-semibold text-gray-800 mb-2">
                  {i + 1}. {pregunta.enunciado}
                </h2>

                <p class="text-sm mb-1">
                  <span class="font-medium">Tu respuesta:</span>
                  <span class={esCorrecta(i) ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                    {respuestasUsuario[i + 1] || 'Sin responder'}
                  </span>
                </p>

                {#if !esCorrecta(i)}
                  <p class="text-sm text-gray-700 mb-1">
                    ✅ <strong>Respuesta correcta:</strong> {pregunta.respuestaCorrecta}
                  </p>
                {/if}

                <p class="text-sm text-gray-600 italic">
                  💡 {pregunta.explicacion}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <div class="mt-10 text-center" in:fade={{ delay: 300, duration: 500 }}>
        <button
          class="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          on:click={volverResumen}
        >
          ⬅️ Volver al resumen
        </button>
      </div>
    {/if}
  </div>
</div>
