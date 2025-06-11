<script lang="ts">
  export let mensaje: string = 'Cargando...';
</script>

<div class="flex flex-col items-center py-10 text-center animate-fade-in">
  <div class="spinner mb-4"></div>
  <p class="text-blue-600 text-lg font-semibold">{mensaje}</p>
  <p class="text-sm text-gray-500 mt-1">Por favor espera unos segundos</p>
</div>

<style>
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  .spinner {
    border: 4px solid #cbd5e0;
    border-top-color: #3b82f6;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spinner 0.8s linear infinite;
  }

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
    animation: fade-in 0.4s ease-out forwards;
  }
</style>
