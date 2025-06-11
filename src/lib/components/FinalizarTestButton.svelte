<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function finalizar() {
    dispatch('finalizar');
  }
</script>

<div class="flex justify-center mt-6">
  <button
    on:click={finalizar}
    class="px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300"
  >
    ✅ Finalizar Test
  </button>
</div>
