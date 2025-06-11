<script lang="ts">
  import { createEventDispatcher } from 'svelte';
import { BookOpen, PenLine, Calculator, Brain } from 'lucide-svelte';

  export let seleccion = '';
  const dispatch = createEventDispatcher();

 const materias = [
  { nombre: 'Reading', icon: BookOpen },
  { nombre: 'Writing', icon: PenLine },
  { nombre: 'Math - No Calculator', icon: Brain },
  { nombre: 'Math - Calculator', icon: Calculator }
];

  function continuar() {
    if (seleccion) dispatch('next');
  }

  function seleccionarMateria(materia: string) {
    seleccion = materia;
  }
</script>

<div class="space-y-5">
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {#each materias as { nombre, icon: Icon }}
      <button
        class={`flex items-center gap-4 p-4 border-2 rounded-xl w-full text-left transition-all duration-200 ${
          seleccion === nombre
            ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
            : 'border-gray-200 hover:border-blue-300'
        }`}
        on:click={() => seleccionarMateria(nombre)}
      >
        <svelte:component this={Icon} class="w-6 h-6 text-blue-600" />
        <span>{nombre}</span>
      </button>
    {/each}
  </div>

  <div class="flex justify-end pt-4">
    <button
      class="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
      on:click={continuar}
      disabled={!seleccion}
    >
      Siguiente →
    </button>
  </div>
</div>
