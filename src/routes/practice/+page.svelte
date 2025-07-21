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
  import { onMount } from 'svelte';

  let paso = 0;
  let modo = '';
  let cantidad = 5;
  let materiaSeleccionada: string = '';
  let nivelSeleccionado: string = '';
  let tiempoTotalSegundos: number = 0;
  let maxPreguntas: number = 5;
  let puntajeMaximo: number = 800;
  let errorMensaje: string | null = null;

  let preguntas: Array<PreguntaSAT> = [];
  let respuestasUsuario: Record<number, string> = {};
  let testFinalizado = false;
  let cargando = false;
  let preguntaActual = 0;

function normalizarMateriaUI(materia: string): PreguntaSAT['materia'] {
  const normalized = materia.toLowerCase().trim();
  if (normalized.includes('math') || normalized.includes('matematic')) {
    return 'matematicas';
  } 
  if (normalized.includes('reading') || normalized.includes('writing')) {
    return 'reading and writing';
  }
  // Default fallback
  return 'reading and writing';
}


  async function generarSiguientePregunta() {
    if (preguntas.length >= maxPreguntas) return;
    cargando = true;
    errorMensaje = null;
    try {
      const materia = normalizarMateriaUI(materiaSeleccionada);
      const nueva = await generarPreguntaValida(materia, nivelSeleccionado);
      if (nueva) {
        preguntas = [...preguntas, nueva];
        preguntaActual = preguntas.length - 1;
      } else {
        errorMensaje = 'No se pudo generar la pregunta. Intenta de nuevo.';
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        errorMensaje = `Cuota excedida. Por favor, espera ${error.retryAfterSeconds} segundos e intenta de nuevo.`;
      } else {
        errorMensaje = 'Error al generar la pregunta. Intenta de nuevo más tarde.';
      }
      console.error('❌ Error generando nueva pregunta:', error);
    } finally {
      cargando = false;
    }
  }

  function calcularTiempoPorPregunta(cantidad: number, materia: PreguntaSAT['materia']): number {
    const minutosPorPregunta = materia === 'matematicas' ? 1.5 : 1.18;
    return Math.round(minutosPorPregunta * 60 * cantidad);
  }

  function configurarTest() {
    const materia = normalizarMateriaUI(materiaSeleccionada);
    maxPreguntas = modo === 'liviano' ? 5 : modo === 'ensayo' ? 54 : 44;
    tiempoTotalSegundos = calcularTiempoPorPregunta(maxPreguntas, materia);
    puntajeMaximo = 800;
    generarSiguientePregunta();
  }

  let yaInicializado = false;
  $: if (paso === 4 && !yaInicializado && preguntas.length === 0 && !cargando) {
    yaInicializado = true;
    configurarTest();
  }

  async function siguientePregunta() {
    if (preguntaActual < preguntas.length - 1) {
      preguntaActual++;
    } else if (preguntas.length < maxPreguntas) {
      await generarSiguientePregunta();
    }
  }

  function anteriorPregunta() {
    if (preguntaActual > 0) {
      preguntaActual--;
    }
  }

  async function siguientePaso() {
    paso += 1;
  }

  function pasoAnterior() {
    paso -= 1;
  }

  function seleccionarModo(tipo: string) {
    modo = tipo;
    cantidad = tipo === 'liviano' ? 5 : tipo === 'ensayo' ? 44 : 5;
    siguientePaso();
  }

