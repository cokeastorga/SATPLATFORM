<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fade, scale } from 'svelte/transition';
import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';


  let cargando = true;
  let total = 800;
  let puntaje = 0;
  let porcentaje = 0;

  let preguntas = [];
  let respuestasUsuario: Record<number, string> = {};
  let respuestasCorrectas = 0;

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

    const maxPreguntas = data.maxPreguntas ?? preguntas.length;
    const puntajeMaximo = data.puntajeMaximo ?? 800;
    total = puntajeMaximo;

    puntaje = Math.round((respuestasCorrectas / maxPreguntas) * puntajeMaximo);
    porcentaje = Math.round((puntaje / total) * 100);
  } catch (e) {
    goto('/');
  }

  setTimeout(() => {
    cargando = false;
  }, 2000);
});



  function verResultados() {
  goto('/resultados');
}


  function volverAIntentar() {
    goto('/practice');
  }

 function colorPuntaje() {
  return porcentaje >= 90
    ? 'text-green-700'
    : porcentaje >= 70
    ? 'text-yellow-500'
    : 'text-red-500';
}

function mensajePuntaje() {
  return porcentaje >= 90
    ? '¡Excelente desempeño!'
    : porcentaje >= 70
    ? 'Buen intento, sigue practicando.'
    : 'Puedes mejorar, ¡no te rindas!';
}

function emoji() {
  return porcentaje >= 90 ? '🏅' : porcentaje >= 70 ? '🎖️' : '📘';
}



  function customFadeScale(node, { delay = 0, duration = 400 }) {
  return {
    delay,
    duration,
    css: t => `
      opacity: ${t};
      transform: scale(${0.9 + t * 0.1});
    `
  };
}

</script>

<svelte:head>
  <title>Resumen del Test</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 px-4">
  <div class="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg text-center">
    {#if cargando}
      <div class="animate-pulse">
       <LoadingSpinner mensaje="📊 Generando puntajes del test..." />

        <div class="h-10 bg-blue-200 rounded w-2/3 mx-auto mb-4"></div>
        <div class="h-6 bg-blue-100 rounded w-1/3 mx-auto"></div>
      </div>
    {:else}
      <div in:customFadeScale>

        <h1 class="text-3xl font-bold text-blue-700 mb-4">🎉 ¡Test Finalizado!</h1>
        <div class="flex justify-center mb-6">
          <svg class="w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="15"
            />
           <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke={
                porcentaje >= 90 ? '#16a34a' : porcentaje >= 70 ? '#eab308' : '#ef4444'
              }
              stroke-width="15"
              stroke-linecap="round"
              stroke-dasharray="440"
              stroke-dashoffset={440 - (440 * porcentaje) / 100}
              transform="rotate(-90 80 80)"
            />
            <text
              x="80"
              y="90"
              text-anchor="middle"
              class="text-2xl font-bold fill-current"
              fill="#1f2937"
            >
              {porcentaje}%
            </text>
          </svg>
        </div>

        <p class={`text-2xl font-bold ${colorPuntaje()}`}>{puntaje} / {total}</p>
        <p class="mt-2 text-gray-600">{mensajePuntaje()}</p>
        <div class="text-5xl mt-4">{emoji()}</div>

        <div class="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            on:click={verResultados}
            class="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            📊 Ver Resultados
          </button>
          <button
            on:click={volverAIntentar}
            class="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
          >
            🔁 Volver a Intentar
          </button>
        </div>
      </div>
    {/if}
  </div>
  
</div>
