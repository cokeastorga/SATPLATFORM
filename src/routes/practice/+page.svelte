<script lang="ts">
  import { goto } from '$app/navigation';
  import StepIndicator from '$lib/components/StepIndicator.svelte';
  import StepSelector from '$lib/components/StepSelector.svelte';
  import DifficultySelector from '$lib/components/DifficultySelector.svelte';
  import QuestionCard from '$lib/components/QuestionCard.svelte';
  import FinalizarTestButton from '$lib/components/FinalizarTestButton.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import type { PreguntaSAT } from '$lib/types/question';
  import { generarPreguntaValida } from '$lib/ia/generarTest';
  import Timer from '$lib/components/Timer.svelte';
  import { page } from '$app/stores';
import { onMount } from 'svelte';

  
let modo = 'liviano'; // por defecto
let cantidad = 5;

onMount(() => {
  const modoParam = $page.url.searchParams.get('modo');
  if (modoParam === 'ensayo' || modoParam === 'desafio') {
    modo = modoParam;
  }

  // Establecer cantidad base según modo
  if (modo === 'ensayo') cantidad = 20;
  if (modo === 'desafio') cantidad = 49; // este valor se ajustará por materia más adelante
});


  let paso = 1;
  let materiaSeleccionada: string = '';
  let nivelSeleccionado: string = '';
  // Ahora tipamos 'preguntas' como un Array de PreguntaSAT
  let tiempoTotalSegundos: number = 0;
  let maxPreguntas: number = 3; // valor por defecto temporal
  let puntajeMaximo: number = 800; // por defecto

  let preguntas: Array<PreguntaSAT> = [];
  let respuestasUsuario: Record<number, string> = {};
  let testFinalizado = false;
  let cargando = false;
  let preguntaActual = 0;

  async function generarSiguientePregunta() {
  if (preguntas.length >= maxPreguntas) return;

  cargando = true;
  try {
    const nueva = await generarPreguntaValida(materiaSeleccionada, nivelSeleccionado);
    if (nueva) {
      preguntas = [...preguntas, nueva];
      preguntaActual = preguntas.length - 1;
    }
  } catch (error) {
    console.error('❌ Error generando nueva pregunta:', error);
  } finally {
    cargando = false;
  }
}


function calcularTiempoPorPregunta(cantidad: number): number {
  // Puedes ajustar la lógica según dificultad real
  if (cantidad <= 5) return 1 * 60 * cantidad; // 1 minuto por pregunta
  if (cantidad <= 20) return 1.25 * 60 * cantidad; // 1:15 min por pregunta
  return 1.45 * 60 * cantidad; // Para tests largos, hasta 1:30 min por pregunta
}


  // Bloque reactivo para disparar la generación inicial de preguntas
  // cuando el usuario llega al Paso 3 y el array de preguntas está vacío.
$: if (paso === 3 && preguntas.length === 0 && !cargando) {
  const materia = materiaSeleccionada.toLowerCase().trim();

  if (materia === 'math' || materia === 'matemáticas') {
    if (modo === 'liviano') maxPreguntas = 5;
    else if (modo === 'ensayo') maxPreguntas = 20;
    else if (modo === 'desafio') maxPreguntas = 44;
  } else if (materia === 'reading' || materia === 'reading and writing') {
    if (modo === 'liviano') maxPreguntas = 5;
    else if (modo === 'ensayo') maxPreguntas = 20;
    else if (modo === 'desafio') maxPreguntas = 49;
  }

  tiempoTotalSegundos = calcularTiempoPorPregunta(maxPreguntas);
  puntajeMaximo = 800;

  generarSiguientePregunta(); // solo una
}






  // --- Lógica de Navegación ---

  async function siguientePregunta() {
  if (preguntaActual < preguntas.length - 1) {
    preguntaActual++;
  } else if (preguntas.length < maxPreguntas) {
    await generarSiguientePregunta();
  } else {
    console.log('✅ Se alcanzó el número máximo de preguntas. Mostrar botón de finalizar.');
  }
}


  function anteriorPregunta() {
    if (preguntaActual > 0) {
      preguntaActual--;
      asegurarBufferPreguntas(); // Llama a precargar por si el usuario va hacia atrás
    }
  }

  // --- Manejo de Pasos (UI Flow) ---

  async function siguientePaso() {
    paso += 1;
    // La generación de preguntas inicial se dispara automáticamente cuando paso === 3
    // gracias al bloque reactivo ':$'
   
  }

  function pasoAnterior() {
    paso -= 1;
  }

  function finalizarTest() {
    const respuestasCorrectas = preguntas.reduce((acc, pregunta, i) => {
      return respuestasUsuario[i] === pregunta.respuestaCorrecta ? acc + 1 : acc;
    }, 0);

    const resultadosTest = {
      preguntas,
      respuestasUsuario,
      respuestasCorrectas,
      maxPreguntas,
      puntajeMaximo,
      materiaSeleccionada
    };

    localStorage.setItem('resultadosTest', JSON.stringify(resultadosTest));
    goto('/resumen');
  }

