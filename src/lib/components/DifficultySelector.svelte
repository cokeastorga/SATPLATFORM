<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let seleccion = '';
  const dispatch = createEventDispatcher();

  const niveles = [
    { nombre: 'Fácil', color: 'border-green-400 bg-green-50 text-green-800' },
    { nombre: 'Intermedio', color: 'border-yellow-400 bg-yellow-50 text-yellow-800' },
    { nombre: 'Difícil', color: 'border-red-400 bg-red-50 text-red-800' }
  ];

 function continuar() {
  if (seleccion) dispatch('next', { seleccion });
}


  function volver() {
    dispatch('back');
  }

  function seleccionarNivel(n: string) {
  seleccion = n;
  dispatch('seleccion', seleccion);
}
</script>

<div class="space-y-6">
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {#each niveles as { nombre, color }}
      <button
        class={`p-4 rounded-xl border-2 font-semibold transition-all duration-200 ${
          seleccion === nombre
            ? color
            : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
        }`}
        on:click={() => seleccionarNivel(nombre)}
      >
        {nombre}
      </button>
    {/each}
  </div>

  <div class="flex justify-between pt-4">
    <button
      class="text-gray-600 hover:text-gray-900 border border-gray-400 px-4 py-2 rounded-full"
      on:click={volver}
    >
      ← Volver
    </button>

    <button
      class="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
      on:click={continuar}
      disabled={!seleccion}
    >
      Continuar →
    </button>
  </div>
</div>
