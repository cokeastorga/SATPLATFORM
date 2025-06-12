<script lang="ts">
  import { goto } from '$app/navigation';

  function seleccionarTipo(tipo: string) {
    goto(`/practice?modo=${tipo}`);
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white px-4 py-16 text-center">
  <h1 class="text-4xl font-bold text-blue-800 mb-4">¿Cómo quieres practicar hoy?</h1>
  <p class="text-gray-600 max-w-xl mb-10 text-lg">Elige un tipo de test. Las preguntas se adaptarán automáticamente a la materia que elijas.</p>

  <div class="grid gap-6 sm:grid-cols-3 max-w-4xl w-full">
    <button
      class="bg-white border border-blue-200 shadow-md rounded-2xl p-6 hover:bg-blue-50 transition"
      on:click={() => seleccionarTipo('liviano')}>
      <h2 class="text-2xl font-semibold text-blue-700 mb-2">Test Liviano</h2>
      <p class="text-gray-500">5 preguntas para practicar rápidamente.</p>
    </button>

    <button
      class="bg-white border border-purple-200 shadow-md rounded-2xl p-6 hover:bg-purple-50 transition"
      on:click={() => seleccionarTipo('ensayo')}>
      <h2 class="text-2xl font-semibold text-purple-700 mb-2">Ensayo SAT</h2>
      <p class="text-gray-500">20 preguntas para simular un ensayo.</p>
    </button>

    <button
      class="bg-white border border-red-200 shadow-md rounded-2xl p-6 hover:bg-red-50 transition"
      on:click={() => seleccionarTipo('desafio')}>
      <h2 class="text-2xl font-semibold text-red-700 mb-2">Desafío SAT</h2>
      <p class="text-gray-500">Máxima cantidad de preguntas reales.</p>
    </button>
  </div>
</div>
