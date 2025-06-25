<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let respuestasCorrectas: number;
  export let totalPreguntas: number;

  const dispatch = createEventDispatcher();

  function reintentar() {
    dispatch('reintentar');
  }

  function bajarNivel() {
    dispatch('bajarnivel');
  }

  function guardarTest() {
    dispatch('guardar');
  }

  $: puntaje = Math.round((respuestasCorrectas / totalPreguntas) * 1000 + 400);
</script>

<div class="mt-8 p-6 bg-white border border-blue-200 rounded-3xl shadow-lg text-center animate-fade-in">
  <h2 class="text-2xl font-bold text-blue-800 mb-2">🎉 ¡Test finalizado!</h2>
  <p class="text-gray-700 text-lg">Respondiste correctamente <strong>{respuestasCorrectas}</strong> de <strong>{totalPreguntas}</strong> preguntas.</p>
  <p class="text-blue-700 mt-2 text-lg font-semibold">📊 Puntaje estimado: <span class="text-xl">{puntaje}</span></p>

  <div class="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
    <button
      on:click={reintentar}
      class="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      🔁 Volver a intentar
    </button>
    <button
      on:click={bajarNivel}
      class="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
    >
      🔽 Bajar nivel
    </button>
    <button
      on:click={guardarTest}
      class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
    >
      💾 Guardar Test
    </button>
  </div>
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
  }
</style>
