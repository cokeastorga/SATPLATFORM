<script lang="ts">
  import { goto } from '$app/navigation';

  function comenzar() {
    goto('/practice');
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-100 flex items-center justify-center px-6 py-16">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
    
    <!-- Texto e información -->
    <div class="text-center lg:text-left space-y-6">
      <h1 class="text-5xl font-extrabold text-blue-800 leading-tight">
        Prepárate para el <span class="text-sky-600">SAT Digital</span><br />
        con ayuda de la <span class="text-purple-600">Inteligencia Artificial</span>
      </h1>
      <p class="text-gray-700 text-lg">
        Practica con preguntas generadas en tiempo real, adapta tu nivel de dificultad y obtén feedback instantáneo. Una experiencia realista del SAT, desde cualquier dispositivo.
      </p>

      <ul class="text-left text-gray-700 space-y-3 text-base">
        <li class="flex items-center gap-2"><span class="text-green-500 text-xl">✔️</span> Preguntas estilo SAT generadas por IA</li>
        <li class="flex items-center gap-2"><span class="text-green-500 text-xl">✔️</span> Módulos de Reading, Writing y Matemáticas</li>
        <li class="flex items-center gap-2"><span class="text-green-500 text-xl">✔️</span> Retroalimentación y puntaje al instante</li>
      </ul>

      <button
        on:click={comenzar}
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-md transition duration-300 mt-4"
      >
        🚀 Comenzar Ahora
      </button>
    </div>

    <!-- Imagen educativa -->
    <div class="w-full max-w-md mx-auto lg:max-w-lg animate-fade-in">
      <img
        src="/sat-education.png"
        alt="Ilustración SAT"
        class="w-full rounded-xl shadow-xl"
      />
    </div>
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
    animation: fade-in 0.6s ease-out both;
  }
</style>
