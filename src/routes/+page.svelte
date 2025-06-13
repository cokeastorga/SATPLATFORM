<script lang="ts">
  import { goto } from '$app/navigation';

  function comenzar() {
    goto('/tipo-test');
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-100 flex items-center justify-center px-4 py-16">
  <div class="bg-white rounded-3xl shadow-xl p-10 sm:p-12 max-w-2xl w-full border border-blue-200 animate-fade-in">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-extrabold text-blue-700 mb-2">🧠 Instrucciones del Test SAT</h1>
      <p class="text-gray-600 text-lg">Lee cuidadosamente antes de comenzar tu práctica</p>
    </div>

    <ul class="space-y-4 text-gray-700 text-base leading-relaxed">
      <li class="flex items-start gap-3">
        <span class="text-green-500 text-xl">✅</span>
        Selecciona una materia (Matemáticas o Reading & Writing).
      </li>
      <li class="flex items-start gap-3">
        <span class="text-green-500 text-xl">✅</span>
        Elige un nivel: Liviano, Medio o Difícil.
      </li>
      <li class="flex items-start gap-3">
        <span class="text-green-500 text-xl">✅</span>
        Responde dentro del tiempo asignado por sección.
      </li>
      <li class="flex items-start gap-3">
        <span class="text-green-500 text-xl">✅</span>
        Usa el botón <strong>Siguiente</strong> para avanzar.
      </li>
      <li class="flex items-start gap-3">
        <span class="text-green-500 text-xl">✅</span>
        Al final, recibirás un puntaje y retroalimentación detallada.
      </li>
      <li class="flex items-start gap-3">
        <span class="text-green-500 text-xl">✅</span>
        Las preguntas son generadas automáticamente por IA.
      </li>
    </ul>

    <div class="mt-10 text-center">
      <button
        on:click={comenzar}
        class="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300"
      >
        🚀 Comenzar Test
      </button>
    </div>
  </div>
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
    animation: fade-in 0.4s ease-out both;
  }
</style>
