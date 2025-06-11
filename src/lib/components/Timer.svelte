<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let tiempoTotal: number = 0; // en segundos

  const dispatch = createEventDispatcher();
  let tiempoRestante = tiempoTotal;
  let intervalo: any;

  onMount(() => {
    tiempoRestante = tiempoTotal;

    intervalo = setInterval(() => {
      if (tiempoRestante > 0) {
        tiempoRestante--;
      } else {
        clearInterval(intervalo);
        dispatch('tiempoFinalizado');
      }
    }, 1000);
  });

  onDestroy(() => clearInterval(intervalo));

  function formatoTiempo(segundos: number): string {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
</script>

<div class="text-sm sm:text-base text-gray-600 text-right mb-4 font-mono">
  ⏱️ Tiempo restante: <span class="font-bold">{formatoTiempo(tiempoRestante)}</span>
</div>
