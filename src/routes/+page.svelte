<script lang="ts">
  import { goto } from '$app/navigation';

  function comenzar() {
    goto('/tipo-test');
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-blue-50 via-white to-sky-100 flex items-center justify-center px-4 py-16">
  <div class="bg-white rounded-3xl shadow-2xl p-10 sm:p-12 max-w-2xl w-full text-center border border-blue-100">
    <div class="mb-4">
      <span class="text-5xl">🧠</span>
    </div>

    <h1 class="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-6">
      Práctica SAT con IA
    </h1>

    <p class="text-gray-600 text-lg sm:text-xl leading-relaxed mb-8">
      Mejora tus habilidades para el SAT con tests inteligentes generados automáticamente por IA. Elige tu materia y nivel de dificultad, ¡y empieza a practicar como nunca antes!
    </p>

    <button
      on:click={comenzar}
      class="bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition transform duration-200"
    >
      Comenzar ahora 🚀
    </button>
  </div>
</div>
