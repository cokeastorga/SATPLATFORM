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

  async function iniciarGeneracionProgresiva() {
    while (preguntas.length < maxPreguntas) {
      try {
        cargando = true;
        const nueva = await generarPreguntaValida(materiaSeleccionada, nivelSeleccionado);
        preguntas = [...preguntas, nueva];
      } catch (e) {
        console.warn('🔁 Detenido: no se pudo generar una pregunta válida:', e);
        break;
      } finally {
        cargando = false;
      }
    }
  }


  // --- Lógica de Pre-generación ---

  async function asegurarBufferPreguntas(cantidadInicial: number = 3) {
    if (paso === 3 && !cargando) {
      const preguntasExistentes = preguntas.length;
      const preguntasDisponiblesEnBuffer = preguntas.length - preguntaActual;

      const preguntasFaltantesParaBuffer = maxPreguntas - preguntasDisponiblesEnBuffer;

      const preguntasAGenerar = Math.min(
        preguntasFaltantesParaBuffer,
        cantidadInicial
      );

      if (preguntasAGenerar > 0) {
        cargando = true;
        console.log(`Generando ${preguntasAGenerar} preguntas para rellenar el buffer.`);
        for (let i = 0; i < preguntasAGenerar; i++) {
          try {
            const nueva = await generarPreguntaValida(materiaSeleccionada, nivelSeleccionado);
            if (nueva) {
              preguntas.push(nueva);
            } else {
              console.warn('⚠️ Se intentó generar una pregunta, pero se recibió null.');
              break;
            }
          } catch (error) {
            console.error('❌ Error generando pregunta para el buffer:', error);
            break;
          }
        }
        cargando = false;
      }
    }
  }



  // Bloque reactivo para disparar la generación inicial de preguntas
  // cuando el usuario llega al Paso 3 y el array de preguntas está vacío.
$: if (paso === 3 && preguntas.length === 0) {
  const materia = materiaSeleccionada.toLowerCase().trim();
  if (materia === 'math' || materia === 'matemáticas') {
    tiempoTotalSegundos = 64 * 60;
    maxPreguntas = 44;
    puntajeMaximo = 800;
  } else if (materia === 'reading' || materia === 'reading and writing') {
    tiempoTotalSegundos = 70 * 60;
    maxPreguntas = 49;
    puntajeMaximo = 800;
  }

  iniciarGeneracionProgresiva();
}



  // --- Lógica de Navegación ---

  async function siguientePregunta() {
    // Caso 1: Hay más preguntas YA DISPONIBLES en el array 'preguntas'.
    if (preguntaActual < preguntas.length - 1) {
      preguntaActual++; // Simplemente avanza al siguiente índice
      asegurarBufferPreguntas(); // Llama a precargar en segundo plano
    } else if (preguntas.length < maxPreguntas) {
      // Caso 2: Estamos en la última pregunta cargada, pero aún no hemos alcanzado el límite total.
      // Primero, aseguramos que el buffer se intente rellenar (esto podría cambiar 'preguntas.length')
      cargando = true; // Muestra spinner si no estaba ya visible
      await asegurarBufferPreguntas(2); // Espera a que termine la generación

      // Después de la generación, verifica si ahora hay una nueva pregunta disponible.
      if (preguntaActual < preguntas.length - 1) {
        preguntaActual++; // Si hay, avanza.
      } else {
        // Esto significa que se intentó generar, pero no se añadió una nueva pregunta
        // (quizás porque ya se alcanzó el maxPreguntas  o hubo un error en la generación).
        // En este caso, el flujo debería llevar a finalizar el test o mostrar un mensaje.
        console.log('No se pudieron cargar más preguntas o se alcanzó el límite. Mostrar botón de finalizar.');
        // Opcional: Podrías forzar el test a finalizar si no se pueden generar más preguntas
        // finalizarTest();
      }
      cargando = false; // Oculta spinner
    } else {
      // Caso 3: Hemos llegado al final de las preguntas generadas y también al límite total.
      console.log('Se ha llegado al final del test. Mostrar botón de Finalizar.');
      // La UI ya debería mostrar el botón de finalizar test.
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
    if (paso === 3) {
      const materia = materiaSeleccionada.toLowerCase().trim();
      if (materia === 'math' || materia === 'matemáticas') {
        tiempoTotalSegundos = 64 * 60;
        maxPreguntas = 44;
        puntajeMaximo = 800;
      } else if (materia === 'reading' || materia === 'reading and writing') {
        tiempoTotalSegundos = 70 * 60;
        maxPreguntas = 49;
        puntajeMaximo = 800;
      }
    }
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
    {#if tiempoTotalSegundos > 0}
    <Timer tiempoTotal={tiempoTotalSegundos} on:tiempoFinalizado={finalizarTest} />
    {/if}

    <QuestionCard pregunta={preguntas[preguntaActual]} numero={preguntaActual + 1} {testFinalizado}
      bind:respuestasUsuario={respuestasUsuario} onRespuesta={(idx, r)=> respuestasUsuario[idx] = r}
      />

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