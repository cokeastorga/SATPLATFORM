<script lang="ts">
  export let current = 1;

  const steps = ['Materia', 'Nivel', 'Preguntas', 'Resultados'];
</script>

<div class="mt-10 flex items-center justify-center space-x-4 sm:space-x-8 mb-6">
  {#each steps as step, index}
    <div class="flex items-center space-x-2">
      <div
        class={`rounded-full w-8 h-8 flex items-center justify-center border-2 transition
          ${index + 1 === current ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-300 dark:border-gray-600'}
        `}
      >
        {index + 1}
      </div>
      <span
        class={`text-sm font-medium transition ${
          index + 1 === current ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {step}
      </span>
    </div>

    {#if index < steps.length - 1}
      <div class="w-6 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
    {/if}
  {/each}
</div>