function badgeColorForCategory(cat: string) {
  switch (cat) {
    case 'Information and Ideas': return '#38bdf8'; // azul
    case 'Expression of Ideas': return '#fde68a'; // amarillo suave
    case 'Standard English Conventions': return '#fca5a5'; // rojo claro
    case 'Craft and Structure': return '#c4b5fd'; // violeta
    default: return '#a3a3a3'; // gris
  }
}


  function finalizarTest() {
    if (!preguntas.length) return;
    const respuestasCorrectas = preguntas.reduce((acc, pregunta, i) => {
      return respuestasUsuario[i] === pregunta.respuestaCorrecta ? acc + 1 : acc;
    }, 0);
    const resultadosTest = {
      preguntas,
      respuestasUsuario,
      respuestasCorrectas,
      maxPreguntas,
      puntajeMaximo,
      materiaSeleccionada,
      categoriaPorPregunta: preguntas.map(p => p.categoria)
    };
    localStorage.setItem('resultadosTest', JSON.stringify(resultadosTest));
    goto('/resumen');
  }
</script>

<StepIndicator current={paso} />

<div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 flex items-start justify-center px-4 py-16">
  <div class="bg-white shadow-xl rounded-3xl p-8 sm:p-10 w-full max-w-2xl">
    {#if paso === 0}
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-blue-700 mb-2">🧠 Instrucciones del Test SAT</h1>
        <p class="text-gray-600 text-lg">Lee cuidadosamente antes de comenzar tu práctica</p>
      </div>
      <ul class="space-y-4 text-gray-700 text-base leading-relaxed mb-8">
        <li class="flex items-start gap-3"><span class="text-green-500 text-xl">✅</span> Selecciona una materia (Matemáticas o Reading and Writing).</li>
        <li class="flex items-start gap-3"><span class="text-green-500 text-xl">✅</span> Elige un nivel: Fácil, Medio o Difícil.</li>
        <li class="flex items-start gap-3"><span class="text-green-500 text-xl">✅</span> Responde dentro del tiempo asignado por sección.</li>
        <li class="flex items-start gap-3"><span class="text-green-500 text-xl">✅</span> Usa el botón <strong>Siguiente</strong> para avanzar.</li>
        <li class="flex items-start gap-3"><span class="text-green-500 text-xl">✅</span> Al final, recibirás un puntaje y retroalimentación detallada.</li>
        <li class="flex items-start gap-3"><span class="text-green-500 text-xl">✅</span> Las preguntas son generadas automáticamente por IA.</li>
      </ul>
      <div class="text-center">
        <button on:click={siguientePaso} class="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300">🚀 Comenzar Test</button>
      </div>

    {:else if paso === 1}
      <h1 class="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">Paso 1: Elige tipo de test</h1>
      <div class="grid gap-6 sm:grid-cols-2">
        <button on:click={() => seleccionarModo('liviano')} class="bg-white border border-blue-200 shadow-md rounded-2xl p-6 hover:bg-blue-50 transition">
          <h2 class="text-2xl font-semibold text-blue-700 mb-2">Test Liviano</h2>
          <p class="text-gray-500">5 preguntas para practicar rápidamente.</p>
        </button>
        <button on:click={() => seleccionarModo('ensayo')} class="bg-white border border-red-200 shadow-md rounded-2xl p-6 hover:bg-red-50 transition">
          <h2 class="text-2xl font-semibold text-red-700 mb-2">Desafío SAT</h2>
          <p class="text-gray-500">Simulación completa del SAT (44 y 54 preguntas).</p>
        </button>
      </div>

    {:else if paso === 2}
      <h1 class="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">Paso 2: Elige una materia</h1>
      <StepSelector
        bind:seleccion={materiaSeleccionada}
        opciones={['Matemáticas', 'Reading and Writing']}
        on:next={siguientePaso}
        on:back={pasoAnterior}
      />

    {:else if paso === 3}
      <h1 class="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">Paso 3: Elige nivel de dificultad</h1>
      <DifficultySelector
        bind:seleccion={nivelSeleccionado}
        opciones={['Fácil', 'Medio', 'Difícil']}
        on:next={siguientePaso}
        on:back={pasoAnterior}
      />

    {:else if paso === 4}
      <h1 class="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">Paso 4: Responde las preguntas</h1>

      {#if errorMensaje}
        <p class="text-center text-red-500 mb-4">{errorMensaje}</p>
        <div class="text-center mt-4">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors" on:click={configurarTest}>Reintentar</button>
        </div>
      {/if}

      {#if cargando && preguntas.length === 0}
        <LoadingSpinner mensaje="🧠 Generando las primeras preguntas con IA..." />

      {:else if preguntas.length > 0}
        <div class="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div class="bg-blue-600 h-3 rounded-full transition-all duration-500" style="width: {((preguntaActual + 1) / maxPreguntas * 100)}%"></div>
        </div>
        <p class="text-center text-sm text-gray-600 mb-4">Pregunta {preguntaActual + 1} de {maxPreguntas}</p>
        <p class="text-center text-sm text-gray-600 mb-2">Modo seleccionado: <strong class="capitalize">{modo}</strong></p>
        <p class="text-center text-sm text-gray-600 mb-2">Materia: <strong>{materiaSeleccionada}</strong></p>
        
        
        {#if preguntas[preguntaActual]?.categoria}
          <p class="text-center text-sm text-gray-600 mb-2">Categoría: <strong>{preguntas[preguntaActual].categoria}</strong></p>
          <!-- Arriba del pasaje, bajo Materia/Categoría -->
<div class="flex items-center justify-center gap-2 mb-1">
  {#if preguntas[preguntaActual]?.categoria}
    <span
      class="inline-block rounded-full px-2 py-1 text-xs font-semibold"
      style="background-color: {badgeColorForCategory(preguntas[preguntaActual].categoria)};"
    >
      {preguntas[preguntaActual].categoria}
    </span>
  {/if}

  {#if preguntas[preguntaActual]?.tema && preguntas[preguntaActual]?.subtema}
    <span class="text-xs text-gray-500">
      <span class="font-bold">Tema:</span> {preguntas[preguntaActual].tema} | 
      <span class="font-bold">Subtema:</span> {preguntas[preguntaActual].subtema}
    </span>
  {/if}
</div>

        {/if}
        <p class="text-center text-xs text-gray-500 mb-2">Tiempo total asignado: {Math.floor(tiempoTotalSegundos / 60)} minutos</p>

        {#if tiempoTotalSegundos > 0}
          <Timer tiempoTotal={tiempoTotalSegundos} on:tiempoFinalizado={finalizarTest} />
        {/if}

        {#if preguntas[preguntaActual]}
          <div transition:fade={{ duration: 300 }}>
            <QuestionCard
              pregunta={preguntas[preguntaActual]}
              numero={preguntaActual + 1}
              {testFinalizado}
              bind:respuestasUsuario
              on:respuesta={(e) => {
                const { idx, respuesta } = e.detail;
                if (typeof idx === 'number' && typeof respuesta === 'string') {
                  respuestasUsuario[idx] = respuesta;
                }
              }}
            />
          </div>
        {:else}
          <p class="text-sm text-gray-500 text-center mt-2">⏳ Cargando pregunta...</p>
        {/if}

        <div class="mt-6 flex justify-between items-center">
          {#if preguntaActual > 0}
            <button class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-sm hover:bg-gray-400 transition-colors" on:click={anteriorPregunta}>Anterior</button>
          {:else}
            <span></span>
          {/if}

          {#if preguntaActual < preguntas.length - 1}
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors" on:click={siguientePregunta}>Siguiente</button>
          {:else if preguntas.length < maxPreguntas}
            {#if cargando}
              <span class="px-4 py-2 text-gray-500 text-sm">Generando siguiente pregunta...</span>
            {:else}
              <button class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors" on:click={siguientePregunta}>Siguiente</button>
            {/if}
          {:else}
            <FinalizarTestButton on:finalizar={finalizarTest} />
          {/if}
        </div>

      {:else}
        <p class="text-center text-red-500">No se pudieron cargar las preguntas. Intenta de nuevo más tarde.</p>
        <div class="text-center mt-4">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors" on:click={configurarTest}>Reintentar</button>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
</style>