</script>

<StepIndicator current={paso} />

<div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 flex items-start justify-center px-4 py-16">
  <div class="bg-white shadow-xl rounded-3xl p-8 sm:p-10 w-full max-w-2xl">

    {#if paso === 1}
    <h1 class="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">Paso 1: Elige una materia</h1>
    <StepSelector bind:seleccion={materiaSeleccionada} on:next={siguientePaso} />

    {:else if paso === 2}
    <h1 class="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">Paso 2: Elige nivel de dificultad</h1>
    <DifficultySelector bind:seleccion={nivelSeleccionado} on:next={siguientePaso} on:back={pasoAnterior} />

    {:else if paso === 3}
    <h1 class="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">Paso 3: Responde las preguntas</h1>

    {#if cargando && preguntas.length === 0}

    <LoadingSpinner mensaje="🧠 Generando las primeras preguntas con IA..." />
    {:else if preguntas.length > 0}
    <div class="w-full bg-gray-200 rounded-full h-3 mb-6">
      <div class="bg-blue-600 h-3 rounded-full transition-all duration-500"
        style="width: {((preguntaActual + 1) / maxPreguntas  * 100)}%"></div>
    </div>
    <p class="text-center text-sm text-gray-600 mb-4">
      Pregunta {preguntaActual + 1} de {maxPreguntas}
    </p>
    <p class="text-center text-sm text-gray-600 mb-2">
  Modo seleccionado: <strong class="capitalize">{modo}</strong>
</p>
<p class="text-center text-xs text-gray-500 mb-2">
  Tiempo total asignado: {Math.floor(tiempoTotalSegundos / 60)} minutos
</p>

    {#if tiempoTotalSegundos > 0}
    <Timer tiempoTotal={tiempoTotalSegundos} on:tiempoFinalizado={finalizarTest} />
    {/if}

 {#if preguntas.length > 0}
  {#if preguntas[preguntaActual]}
    <QuestionCard
      pregunta={preguntas[preguntaActual]}
      numero={preguntaActual + 1}
      {testFinalizado}
      bind:respuestasUsuario={respuestasUsuario}
      onRespuesta={(idx, r) => respuestasUsuario[idx] = r}
    />
  {:else}
    <p>⏳ Cargando pregunta...</p>
  {/if}
{/if}

      <div class="mt-6 flex justify-between items-center">
        {#if preguntaActual > 0}
        <button class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-sm hover:bg-gray-400 transition-colors"
          on:click={anteriorPregunta}>Anterior</button>
        {/if}

        {#if preguntaActual < preguntas.length - 1} <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          on:click={siguientePregunta}>Siguiente</button>
          {:else if preguntas.length < maxPreguntas } {#if cargando} <span class="px-4 py-2 text-gray-500 text-sm">
            Generando siguiente pregunta...</span>
            {:else}
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              on:click={siguientePregunta}>Siguiente</button>
            {/if}
            {:else}
            <FinalizarTestButton on:finalizar={finalizarTest} />
            {/if}
      </div>
      {:else}
      <p class="text-center text-red-500">No se pudieron cargar las preguntas. Intenta de nuevo más tarde.</p>
      {/if}
      {/if}
  </div>
</div>

<style>
  /* Tus estilos CSS */
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  .spinner {
    border: 4px solid #cbd5e0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spinner 0.8s linear infinite;
  }
</style>